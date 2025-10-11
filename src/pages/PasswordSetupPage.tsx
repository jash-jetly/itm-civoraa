import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    // Check if OTP was verified using secure session storage
    const otpVerified = getSecureSessionItem('otpVerified');
    const registrationEmail = getSecureSessionItem('authEmail');
    
    if (!otpVerified || !registrationEmail) {
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
      const email = getSecureSessionItem('otpVerified') || '';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Header with logos */}
        <div className="flex items-center justify-center mb-8">
          <img 
            src="https://i.ibb.co/vCkSQZzF/Gemini-Generated-Image-z435qzz435qzz435.png" 
            alt="CIVORAA" 
            className="w-20 h-20 rounded-lg object-cover"
          />
          <span className="text-3xl font-bold text-gray-400 mx-4">×</span>
          <img 
            src="https://formfees.com/wp-content/uploads/2021/12/ITM-Business-School-Logo.png" 
            alt="ITM" 
            className="w-20 h-20 rounded-lg object-cover"
          />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Set Your Password
          </h1>
          <p className="text-gray-600">
            Create a strong password for your account
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {email}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Confirm your password"
              required
            />
          </div>

          {/* Password Requirements */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className={password.length >= 8 ? 'text-green-600' : ''}>
                • At least 8 characters long
              </li>
              <li className={/(?=.*[a-z])/.test(password) ? 'text-green-600' : ''}>
                • One lowercase letter
              </li>
              <li className={/(?=.*[A-Z])/.test(password) ? 'text-green-600' : ''}>
                • One uppercase letter
              </li>
              <li className={/(?=.*\d)/.test(password) ? 'text-green-600' : ''}>
                • One number
              </li>
              <li className={/(?=.*[@$!%*?&])/.test(password) ? 'text-green-600' : ''}>
                • One special character (@$!%*?&)
              </li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={isLoading || !password || !confirmPassword}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Setting Password...' : 'Continue'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Next, you'll be shown a seed phrase to secure your account
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordSetupPage;