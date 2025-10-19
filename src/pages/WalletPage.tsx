import { Wallet, Gift, TrendingUp, ArrowDownLeft, ArrowUpRight, Copy, Check } from 'lucide-react';
import BottomNav from '../components/BottomNav';

interface WalletPageProps {
  onNavigate: (page: 'home' | 'local' | 'create' | 'wallet' | 'me') => void;
}

const MOCK_TRANSACTIONS = [
  { id: 1, type: 'earned', description: 'Poll participation reward', amount: 25.00, timestamp: '2024-08-25', status: 'completed' },
  { id: 2, type: 'earned', description: 'Weekly active user bonus', amount: 50.00, timestamp: '2024-08-24', status: 'completed' },
  { id: 3, type: 'spent', description: 'Premium poll creation', amount: -10.00, timestamp: '2024-08-23', status: 'completed' }
];

export default function WalletPage({ onNavigate }: WalletPageProps) {
  const balance = 1247.50;
  const balanceInRupees = 45.20;

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 text-center">
        <h1 className="text-2xl font-bold text-white mb-1">Civoraa Wallet</h1>
        <p className="text-[#9DA3AF] text-sm">Your crypto rewards & balance</p>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Main Balance Card */}
        <div className="bg-gradient-to-br from-[#8B4513] to-[#654321] rounded-2xl p-6 shadow-2xl">
          <div className="text-center mb-4">
            <p className="text-white/80 text-sm mb-2">Total Balance</p>
            <h2 className="text-4xl font-bold text-white mb-2">{balance.toFixed(2)} CVR</h2>
            <p className="text-white/60 text-sm">≈ ₹{balanceInRupees.toFixed(2)}</p>
          </div>
        </div>

        {/* Wallet Address */}
        <div className="bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] border border-[#1A1A1A] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#9DA3AF] text-sm mb-1">Wallet Address</p>
              <p className="text-white font-mono text-sm">0xA182...6789</p>
            </div>
            <button className="p-2 bg-[#1A1A1A] hover:bg-[#2A2A2A] rounded-lg transition-colors">
              <Copy className="w-4 h-4 text-[#9DA3AF]" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-green-600/20 hover:bg-green-600/30 border border-green-600/50 rounded-xl p-4 flex flex-col items-center gap-2 transition-all">
            <ArrowDownLeft className="w-6 h-6 text-green-400" />
            <span className="text-white font-medium">Receive</span>
          </button>
          <button className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/50 rounded-xl p-4 flex flex-col items-center gap-2 transition-all">
            <ArrowUpRight className="w-6 h-6 text-blue-400" />
            <span className="text-white font-medium">Send</span>
          </button>
        </div>

        {/* Rewards Section */}
        <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Gift className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-white font-medium">Rewards & Vouchers</p>
                <p className="text-[#9DA3AF] text-sm">Earn rewards by participating in polls and discussions!</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-purple-400 font-bold">3 available</p>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-4 text-white">Recent Transactions</h3>
          <div className="space-y-3">
            {MOCK_TRANSACTIONS.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    transaction.status === 'completed' 
                      ? 'bg-green-500/20' 
                      : 'bg-red-500/20'
                  }`}>
                    {transaction.status === 'completed' ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{transaction.description}</p>
                    <p className="text-[#9DA3AF] text-xs">{transaction.timestamp}</p>
                  </div>
                </div>
                <div className={`font-semibold text-sm ${
                  transaction.type === 'earned' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {transaction.type === 'earned' ? '+' : '-'}{transaction.amount} CVR
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav currentPage="wallet" onNavigate={onNavigate} />
    </div>
  );
}
