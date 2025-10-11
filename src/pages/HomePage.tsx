import { useState } from 'react';
import { ArrowBigUp, Plus } from 'lucide-react';
import BottomNav from '../components/BottomNav';

interface HomePageProps {
  onNavigate: (page: 'home' | 'local' | 'create' | 'wallet' | 'me') => void;
}

const MOCK_ISSUES = [
  {
    id: 1,
    type: 'issue',
    title: 'Library AC not working',
    description: 'The AC in the main library has been broken for 3 days now. Students are unable to study.',
    upvotes: 247,
    timestamp: '2h ago',
    isAnonymous: true
  },
  {
    id: 2,
    type: 'poll',
    title: 'Should we have extended library hours during exams?',
    description: 'Vote on whether the library should stay open until midnight during exam season.',
    upvotes: 189,
    timestamp: '5h ago',
    isAnonymous: false
  },
  {
    id: 3,
    type: 'issue',
    title: 'Mess food quality declining',
    description: 'The quality of food in the mess has significantly decreased. Need immediate attention.',
    upvotes: 312,
    timestamp: '1d ago',
    isAnonymous: true
  },
  {
    id: 4,
    type: 'issue',
    title: 'WiFi constantly disconnecting',
    description: 'Campus WiFi keeps disconnecting every 10-15 minutes. Affecting online classes.',
    upvotes: 156,
    timestamp: '6h ago',
    isAnonymous: false
  }
];

export default function HomePage({ onNavigate }: HomePageProps) {
  const [activeTab, setActiveTab] = useState<'issues' | 'polls'>('issues');
  const [upvoted, setUpvoted] = useState<number[]>([]);

  const handleUpvote = (id: number) => {
    if (upvoted.includes(id)) {
      setUpvoted(upvoted.filter(i => i !== id));
    } else {
      setUpvoted([...upvoted, id]);
    }
  };

  const filteredItems = MOCK_ISSUES.filter(item =>
    activeTab === 'issues' ? item.type === 'issue' : item.type === 'poll'
  );

  return (
    <div className="min-h-screen bg-black pb-20">
      <div className="px-6 pt-8 pb-6 border-b border-[#1A1A1A] sticky top-0 bg-black/95 backdrop-blur-xl z-40">
        <h1 className="text-2xl font-bold mb-1">The Voice of ITM</h1>
        <p className="text-[#9DA3AF] text-sm">Speak up. Stay anonymous.</p>
      </div>

      <div className="flex gap-4 px-6 py-4 border-b border-[#1A1A1A] sticky top-[104px] bg-black/95 backdrop-blur-xl z-30">
        <button
          onClick={() => setActiveTab('issues')}
          className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'issues'
              ? 'bg-[#F97171] text-black shadow-[0_0_20px_rgba(249,113,113,0.3)]'
              : 'bg-[#0A0A0A] text-[#9DA3AF] hover:text-white'
          }`}
        >
          Issues
        </button>
        <button
          onClick={() => setActiveTab('polls')}
          className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'polls'
              ? 'bg-[#F97171] text-black shadow-[0_0_20px_rgba(249,113,113,0.3)]'
              : 'bg-[#0A0A0A] text-[#9DA3AF] hover:text-white'
          }`}
        >
          Polls
        </button>
      </div>

      <div className="px-6 py-4 space-y-4">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] border border-[#1A1A1A] hover:border-[#F97171]/30 rounded-xl p-4 transition-all hover:shadow-[0_0_30px_rgba(249,113,113,0.1)] animate-fade-in"
          >
            <div className="flex gap-4">
              <button
                onClick={() => handleUpvote(item.id)}
                className={`flex flex-col items-center gap-1 ${
                  upvoted.includes(item.id) ? 'text-[#F97171]' : 'text-[#9DA3AF]'
                } hover:text-[#F97171] transition-colors`}
              >
                <ArrowBigUp className={`w-6 h-6 ${upvoted.includes(item.id) ? 'fill-current' : ''}`} />
                <span className="text-sm font-semibold">
                  {item.upvotes + (upvoted.includes(item.id) ? 1 : 0)}
                </span>
              </button>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {item.isAnonymous && (
                    <span className="text-xs px-2 py-0.5 bg-[#F97171]/20 text-[#F97171] rounded">
                      Anonymous
                    </span>
                  )}
                  <span className="text-xs text-[#9DA3AF]">{item.timestamp}</span>
                </div>

                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-[#9DA3AF] text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => onNavigate('create')}
        className="fixed bottom-24 right-6 w-14 h-14 bg-[#F97171] hover:bg-[#F97171]/90 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(249,113,113,0.5)] hover:shadow-[0_0_50px_rgba(249,113,113,0.7)] transition-all active:scale-95 z-50"
      >
        <Plus className="w-7 h-7 text-black" strokeWidth={2.5} />
      </button>

      <BottomNav currentPage="home" onNavigate={onNavigate} />
    </div>
  );
}
