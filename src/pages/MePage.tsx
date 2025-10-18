import { User, FileText, BarChart3, MessageSquare, Key, LogOut } from 'lucide-react';
import BottomNav from '../components/BottomNav';

interface MePageProps {
  email: string;
  onNavigate: (page: 'home' | 'local' | 'create' | 'wallet' | 'me') => void;
  onLogout: () => void;
}

const MOCK_USER_POSTS = [
  { id: 1, type: 'issue', title: 'Library AC not working', upvotes: 247, status: 'active' },
  { id: 2, type: 'poll', title: 'Extended library hours?', upvotes: 189, status: 'active' },
  { id: 3, type: 'discussion', title: 'Best study spots on campus', upvotes: 92, status: 'active' }
];

export default function MePage({ email, onNavigate, onLogout }: MePageProps) {
  const handleRegenerateSeed = () => {
    alert('Seed phrase regeneration would be implemented here');
  };

  // Function to parse username from email format like "2025.jashj@isu.ac.in"
  const parseUsername = (email: string): string => {
    if (!email) return '@anonymous';
    
    try {
      // Split email by @ to get the local part
      const localPart = email.split('@')[0];
      
      // Split by . to separate year and username
      const parts = localPart.split('.');
      
      if (parts.length >= 2) {
        // Get the username part (everything after the first dot)
        const usernamePart = parts.slice(1).join('.');
        
        // Insert space before capital letters and format properly
        const formattedUsername = usernamePart
          .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before capital letters
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
        
        return `@${formattedUsername}`;
      }
      
      // Fallback: use the whole local part
      return `@${localPart}`;
    } catch (error) {
      return '@anonymous';
    }
  };

  return (
    <div className="min-h-screen bg-black pb-20">
      <div className="px-6 pt-8 pb-6 border-b border-[#1A1A1A]">
        <h1 className="text-2xl font-bold mb-1">Profile</h1>
        <p className="text-[#9DA3AF] text-sm">Manage your account and activity</p>
      </div>

      <div className="px-6 py-6">
        <div className="bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] border border-[#1A1A1A] rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-[#F97171]/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-[#F97171]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{parseUsername(email)}</h2>
              <p className="text-[#9DA3AF] text-sm">{email || 'student@itm.ac.in'}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#1A1A1A]">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">12</div>
              <div className="text-xs text-[#9DA3AF]">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#F97171] mb-1">528</div>
              <div className="text-xs text-[#9DA3AF]">Upvotes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">8</div>
              <div className="text-xs text-[#9DA3AF]">Resolved</div>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Your Posts</h3>

          {MOCK_USER_POSTS.map(post => (
            <div
              key={post.id}
              className="bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] border border-[#1A1A1A] hover:border-[#F97171]/30 rounded-xl p-4 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#9DA3AF]/10 text-[#9DA3AF]">
                  {post.type === 'issue' && <FileText className="w-5 h-5" />}
                  {post.type === 'poll' && <BarChart3 className="w-5 h-5" />}
                  {post.type === 'discussion' && <MessageSquare className="w-5 h-5" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 bg-white/10 text-white rounded capitalize">
                      {post.type}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-[#F97171]/20 text-[#F97171] rounded capitalize">
                      {post.status}
                    </span>
                  </div>

                  <h4 className="text-white font-medium mb-1">{post.title}</h4>
                  <p className="text-[#9DA3AF] text-sm">{post.upvotes} upvotes</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <button
            onClick={handleRegenerateSeed}
            className="w-full py-4 bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] border border-[#1A1A1A] hover:border-[#F97171]/50 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Key className="w-5 h-5" />
            Regenerate Seed Phrase
          </button>

          <button
            onClick={onLogout}
            className="w-full py-4 bg-[#F97171]/10 hover:bg-[#F97171]/20 border border-[#F97171]/30 text-[#F97171] font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      <BottomNav currentPage="me" onNavigate={onNavigate} />
    </div>
  );
}
