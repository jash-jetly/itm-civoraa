import os
import smtplib
import random
import string
import time
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Simple health endpoint for uptime checks
@app.get('/')
def health():
    return jsonify({ 'ok': True, 'service': 'otp', 'version': '1.0' })

# In-memory store: email -> { code: str, expires_at: float }
otp_store = {}
OTP_TTL_SECONDS = int(os.getenv('OTP_TTL_SECONDS', '600'))  # default 10 minutes

SMTP_HOST = os.getenv('SMTP_HOST', 'smtp.gmail.com')
SMTP_USE_SSL = (os.getenv('SMTP_USE_SSL', 'true').lower() == 'true')
# Default port depends on SSL usage: 465 (SSL) or 587 (STARTTLS)
_port_env = os.getenv('SMTP_PORT')
SMTP_PORT = int(_port_env) if _port_env else (465 if SMTP_USE_SSL else 587)
SMTP_USER = os.getenv('SMTP_USER') or ''
# Strip spaces commonly shown in Gmail app passwords UI
SMTP_PASS = (os.getenv('SMTP_PASS') or '').replace(' ', '')
SENDER_NAME = os.getenv('SENDER_NAME', SMTP_USER or 'CIVORAA')
SENDER_EMAIL = os.getenv('SENDER_EMAIL', SMTP_USER)

def generate_otp(length: int = 6) -> str:
    return ''.join(random.choices(string.digits, k=length))

def send_email(recipient: str, subject: str, body_text: str, body_html: str):
    if not SMTP_USER or not SMTP_PASS:
        raise RuntimeError('SMTP credentials not set. Please set SMTP_USER and SMTP_PASS env vars.')
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = f"{SENDER_NAME} <{SENDER_EMAIL}>"
    msg['To'] = recipient
    # Attach plain-text and HTML versions
    part_text = MIMEText(body_text, 'plain')
    part_html = MIMEText(body_html, 'html')
    msg.attach(part_text)
    msg.attach(part_html)
    # Use a short socket timeout so HTTP requests fail fast when SMTP is unreachable
    SOCKET_TIMEOUT = int(os.getenv('SMTP_TIMEOUT_SECONDS', '20'))

    try:
        if SMTP_USE_SSL:
            # SSL on specified port (default 465)
            with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, timeout=SOCKET_TIMEOUT) as server:
                try:
                    server.ehlo()
                except Exception:
                    pass
                server.login(SMTP_USER, SMTP_PASS)
                server.sendmail(SENDER_EMAIL, [recipient], msg.as_string())
        else:
            # STARTTLS on specified port (Zoho prefers 587)
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=SOCKET_TIMEOUT) as server:
                server.ehlo()
                server.starttls()
                server.ehlo()
                server.login(SMTP_USER, SMTP_PASS)
                server.sendmail(SENDER_EMAIL, [recipient], msg.as_string())
    except Exception as e:
        # Provide a clearer error up the stack so the API responds quickly
        raise RuntimeError(f"SMTP send failed (host={SMTP_HOST}, port={SMTP_PORT}, ssl={SMTP_USE_SSL}): {str(e)}")

@app.post('/send-otp')
def send_otp():
    data = request.get_json(silent=True) or {}
    email = (data.get('email') or '').strip()
    if not email:
        return jsonify({ 'success': False, 'error': 'Email is required.' }), 400

    # generate and store OTP with expiry
    code = generate_otp(6)
    expires_at = time.time() + OTP_TTL_SECONDS
    otp_store[email] = { 'code': code, 'expires_at': expires_at }

    # email content
    subject = 'Your CIVORAA Verification Code'
    body_text = (
        f"Your one-time verification code is: {code}\n\n"
        "This code expires in 10 minutes.\n\n"
        "If you did not request this, you can ignore this email."
    )
    body_html = f"""
    <!DOCTYPE html>
    <html lang=\"en\">
    <head>
      <meta charset=\"UTF-8\" />
      <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
      <title>{subject}</title>
      <style>
        body {{ background:#0A0A0A; color:#E5E7EB; font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif; margin:0; padding:24px; }}
        .card {{ max-width:560px; margin:0 auto; background:#111111; border:1px solid #1A1A1A; border-radius:16px; padding:24px; }}
        .brand {{ display:flex; align-items:center; gap:12px; margin-bottom:16px; color:#9DA3AF; font-size:12px; text-transform:uppercase; letter-spacing:0.08em; }}
        .title {{ font-size:22px; font-weight:700; margin:0 0 8px; color:#FFFFFF; }}
        .subtitle {{ font-size:14px; color:#9DA3AF; margin:0 0 20px; }}
        .code {{ display:inline-block; font-size:24px; font-weight:800; letter-spacing:0.2em; background:#0A0A0A; color:#FFFFFF; padding:12px 16px; border-radius:12px; border:1px solid #1A1A1A; box-shadow:0 0 30px rgba(249,113,113,0.2); }}
        .cta {{ margin-top:20px; font-size:12px; color:#9DA3AF; }}
        .footer {{ margin-top:24px; font-size:12px; color:#6B7280; }}
        .accent {{ color:#F97171; }}
      </style>
    </head>
    <body>
      <div class=\"card\">
        <div class=\"brand\">{SENDER_NAME} • CIVORAA</div>
        <h1 class=\"title\">Your Verification Code</h1>
        <p class=\"subtitle\">Use this code to verify your email. It expires in <span class=\"accent\">10 minutes</span>.</p>
        <div class=\"code\">{code}</div>
        <p class=\"cta\">If you didn’t request this, you can ignore this email.</p>
        <div class=\"footer\">Sent to {email}. Do not share this code.</div>
      </div>
    </body>
    </html>
    """
    try:
        send_email(email, subject, body_text, body_html)
        return jsonify({ 'success': True })
    except Exception as e:
        # On failure, clean up stored OTP to avoid stale
        otp_store.pop(email, None)
        return jsonify({ 'success': False, 'error': str(e) }), 500

@app.post('/verify-otp')
def verify_otp():
    data = request.get_json(silent=True) or {}
    email = (data.get('email') or '').strip()
    otp = (data.get('otp') or '').strip()
    if not email or not otp:
        return jsonify({ 'success': False, 'error': 'Email and OTP are required.' }), 400

    entry = otp_store.get(email)
    now = time.time()
    if not entry:
        return jsonify({ 'success': False, 'error': 'No OTP found. Please request a new code.' }), 404
    if now > entry['expires_at']:
        otp_store.pop(email, None)
        return jsonify({ 'success': False, 'error': 'OTP expired. Please request a new code.' }), 410
    if otp != entry['code']:
        return jsonify({ 'success': False, 'error': 'Invalid verification code.' }), 400

    # success: consume OTP
    otp_store.pop(email, None)
    return jsonify({ 'success': True })

if __name__ == '__main__':
    port = int(os.getenv('PORT', '8000'))
    app.run(host='0.0.0.0', port=port, debug=True)