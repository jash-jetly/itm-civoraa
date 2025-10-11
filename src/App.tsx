import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import PasswordPage from './pages/PasswordPage';
import SeedPhrasePage from './pages/SeedPhrasePage';
import HomePage from './pages/HomePage';
import LocalPage from './pages/LocalPage';
import CreatePage from './pages/CreatePage';
import WalletPage from './pages/WalletPage';
import MePage from './pages/MePage';

type Page = 'login' | 'password' | 'seed' | 'home' | 'local' | 'create' | 'wallet' | 'me';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [email, setEmail] = useState('');

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onContinue={(email) => { setEmail(email); navigateTo('password'); }} />;
      case 'password':
        return <PasswordPage email={email} onLogin={() => navigateTo('seed')} onBack={() => navigateTo('login')} />;
      case 'seed':
        return <SeedPhrasePage onContinue={() => navigateTo('home')} />;
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
