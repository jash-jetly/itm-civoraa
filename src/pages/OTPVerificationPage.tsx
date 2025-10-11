import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, RefreshCw } from 'lucide-react';
import { verifyOTPAndProceed, resendOTP } from '../services/authService';
import { validateOTP, sanitizeInput } from '../utils/security';

interface OTPVerificationPageProps {
  email: string;
  onVerified: () => void;
  onBack: () => void;
}

export default function OTPVerificationPage({ email, onVerified, onBack }: OTPVerificationPageProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    // Validate OTP format
    const sanitizedOTP = sanitizeInput(otpCode);
    const otpValidation = validateOTP(sanitizedOTP);
    
    if (!otpValidation.isValid) {
      setError(otpValidation.error || 'Invalid OTP format');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result = await verifyOTPAndProceed(email, sanitizedOTP);
      if (result.success) {
        onVerified();
      } else {
        setError(result.message || 'Invalid verification code');
      }
    } catch (error) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');

    try {
      const result = await resendOTP(email);
      if (result.success) {
        setResendCooldown(60); // 60 second cooldown
        setOtp(['', '', '', '', '', '']); // Clear current OTP
      } else {
        setError(result.message || 'Failed to resend code');
      }
    } catch (error) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-[#F97171]/5 via-transparent to-transparent opacity-30"></div>

      <button
        onClick={onBack}
        className="absolute top-6 left-6 p-2 text-[#9DA3AF] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="relative z-10 w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center gap-4 mb-6">
            <img 
              src="https://i.ibb.co/vCkSQZzF/Gemini-Generated-Image-z435qzz435qzz435.png" 
              alt="CIVORAA Logo" 
              className="w-20 h-20 rounded-2xl object-cover"
            />
            <div className="text-3xl font-bold text-[#9DA3AF]">×</div>
            <img 
              src="https://formfees.com/wp-content/uploads/2021/12/ITM-Business-School-Logo.png" 
              alt="ITM Logo" 
              className="w-20 h-20 rounded-2xl object-cover bg-white p-2"
            />
          </div>

          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl bg-[#F97171]/10 border border-[#F97171]/20">
              <Mail className="w-12 h-12 text-[#F97171]" strokeWidth={1.5} />
            </div>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Verify Your Email
          </h1>
          <p className="text-[#9DA3AF] text-sm">
            We've sent a 6-digit code to<br />
            <span className="text-white font-medium">{email}</span>
          </p>
        </div>

        <div className="space-y-6 mt-12">
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-bold bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl text-white focus:outline-none focus:border-[#F97171]/50 focus:ring-2 focus:ring-[#F97171]/20 transition-all"
              />
            ))}
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-400/10 border border-red-400/20 rounded-lg p-3">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || otp.join('').length !== 6}
            className="w-full py-4 bg-[#F97171] text-white rounded-xl font-semibold hover:bg-[#F97171]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>

          <div className="text-center">
            <p className="text-[#9DA3AF] text-sm mb-2">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResend}
              disabled={resendLoading || resendCooldown > 0}
              className="text-[#F97171] text-sm font-medium hover:text-[#F97171]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
            >
              <RefreshCw className={`w-4 h-4 ${resendLoading ? 'animate-spin' : ''}`} />
              {resendCooldown > 0 
                ? `Resend in ${resendCooldown}s` 
                : resendLoading 
                  ? 'Sending...' 
                  : 'Resend Code'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}