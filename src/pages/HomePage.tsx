import { useState } from 'react';
import { Trophy, Mail, MessageCircle, Share2, Plus } from 'lucide-react';
import BottomNav from '../components/BottomNav';

interface HomePageProps {
  onNavigate: (page: 'home' | 'local' | 'inclass' | 'create' | 'wallet' | 'me') => void;
}

type PollOption = { id: string; text: string };
type PollItem = {
  id: number;
  authorTag: string; // e.g., A1
  addressShort: string; // e.g., 0xA1B2...5678
  time: string; // e.g., 2 hours ago
  question: string;
  options: PollOption[];
  comments: number;
};

const MOCK_POLLS: PollItem[] = [
  {
    id: 1,
    authorTag: 'A1',
    addressShort: '0xA1B2...5678',
    time: '2 hours ago',
    question: 'Should India implement a four-day work week in the IT sector?',
    options: [
      { id: 'opt1', text: 'Yes, it will improve work-life balance' },
      { id: 'opt2', text: 'No, it might reduce productivity' },
      { id: 'opt3', text: 'Only for certain roles' },
      { id: 'opt4', text: 'Need more research' }
    ],
    comments: 23
  },
  {
    id: 2,
    authorTag: '9F',
    addressShort: '0x9F8E...6352',
    time: '4 hours ago',
    question: "What should be India's priority in renewable energy?",
    options: [
      { id: 'opt1', text: 'Solar power expansion' },
      { id: 'opt2', text: 'Wind infrastructure growth' },
      { id: 'opt3', text: 'Hydroelectric modernization' },
      { id: 'opt4', text: 'Battery storage R&D' }
    ],
    comments: 14
  }
];

export default function HomePage({ onNavigate }: HomePageProps) {
  const [scope, setScope] = useState<'global' | 'inclass'>('global');
  const [selected, setSelected] = useState<Record<number, string>>({});

  const handleScope = (value: 'global' | 'inclass') => {
    setScope(value);
    if (value === 'inclass') onNavigate('inclass');
  };

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Top App Bar */}
      <div className="px-4 pt-5 pb-4 border-b border-[#1A1A1A] sticky top-0 bg-black/95 backdrop-blur-xl z-40">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tight">CIVORAA</div>
          <div className="flex items-center gap-4 text-[#9DA3AF]">
            <Trophy className="w-5 h-5" />
            <Mail className="w-5 h-5" />
          </div>
        </div>
        {/* Segmented Control */}
        <div className="mt-4 flex justify-center">
          <div className="inline-flex items-center bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl overflow-hidden">
            <button
              className={`px-4 py-2 text-sm font-semibold transition-all ${
                scope === 'global'
                  ? 'bg-[#F97171] text-black shadow-[0_0_20px_rgba(249,113,113,0.3)]'
                  : 'text-[#9DA3AF]'
              }`}
              onClick={() => handleScope('global')}
            >
              Global
            </button>
            <button
              className={`px-4 py-2 text-sm font-semibold transition-all ${
                scope === 'inclass'
                  ? 'bg-[#F97171] text-black shadow-[0_0_20px_rgba(249,113,113,0.3)]'
                  : 'text-[#9DA3AF]'
              }`}
              onClick={() => handleScope('inclass')}
            >
              In-Cohorts
            </button>
          </div>
        </div>
      </div>

      {/* Feed - Empty State */}
      <div className="px-4 py-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#F97171]/10 flex items-center justify-center mx-auto">
            <MessageCircle className="w-8 h-8 text-[#F97171]" />
          </div>
          <h3 className="text-white font-semibold text-lg">No polls yet</h3>
          <p className="text-[#9DA3AF] text-sm max-w-sm">
            Be the first to create a poll and start the conversation in your community.
          </p>
        </div>
      </div>

      {/* Floating create button */}

      <BottomNav currentPage="home" onNavigate={onNavigate} />
    </div>
  );
}
