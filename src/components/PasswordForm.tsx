import { useState } from 'react';
import { Shield, Eye, EyeOff } from 'lucide-react';

interface PasswordFormProps {
  email: string;
  onLogin: (email: string, password: string) => Promise<void>;
  onBack: () => void;
}

export default function PasswordForm({ email, onLogin, onBack }: PasswordFormProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (error: any) {
      setError(error.message || 'Login failed. Please check your password.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-[#F97171]/5 via-transparent to-transparent opacity-30"></div>

      <div className="relative z-10 w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl bg-[#F97171]/10 border border-[#F97171]/20">
              <Shield className="w-12 h-12 text-[#F97171]" strokeWidth={1.5} />
            </div>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Welcome Back
          </h1>
          <p className="text-[#9DA3AF] text-sm">
            Enter your password for
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
                onKeyPress={handleKeyPress}
                placeholder="Enter your password"
                className="w-full px-4 py-4 pr-12 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl text-white placeholder-[#9DA3AF]/50 focus:outline-none focus:border-[#F97171]/50 focus:ring-2 focus:ring-[#F97171]/20 transition-all"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#9DA3AF] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-[#F97171] text-sm">{error}</p>
          )}

          <div className="space-y-3">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-4 bg-[#F97171] hover:bg-[#F97171]/90 disabled:bg-[#F97171]/50 text-black font-semibold rounded-xl transition-all shadow-[0_0_30px_rgba(249,113,113,0.3)] hover:shadow-[0_0_40px_rgba(249,113,113,0.5)] active:scale-[0.98] disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
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