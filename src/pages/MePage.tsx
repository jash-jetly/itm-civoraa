import { User, FileText, BarChart3, MessageSquare, Key, LogOut, Wallet, Copy, Grid3X3, Settings } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { useState, useEffect } from 'react';
import { getUserData, UserData } from '../services/authService';
import { formatWalletAddress } from '../utils/walletUtils';
import { getUserPolls, Poll } from '../services/pollService';
import { getUserDiscussions, getUserNews, Discussion, News } from '../services/postService';

interface MePageProps {
  email: string;
  onNavigate: (page: 'home' | 'local' | 'create' | 'wallet' | 'me' | 'news') => void;
  onLogout: () => void;
}

// Helper function to format timestamp
const formatTimestamp = (timestamp: any): string => {
  if (!timestamp) return 'Unknown';
  
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  } catch (error) {
    return 'Unknown';
  }
};

export default function MePage({ email, onNavigate, onLogout }: MePageProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userPolls, setUserPolls] = useState<Poll[]>([]);
  const [userDiscussions, setUserDiscussions] = useState<Discussion[]>([]);
  const [userNews, setUserNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'discussions' | 'news'>('posts');

  useEffect(() => {
    const fetchUserData = async () => {
      if (email) {
        try {
          setLoading(true);
          setError(null);

          // Fetch user profile data
          const userDataResult = await getUserData(email);
          setUserData(userDataResult);
          if (userDataResult?.walletAddress) {
            setWalletAddress(userDataResult.walletAddress);
          }

          // Fetch user's polls
          const pollsResult = await getUserPolls(email);
          if (pollsResult.success && pollsResult.polls) {
            setUserPolls(pollsResult.polls);
          }

          // Fetch user's discussions
          const discussions = await getUserDiscussions(email);
          setUserDiscussions(discussions);

          // Fetch user's news
          const news = await getUserNews(email);
          setUserNews(news);

        } catch (err) {
          console.error('Error fetching user data:', err);
          setError('Failed to load profile data');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [email]);

  const handleCopyAddress = async () => {
    if (walletAddress) {
      try {
        await navigator.clipboard.writeText(walletAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy address:', error);
      }
    }
  };

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

  const getCurrentTabData = () => {
    switch (activeTab) {
      case 'posts':
        return userPolls.map(poll => ({
          id: poll.id || '',
          type: poll.type,
          title: poll.title,
          status: 'active',
          upvotes: poll.totalVotes,
          createdAt: formatTimestamp(poll.createdAt)
        }));
      case 'discussions':
        return userDiscussions.map(discussion => ({
          id: discussion.id || '',
          type: 'discussion',
          title: discussion.topic,
          status: 'active',
          upvotes: 0, // Discussions don't have upvotes in current schema
          createdAt: formatTimestamp(discussion.createdAt)
        }));
      case 'news':
        return userNews.map(news => ({
          id: news.id || '',
          type: 'news',
          title: news.title,
          status: 'active',
          upvotes: 0, // News don't have upvotes in current schema
          createdAt: formatTimestamp(news.createdAt)
        }));
      default:
        return [];
    }
  };

  const getTabCounts = () => {
    const posts = userPolls.length;
    const discussions = userDiscussions.length;
    const news = userNews.length;
    const totalUpvotes = userPolls.reduce((sum, poll) => sum + poll.totalVotes, 0);

    return { posts, discussions, news, totalUpvotes };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F97171] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
        <BottomNav currentPage="me" onNavigate={onNavigate} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#F97171] text-white rounded-lg hover:bg-[#FF6B6B] transition-colors"
          >
            Retry
          </button>
        </div>
        <BottomNav currentPage="me" onNavigate={onNavigate} />
      </div>
    );
  }

  const tabCounts = getTabCounts();

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 border-b border-[#1A1A1A] flex items-center justify-between">
        <h1 className="text-xl font-bold">{parseUsername(email)}</h1>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors">
            <Grid3X3 className="w-5 h-5 text-[#9DA3AF]" />
          </button>
          <button 
            onClick={onLogout}
            className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5 text-[#9DA3AF]" />
          </button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-6 py-6">
        <div className="flex items-start gap-6 mb-6">
          {/* Profile Picture */}
          <div className="w-20 h-20 bg-gradient-to-br from-[#F97171] to-[#FF6B6B] rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>

          {/* Stats */}
          <div className="flex-1">
            <div className="flex justify-around mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-white">{tabCounts.posts + tabCounts.discussions + tabCounts.news}</div>
                <div className="text-sm text-[#9DA3AF]">posts</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">{tabCounts.totalUpvotes}</div>
                <div className="text-sm text-[#9DA3AF]">upvotes</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">8</div>
                <div className="text-sm text-[#9DA3AF]">resolved</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-6">
          <h2 className="text-white font-semibold mb-1">{parseUsername(email).replace('@', '')}</h2>
          <p className="text-[#9DA3AF] text-sm mb-2">{email || 'student@itm.ac.in'}</p>
          <p className="text-white text-sm">🎓 Student at ITM University</p>
          <p className="text-[#9DA3AF] text-sm">📍 Gwalior, India</p>
        </div>

        {/* Wallet Address */}
        {walletAddress && (
          <div className="bg-[#1A1A1A] rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-mono text-sm">{formatWalletAddress(walletAddress)}</p>
                <p className="text-[#9DA3AF] text-xs">Wallet Address</p>
              </div>
              <button
                onClick={handleCopyAddress}
                className="p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors"
              >
                <Copy className={`w-4 h-4 ${copied ? 'text-green-400' : 'text-[#9DA3AF]'}`} />
              </button>
            </div>
          </div>
        )}

        {/* Wallet Actions */}
      

        {/* Tabs */}
        <div className="border-b border-[#1A1A1A] mb-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 py-3 text-center text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'posts'
                  ? 'border-[#F97171] text-white'
                  : 'border-transparent text-[#9DA3AF] hover:text-white'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span>POSTS & DIS</span>
                <span className="text-xs bg-[#1A1A1A] px-2 py-0.5 rounded-full">{tabCounts.posts}</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`flex-1 py-3 text-center text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'news'
                  ? 'border-[#F97171] text-white'
                  : 'border-transparent text-[#9DA3AF] hover:text-white'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                <span>NEWS</span>
                <span className="text-xs bg-[#1A1A1A] px-2 py-0.5 rounded-full">{tabCounts.news}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-4">
          {getCurrentTabData().length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#F97171]/10 flex items-center justify-center mx-auto mb-4">
                {activeTab === 'posts' && <BarChart3 className="w-8 h-8 text-[#F97171]" />}
                {activeTab === 'discussions' && <MessageSquare className="w-8 h-8 text-[#F97171]" />}
                {activeTab === 'news' && <FileText className="w-8 h-8 text-[#F97171]" />}
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">No {activeTab} yet</h3>
              <p className="text-[#9DA3AF] text-sm">
                Start sharing your thoughts with the community!
              </p>
            </div>
          ) : (
            getCurrentTabData().map(item => (
              <div
                key={item.id}
                className="bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] border border-[#1A1A1A] hover:border-[#F97171]/30 rounded-xl p-4 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#F97171]/10">
                    {item.type === 'news' && <FileText className="w-5 h-5 text-[#F97171]" />}
                    {item.type === 'poll' && <BarChart3 className="w-5 h-5 text-[#F97171]" />}
                    {item.type === 'discussion' && <MessageSquare className="w-5 h-5 text-[#F97171]" />}
                    {item.type === 'news' && <FileText className="w-5 h-5 text-[#F97171]" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-0.5 bg-[#F97171]/20 text-[#F97171] rounded capitalize">
                        {item.type}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-white/10 text-white rounded capitalize">
                        {item.status}
                      </span>
                      <span className="text-xs text-[#9DA3AF] ml-auto">{item.createdAt}</span>
                    </div>

                    <h4 className="text-white font-medium mb-2">{item.title}</h4>
                    <div className="flex items-center justify-between">
                      <p className="text-[#9DA3AF] text-sm">{item.upvotes} upvotes</p>
                      <div className="flex items-center gap-2">
                        <button className="text-[#9DA3AF] hover:text-white transition-colors">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <BottomNav currentPage="me" onNavigate={onNavigate} />
    </div>
  );
}
