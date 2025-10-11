import { Wallet, TrendingUp, Gift, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import BottomNav from '../components/BottomNav';

interface WalletPageProps {
  onNavigate: (page: 'home' | 'local' | 'create' | 'wallet' | 'me') => void;
}

const MOCK_TRANSACTIONS = [
  { id: 1, type: 'earned', description: 'Issue upvoted 50 times', amount: 25, timestamp: '2h ago' },
  { id: 2, type: 'earned', description: 'Poll created', amount: 10, timestamp: '1d ago' },
  { id: 3, type: 'redeemed', description: 'Canteen voucher', amount: -50, timestamp: '2d ago' },
  { id: 4, type: 'earned', description: 'Discussion engagement', amount: 15, timestamp: '3d ago' },
  { id: 5, type: 'earned', description: 'Issue resolved', amount: 50, timestamp: '5d ago' }
];

export default function WalletPage({ onNavigate }: WalletPageProps) {
  const balance = 150;
  const totalEarned = 350;

  return (
    <div className="min-h-screen bg-black pb-20">
      <div className="px-6 pt-8 pb-6 border-b border-[#1A1A1A] sticky top-0 bg-black/95 backdrop-blur-xl z-40">
        <h1 className="text-2xl font-bold mb-1">Wallet</h1>
        <p className="text-[#9DA3AF] text-sm">Your rewards and transactions</p>
      </div>

      <div className="px-6 py-6">
        <div className="bg-gradient-to-br from-[#F97171] to-[#F97171]/80 rounded-2xl p-6 shadow-[0_0_50px_rgba(249,113,113,0.3)] mb-6">
          <div className="flex items-center gap-2 text-black/70 text-sm mb-2">
            <Wallet className="w-4 h-4" />
            <span>Available Balance</span>
          </div>
          <div className="text-4xl font-bold text-black mb-4">{balance} Points</div>
          <button className="w-full py-3 bg-black hover:bg-black/90 text-white font-semibold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2">
            <Gift className="w-5 h-5" />
            Redeem Rewards
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] border border-[#1A1A1A] rounded-xl p-4">
            <div className="flex items-center gap-2 text-[#9DA3AF] text-xs mb-2">
              <TrendingUp className="w-4 h-4" />
              <span>Total Earned</span>
            </div>
            <div className="text-2xl font-bold text-white">{totalEarned}</div>
          </div>

          <div className="bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] border border-[#1A1A1A] rounded-xl p-4">
            <div className="flex items-center gap-2 text-[#9DA3AF] text-xs mb-2">
              <Gift className="w-4 h-4" />
              <span>Redeemed</span>
            </div>
            <div className="text-2xl font-bold text-white">{totalEarned - balance}</div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Transactions</h2>

          {MOCK_TRANSACTIONS.map(transaction => (
            <div
              key={transaction.id}
              className="bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] border border-[#1A1A1A] rounded-xl p-4 flex items-center gap-4"
            >
              <div className={`p-2 rounded-lg ${
                transaction.type === 'earned'
                  ? 'bg-[#F97171]/20 text-[#F97171]'
                  : 'bg-[#9DA3AF]/20 text-[#9DA3AF]'
              }`}>
                {transaction.type === 'earned' ? (
                  <ArrowDownLeft className="w-5 h-5" />
                ) : (
                  <ArrowUpRight className="w-5 h-5" />
                )}
              </div>

              <div className="flex-1">
                <p className="text-white font-medium text-sm mb-1">
                  {transaction.description}
                </p>
                <p className="text-[#9DA3AF] text-xs">{transaction.timestamp}</p>
              </div>

              <div className={`text-lg font-bold ${
                transaction.type === 'earned' ? 'text-[#F97171]' : 'text-[#9DA3AF]'
              }`}>
                {transaction.amount > 0 ? '+' : ''}{transaction.amount}
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav currentPage="wallet" onNavigate={onNavigate} />
    </div>
  );
}
