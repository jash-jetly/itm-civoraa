import { useState } from 'react';
import { Shield } from 'lucide-react';

interface LoginPageProps {
  onContinue: (email: string) => void;
}

export default function LoginPage({ onContinue }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!email.endsWith('@itm.ac.in') && !email.endsWith('@isu.ac.in')) {
      setError('Only ITM or ISU email addresses are allowed');
      return;
    }
    setError('');
    onContinue(email);
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

          <h1 className="text-5xl font-bold tracking-tight">
            CIVORAA
          </h1>
          <p className="text-[#9DA3AF] text-sm tracking-wide">
            Your voice. On chain.
          </p>
        </div>

        <div className="space-y-6 mt-12">
          <div className="space-y-2">
            <label className="text-sm text-[#9DA3AF] font-medium">
              Login with College Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourname@itm.ac.in or @isu.ac.in"
              className="w-full px-4 py-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl text-white placeholder-[#9DA3AF]/50 focus:outline-none focus:border-[#F97171]/50 focus:ring-2 focus:ring-[#F97171]/20 transition-all"
            />
            {error && (
              <p className="text-[#F97171] text-xs mt-1">{error}</p>
            )}
          </div>

          <button
            onClick={handleContinue}
            className="w-full py-4 bg-[#F97171] hover:bg-[#F97171]/90 text-black font-semibold rounded-xl transition-all shadow-[0_0_30px_rgba(249,113,113,0.3)] hover:shadow-[0_0_40px_rgba(249,113,113,0.5)] active:scale-[0.98]"
          >
            Continue
          </button>
        </div>

        <div className="text-center mt-8">
          <p className="text-[#9DA3AF]/60 text-xs">
            Student rebellion meets blockchain privacy
          </p>
        </div>
      </div>
    </div>
  );
}
