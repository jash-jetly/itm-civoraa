import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { logoutUser } from './services/authService';
import LoginPage from './pages/LoginPage';
import PasswordPage from './pages/PasswordPage';
import SeedPhrasePage from './pages/SeedPhrasePage';
import HomePage from './pages/HomePage';
import LocalPage from './pages/LocalPage';
import InClassPage from './pages/InClassPage';
import CreatePage from './pages/CreatePage';
import WalletPage from './pages/WalletPage';
import MePage from './pages/MePage';
import OTPVerificationPage from './pages/OTPVerificationPage';
import PasswordSetupPage from './pages/PasswordSetupPage';
import SeedPhraseDisplayPage from './pages/SeedPhraseDisplayPage';
import SeedPhraseVerificationPage from './pages/SeedPhraseVerificationPage';
import CompleteRegistrationPage from './pages/CompleteRegistrationPage';

type Page = 'login' | 'password' | 'seed' | 'home' | 'local' | 'inclass' | 'create' | 'wallet' | 'me' | 'otp-verification' | 'password-setup' | 'seed-display' | 'seed-verification' | 'complete-registration';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(auth.currentUser ? 'home' : 'login');
  const [email, setEmail] = useState('');

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  // Keep user logged in across refreshes by reacting to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email || '');
        setCurrentPage((prev) => {
          // If we were at auth/registration pages on load, go to Home
          const authPages: Page[] = [
            'login',
            'password',
            'otp-verification',
            'password-setup',
            'seed-display',
            'seed-verification',
            'complete-registration',
            'seed'
          ];
          return authPages.includes(prev) ? 'home' : prev;
        });
      } else {
        setCurrentPage('login');
      }
    });
    return () => unsubscribe();
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage 
          // Existing account: after successful password verification, go straight to Home
          onContinue={(email) => { setEmail(email); navigateTo('home'); }} 
          // New account: proceed with OTP → password setup → seed phrase flow
          onNavigateToOTP={(email) => { setEmail(email); navigateTo('otp-verification'); }}
        />;
      case 'password':
        return <PasswordPage email={email} onLogin={() => navigateTo('seed')} onBack={() => navigateTo('login')} />;
      case 'seed':
        return <SeedPhrasePage onContinue={() => navigateTo('home')} />;
      case 'otp-verification':
        return <OTPVerificationPage email={email} onVerified={() => navigateTo('password-setup')} onBack={() => navigateTo('login')} />;
      case 'password-setup':
        return <PasswordSetupPage onPasswordSet={() => navigateTo('seed-display')} onBack={() => navigateTo('otp-verification')} />;
      case 'seed-display':
        return <SeedPhraseDisplayPage onContinue={() => navigateTo('seed-verification')} onBack={() => navigateTo('password-setup')} />;
      case 'seed-verification':
        return <SeedPhraseVerificationPage onVerified={() => navigateTo('complete-registration')} onBack={() => navigateTo('seed-display')} />;
      case 'complete-registration':
        return <CompleteRegistrationPage 
          onComplete={(email) => { setEmail(email); navigateTo('home'); }} 
          onRetry={() => navigateTo('seed-verification')}
          onStartOver={() => navigateTo('login')}
        />;
      case 'home':
        return <HomePage onNavigate={navigateTo} />;
      case 'local':
        return <LocalPage onNavigate={navigateTo} />;
      case 'inclass':
        return <InClassPage onNavigate={navigateTo} />;
      case 'create':
        return <CreatePage onNavigate={navigateTo} />;
      case 'wallet':
        return <WalletPage onNavigate={navigateTo} />;
      case 'me':
        return <MePage email={email} onNavigate={navigateTo} onLogout={async () => { await logoutUser(); navigateTo('login'); }} />;
      default:
        return <LoginPage onContinue={(email) => { setEmail(email); navigateTo('password'); }} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {renderPage()}
    </div>
  );
}

export default App;
