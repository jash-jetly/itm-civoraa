import { Megaphone, Calendar, Newspaper } from 'lucide-react';
import BottomNav from '../components/BottomNav';

interface LocalPageProps {
  onNavigate: (page: 'home' | 'local' | 'create' | 'wallet' | 'me') => void;
}

const MOCK_LOCAL_POSTS = [
  {
    id: 1,
    type: 'announcement',
    title: 'Tech Fest 2024 Registration Open',
    content: 'Register now for the annual tech fest. Prize pool worth ₹5 lakhs.',
    timestamp: '1h ago',
    important: true
  },
  {
    id: 2,
    type: 'event',
    title: 'Guest Lecture: AI in Healthcare',
    content: 'Dr. Sharma from MIT will be speaking about AI applications in healthcare. Hall 3, 4 PM.',
    timestamp: '3h ago',
    important: false
  },
  {
    id: 3,
    type: 'news',
    title: 'Campus WiFi Upgrade Scheduled',
    content: 'Network maintenance scheduled for this weekend. Expect minor disruptions.',
    timestamp: '5h ago',
    important: false
  },
  {
    id: 4,
    type: 'announcement',
    title: 'Exam Schedule Released',
    content: 'Mid-semester exam schedule has been released. Check the portal for details.',
    timestamp: '1d ago',
    important: true
  },
  {
    id: 5,
    type: 'event',
    title: 'Cultural Night This Friday',
    content: 'Join us for an evening of music, dance, and food. Open to all students.',
    timestamp: '2d ago',
    important: false
  }
];

export default function LocalPage({ onNavigate }: LocalPageProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'announcement':
        return <Megaphone className="w-5 h-5" />;
      case 'event':
        return <Calendar className="w-5 h-5" />;
      case 'news':
        return <Newspaper className="w-5 h-5" />;
      default:
        return <Newspaper className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-black pb-20">
      <div className="px-6 pt-8 pb-6 border-b border-[#1A1A1A] sticky top-0 bg-black/95 backdrop-blur-xl z-40">
        <h1 className="text-2xl font-bold mb-1">Local Updates</h1>
        <p className="text-[#9DA3AF] text-sm">Campus news and events</p>
      </div>

      <div className="px-6 py-4 space-y-4">
        {MOCK_LOCAL_POSTS.map(post => (
          <div
            key={post.id}
            className={`bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] border ${
              post.important ? 'border-[#F97171]/50' : 'border-[#1A1A1A]'
            } hover:border-[#F97171]/30 rounded-xl p-4 transition-all hover:shadow-[0_0_30px_rgba(249,113,113,0.1)] animate-fade-in`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                post.important ? 'bg-[#F97171]/20 text-[#F97171]' : 'bg-[#9DA3AF]/10 text-[#9DA3AF]'
              }`}>
                {getIcon(post.type)}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded capitalize ${
                    post.type === 'announcement' ? 'bg-[#F97171]/20 text-[#F97171]' :
                    post.type === 'event' ? 'bg-[#9DA3AF]/20 text-[#9DA3AF]' :
                    'bg-white/10 text-white'
                  }`}>
                    {post.type}
                  </span>
                  <span className="text-xs text-[#9DA3AF]">{post.timestamp}</span>
                </div>

                <h3 className="text-white font-semibold mb-2">{post.title}</h3>
                <p className="text-[#9DA3AF] text-sm leading-relaxed">{post.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BottomNav currentPage="local" onNavigate={onNavigate} />
    </div>
  );
}
