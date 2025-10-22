import BottomNav from '../components/BottomNav';

interface WalletPageProps {
  onNavigate: (page: 'home' | 'local' | 'create' | 'wallet' | 'me' | 'news') => void;
}

export default function WalletPage({ onNavigate }: WalletPageProps) {
  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 text-center">
        <h1 className="text-2xl font-bold text-white mb-1">Wallet</h1>
        <p className="text-[#9DA3AF] text-sm">Coming soon...</p>
      </div>

      <div className="px-6 py-6 flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-24 h-24 bg-[#1A1A1A] rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-12 h-12 border-2 border-[#F97171] rounded-full"></div>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Wallet Feature</h2>
          <p className="text-[#9DA3AF] text-sm max-w-xs">
            The wallet functionality is currently under development. Stay tuned for updates!
          </p>
        </div>
      </div>

      <BottomNav currentPage="wallet" onNavigate={onNavigate} />
    </div>
  );
}
