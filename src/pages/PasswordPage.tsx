import { useState } from 'react';
import { Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';

interface PasswordPageProps {
  email: string;
  onLogin: () => void;
  onBack: () => void;
}

export default function PasswordPage({ email, onLogin, onBack }: PasswordPageProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (password) {
      onLogin();
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
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl bg-[#F97171]/10 border border-[#F97171]/20">
              <Lock className="w-12 h-12 text-[#F97171]" strokeWidth={1.5} />
            </div>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Enter Password
          </h1>
          <p className="text-[#9DA3AF] text-sm">
            {email}
          </p>
        </div>

        <div className="space-y-6 mt-12">
          <div className="space-y-2">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Enter your password"
                className="w-full px-4 py-4 pr-12 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl text-white placeholder-[#9DA3AF]/50 focus:outline-none focus:border-[#F97171]/50 focus:ring-2 focus:ring-[#F97171]/20 transition-all"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9DA3AF] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={!password}
            className="w-full py-4 bg-[#F97171] hover:bg-[#F97171]/90 disabled:bg-[#F97171]/30 disabled:cursor-not-allowed text-black font-semibold rounded-xl transition-all shadow-[0_0_30px_rgba(249,113,113,0.3)] hover:shadow-[0_0_40px_rgba(249,113,113,0.5)] active:scale-[0.98]"
          >
            Login
          </button>
        </div>

        <div className="text-center mt-8">
          <p className="text-[#9DA3AF]/60 text-xs">
            Secured by blockchain
          </p>
        </div>
      </div>
    </div>
  );
}
