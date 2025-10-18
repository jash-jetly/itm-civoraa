// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Environment variables
const PORT = process.env.PORT || 8000;
const OTP_TTL_SECONDS = parseInt(process.env.OTP_TTL_SECONDS || '600', 10);

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SENDER_NAME = process.env.SENDER_NAME || SMTP_USER;
const SENDER_EMAIL = process.env.SENDER_EMAIL || SMTP_USER;

// In-memory store: email -> { code, expiresAt }
const otpStore = {};

// Generate OTP
function generateOtp(length = 6) {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
}

// Create SMTP transporter with fallback
function createTransporter(useSSL = true) {
  return nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: useSSL ? 465 : 587,
    secure: useSSL, // true for 465, false for 587
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
  });
}

let transporter = createTransporter(true); // Start with SSL

// Health check
app.get('/', (req, res) => {
  res.json({ ok: true, service: 'otp', version: '1.0' });
});

// Send OTP endpoint
app.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, error: 'Email is required.' });

  const code = generateOtp();
  const expiresAt = Date.now() + OTP_TTL_SECONDS * 1000;
  otpStore[email] = { code, expiresAt };

  const subject = 'Your CIVORAA Verification Code';
  const bodyText = `Your one-time verification code is: ${code}\nThis code expires in 10 minutes.\nIf you did not request this, ignore this email.`;
  const bodyHtml = `
    <div style="font-family: sans-serif; background:#111; color:#E5E7EB; padding:24px; border-radius:16px; max-width:560px; margin:auto;">
      <h2 style="color:#FFFFFF;">Your Verification Code</h2>
      <p>Use this code to verify your email. It expires in <strong>10 minutes</strong>.</p>
      <div style="font-size:24px; font-weight:bold; padding:12px; border-radius:12px; background:#0A0A0A; border:1px solid #1A1A1A; display:inline-block;">${code}</div>
      <p style="margin-top:20px; font-size:12px; color:#9DA3AF;">If you didn’t request this, you can ignore this email.</p>
      <p style="font-size:12px; color:#6B7280;">Sent to ${email}. Do not share this code.</p>
    </div>
  `;

  // Try sending with current transporter, fallback if needed
  async function attemptSend() {
    try {
      await transporter.sendMail({
        from: `"${SENDER_NAME}" <${SENDER_EMAIL}>`,
        to: email,
        subject,
        text: bodyText,
        html: bodyHtml,
      });
      return { success: true };
    } catch (err) {
      console.log(`SMTP attempt failed: ${err.message}`);
      
      // Try fallback to STARTTLS if SSL failed
      if (transporter.options.secure) {
        console.log('Trying STARTTLS fallback...');
        transporter = createTransporter(false);
        try {
          await transporter.sendMail({
            from: `"${SENDER_NAME}" <${SENDER_EMAIL}>`,
            to: email,
            subject,
            text: bodyText,
            html: bodyHtml,
          });
          return { success: true };
        } catch (fallbackErr) {
          console.log(`STARTTLS fallback failed: ${fallbackErr.message}`);
          throw fallbackErr;
        }
      }
      throw err;
    }
  }

  try {
    await attemptSend();
    res.json({ success: true });
  } catch (err) {
    delete otpStore[email];
    console.error('All SMTP attempts failed:', err.message);
    res.status(500).json({ 
      success: false, 
      error: `Email delivery failed: ${err.message}` 
    });
  }
});

// Verify OTP endpoint
app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ success: false, error: 'Email and OTP are required.' });

  const entry = otpStore[email];
  if (!entry) return res.status(404).json({ success: false, error: 'No OTP found. Please request a new code.' });

  if (Date.now() > entry.expiresAt) {
    delete otpStore[email];
    return res.status(410).json({ success: false, error: 'OTP expired. Please request a new code.' });
  }

  if (otp !== entry.code) return res.status(400).json({ success: false, error: 'Invalid verification code.' });

  delete otpStore[email];
  res.json({ success: true });
});

// SMTP check endpoint
app.get('/smtp-check', async (req, res) => {
  const results = [];
  
  // Test SSL connection
  try {
    const sslTransporter = createTransporter(true);
    await sslTransporter.verify();
    results.push({ method: 'SSL (port 465)', status: 'success' });
  } catch (err) {
    results.push({ method: 'SSL (port 465)', status: 'failed', error: err.message });
  }
  
  // Test STARTTLS connection
  try {
    const starttlsTransporter = createTransporter(false);
    await starttlsTransporter.verify();
    results.push({ method: 'STARTTLS (port 587)', status: 'success' });
  } catch (err) {
    results.push({ method: 'STARTTLS (port 587)', status: 'failed', error: err.message });
  }
  
  const hasSuccess = results.some(r => r.status === 'success');
  res.status(hasSuccess ? 200 : 500).json({ 
    ok: hasSuccess, 
    results,
    config: {
      host: 'smtp.zoho.com',
      user: SMTP_USER,
      sender: SENDER_EMAIL
    }
  });
});

app.listen(PORT, () => console.log(`OTP server running on port ${PORT}`));
