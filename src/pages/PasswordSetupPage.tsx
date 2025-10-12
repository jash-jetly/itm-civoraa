import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { setPasswordAfterOTP } from '../services/authService';
import { getSecureSessionItem, validatePassword as validatePasswordSecurity } from '../utils/security';

interface PasswordSetupPageProps {
  onPasswordSet?: () => void;
  onBack?: () => void;
}

const PasswordSetupPage: React.FC<PasswordSetupPageProps> = ({ onPasswordSet, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Require OTP verification before password setup
    const otpVerified = getSecureSessionItem('otpVerified');
    const registrationEmail = getSecureSessionItem('authEmail');
    if (!otpVerified || !registrationEmail || otpVerified !== registrationEmail) {
      if (onBack) onBack();
      return;
    }
    setEmail(registrationEmail);
  }, [onBack]);

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return 'Password must contain at least one special character (@$!%*?&)';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Use security validation
    const passwordValidation = validatePasswordSecurity(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.error || 'Password does not meet requirements');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const email = getSecureSessionItem('authEmail') || '';
      const result = await setPasswordAfterOTP(email, password);
      
      if (result.success) {
        if (onPasswordSet) onPasswordSet();
      } else {
        setError(result.message || 'Failed to set password');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-[#F97171]/5 via-transparent to-transparent opacity-30"></div>

      <div className="relative z-10 w-full max-w-md space-y-8 animate-fade-in">
        {/* Header with logos */}
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

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Set Your Password</h1>
          <p className="text-[#9DA3AF] text-sm">Create a strong password for your account</p>
          <p className="text-[#9DA3AF]/80 text-xs mt-1">{email}</p>
        </div>

        {error && (
          <p className="text-[#F97171] text-xs mt-2 bg-[#F97171]/10 border border-[#F97171]/30 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div className="space-y-2">
            <label className="text-sm text-[#9DA3AF] font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl text-white placeholder-[#9DA3AF]/50 focus:outline-none focus:border-[#F97171]/50 focus:ring-2 focus:ring-[#F97171]/20 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9DA3AF] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-[#9DA3AF] font-medium">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full px-4 py-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl text-white placeholder-[#9DA3AF]/50 focus:outline-none focus:border-[#F97171]/50 focus:ring-2 focus:ring-[#F97171]/20 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9DA3AF] hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-4">
            <h4 className="text-sm font-medium text-white mb-2">Password Requirements</h4>
            <ul className="text-xs text-[#9DA3AF] space-y-1">
              <li className={password.length >= 8 ? 'text-green-500' : ''}>• At least 8 characters long</li>
              <li className={/(?=.*[a-z])/.test(password) ? 'text-green-500' : ''}>• One lowercase letter</li>
              <li className={/(?=.*[A-Z])/.test(password) ? 'text-green-500' : ''}>• One uppercase letter</li>
              <li className={/(?=.*\d)/.test(password) ? 'text-green-500' : ''}>• One number</li>
              <li className={/(?=.*[@$!%*?&])/.test(password) ? 'text-green-500' : ''}>• One special character (@$!%*?&)</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={isLoading || !password || !confirmPassword}
            className="w-full py-4 bg-[#F97171] hover:bg-[#F97171]/90 disabled:bg-[#F97171]/50 text-black font-semibold rounded-xl transition-all shadow-[0_0_30px_rgba(249,113,113,0.3)] hover:shadow-[0_0_40px_rgba(249,113,113,0.5)] active:scale-[0.98] disabled:cursor-not-allowed"
          >
            {isLoading ? 'Setting Password...' : 'Continue'}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-[#9DA3AF]/60 text-xs">Next, you'll be shown a seed phrase to secure your account</p>
        </div>
      </div>
    </div>
  );
};

export default PasswordSetupPage;