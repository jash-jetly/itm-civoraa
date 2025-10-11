import { useState } from 'react';
import { Shield, Eye, EyeOff } from 'lucide-react';

interface RegistrationFormProps {
  email: string;
  onRegister: (email: string, password: string) => Promise<void>;
  onBack: () => void;
}

export default function RegistrationForm({ email, onRegister, onBack }: RegistrationFormProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) errors.push('At least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('One lowercase letter');
    if (!/[0-9]/.test(password)) errors.push('One number');
    if (!/[!@#$%^&*]/.test(password)) errors.push('One special character (!@#$%^&*)');
    return errors;
  };

  const handleRegister = async () => {
    setError('');
    
    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setError(`Password must have: ${passwordErrors.join(', ')}`);
      return;
    }

    setLoading(true);
    try {
      await onRegister(email, password);
    } catch (error: any) {
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordErrors = validatePassword(password);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-[#F97171]/5 via-transparent to-transparent opacity-30"></div>

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

          <h1 className="text-3xl font-bold tracking-tight">
            Create Account
          </h1>
          <p className="text-[#9DA3AF] text-sm">
            Welcome to CIVORAA! Set up your password for
          </p>
          <p className="text-[#F97171] text-sm font-medium">{email}</p>
        </div>

        <div className="space-y-6 mt-8">
          <div className="space-y-2">
            <label className="text-sm text-[#9DA3AF] font-medium">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-4 pr-12 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl text-white placeholder-[#9DA3AF]/50 focus:outline-none focus:border-[#F97171]/50 focus:ring-2 focus:ring-[#F97171]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#9DA3AF] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {password && passwordErrors.length > 0 && (
              <div className="text-xs text-[#9DA3AF] space-y-1">
                <p>Password requirements:</p>
                {passwordErrors.map((error, index) => (
                  <p key={index} className="text-[#F97171]">• {error}</p>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-[#9DA3AF] font-medium">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full px-4 py-4 pr-12 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl text-white placeholder-[#9DA3AF]/50 focus:outline-none focus:border-[#F97171]/50 focus:ring-2 focus:ring-[#F97171]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#9DA3AF] hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-[#F97171] text-sm">{error}</p>
          )}

          <div className="space-y-3">
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full py-4 bg-[#F97171] hover:bg-[#F97171]/90 disabled:bg-[#F97171]/50 text-black font-semibold rounded-xl transition-all shadow-[0_0_30px_rgba(249,113,113,0.3)] hover:shadow-[0_0_40px_rgba(249,113,113,0.5)] active:scale-[0.98] disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <button
              onClick={onBack}
              disabled={loading}
              className="w-full py-4 bg-transparent border border-[#1A1A1A] hover:border-[#F97171]/50 text-[#9DA3AF] hover:text-white font-medium rounded-xl transition-all disabled:cursor-not-allowed"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}