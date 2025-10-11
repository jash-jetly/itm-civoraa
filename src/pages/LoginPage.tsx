import { useState } from 'react';
import { Shield } from 'lucide-react';
import { checkUserExists, registerUser, loginUser } from '../services/authService';
import RegistrationForm from '../components/RegistrationForm';
import PasswordForm from '../components/PasswordForm';

interface LoginPageProps {
  onContinue: (email: string) => void;
}

type AuthStep = 'email' | 'register' | 'login';

export default function LoginPage({ onContinue }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authStep, setAuthStep] = useState<AuthStep>('email');

  const handleContinue = async () => {
    if (!email.endsWith('@isu.ac.in')) {
      setError('Only ISU email addresses are allowed');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const userExists = await checkUserExists(email);
      if (userExists) {
        setAuthStep('login');
      } else {
        setAuthStep('register');
      }
    } catch (error) {
      setError('Failed to check user status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string) => {
    await registerUser(email, password);
    onContinue(email);
  };

  const handleLogin = async (email: string, password: string) => {
    await loginUser(email, password);
    onContinue(email);
  };

  const handleBack = () => {
    setAuthStep('email');
    setError('');
  };

  if (authStep === 'register') {
    return (
      <RegistrationForm
        email={email}
        onRegister={handleRegister}
        onBack={handleBack}
      />
    );
  }

  if (authStep === 'login') {
    return (
      <PasswordForm
        email={email}
        onLogin={handleLogin}
        onBack={handleBack}
      />
    );
  }

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
              placeholder="yourname@isu.ac.in"
              className="w-full px-4 py-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl text-white placeholder-[#9DA3AF]/50 focus:outline-none focus:border-[#F97171]/50 focus:ring-2 focus:ring-[#F97171]/20 transition-all"
            />
            {error && (
              <p className="text-[#F97171] text-xs mt-1">{error}</p>
            )}
          </div>

          <button
            onClick={handleContinue}
            disabled={loading}
            className="w-full py-4 bg-[#F97171] hover:bg-[#F97171]/90 disabled:bg-[#F97171]/50 text-black font-semibold rounded-xl transition-all shadow-[0_0_30px_rgba(249,113,113,0.3)] hover:shadow-[0_0_40px_rgba(249,113,113,0.5)] active:scale-[0.98] disabled:cursor-not-allowed"
          >
            {loading ? 'Checking...' : 'Continue'}
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
