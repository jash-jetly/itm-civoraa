import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import PasswordPage from './pages/PasswordPage';
import SeedPhrasePage from './pages/SeedPhrasePage';
import HomePage from './pages/HomePage';
import LocalPage from './pages/LocalPage';
import CreatePage from './pages/CreatePage';
import WalletPage from './pages/WalletPage';
import MePage from './pages/MePage';
import OTPVerificationPage from './pages/OTPVerificationPage';
import PasswordSetupPage from './pages/PasswordSetupPage';
import SeedPhraseDisplayPage from './pages/SeedPhraseDisplayPage';
import SeedPhraseVerificationPage from './pages/SeedPhraseVerificationPage';
import CompleteRegistrationPage from './pages/CompleteRegistrationPage';

type Page = 'login' | 'password' | 'seed' | 'home' | 'local' | 'create' | 'wallet' | 'me' | 'otp-verification' | 'password-setup' | 'seed-display' | 'seed-verification' | 'complete-registration';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [email, setEmail] = useState('');

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage 
          onContinue={(email) => { setEmail(email); navigateTo('password'); }} 
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
        return <CompleteRegistrationPage onComplete={(email) => { setEmail(email); navigateTo('home'); }} />;
      case 'home':
        return <HomePage onNavigate={navigateTo} />;
      case 'local':
        return <LocalPage onNavigate={navigateTo} />;
      case 'create':
        return <CreatePage onNavigate={navigateTo} />;
      case 'wallet':
        return <WalletPage onNavigate={navigateTo} />;
      case 'me':
        return <MePage onNavigate={navigateTo} onLogout={() => navigateTo('login')} />;
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
