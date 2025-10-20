import { User, FileText, BarChart3, MessageSquare, ArrowLeft, Grid3X3 } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { useState, useEffect } from 'react';
import { getUserPolls, Poll } from '../services/pollService';
import { getUserDiscussions, getUserNews, Discussion, News } from '../services/postService';
import { getUserData, UserData } from '../services/authService';

interface UserProfilePageProps {
  userEmail: string;
  onNavigate: (page: 'home' | 'local' | 'inclass' | 'create' | 'wallet' | 'me') => void;
  onBack: () => void;
}

// Mock data for user profile
// Function to parse username from email format like "2025.jashj@isu.ac.in"
const parseUsername = (email: string): string => {
  if (!email) return 'Anonymous';
  
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
      
      return formattedUsername;
    }
    
    // Fallback: use the whole local part
    return localPart;
  } catch (error) {
    return 'Anonymous';
  }
};

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

export default function UserProfilePage({ userEmail, onNavigate, onBack }: UserProfilePageProps) {
  const [activeTab, setActiveTab] = useState<'posts' | 'discussions' | 'news'>('posts');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userPolls, setUserPolls] = useState<Poll[]>([]);
  const [userDiscussions, setUserDiscussions] = useState<Discussion[]>([]);
  const [userNews, setUserNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user profile data
        const userDataResult = await getUserData(userEmail);
        setUserData(userDataResult);

        // Fetch user's polls
        const pollsResult = await getUserPolls(userEmail);
        if (pollsResult.success && pollsResult.polls) {
          setUserPolls(pollsResult.polls);
        }

        // Fetch user's discussions
        const discussions = await getUserDiscussions(userEmail);
        setUserDiscussions(discussions);

        // Fetch user's news
        const news = await getUserNews(userEmail);
        setUserNews(news);

      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchUserData();
    }
  }, [userEmail]);

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
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={onBack}
            className="px-4 py-2 bg-[#F97171] text-white rounded-lg hover:bg-[#FF6B6B] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const username = userData?.name || parseUsername(userEmail);
  const { posts, discussions, news, totalUpvotes } = getTabCounts();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">{username}</h1>
        <div className="w-10"></div>
      </div>

      {/* Profile Section */}
      <div className="p-6">
        {/* User Info */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-[#F97171] to-[#FF6B6B] rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{username}</h2>
            <p className="text-gray-400">{userEmail}</p>
            {userData?.walletAddress && (
              <p className="text-sm text-gray-500 mt-1">
                {userData.walletAddress.slice(0, 6)}...{userData.walletAddress.slice(-4)}
              </p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{posts}</div>
            <div className="text-sm text-gray-400">Posts & Dis</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{news}</div>
            <div className="text-sm text-gray-400">News</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{totalUpvotes}</div>
            <div className="text-sm text-gray-400">Votes</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <center><div className="flex border-b border-gray-800 mb-6">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-3 px-4 text-center transition-colors ${
              activeTab === 'posts'
                ? 'border-b-2 border-[#F97171] text-[#F97171]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Grid3X3 className="w-5 h-5 mx-auto mb-1" />
            <span className="text-sm">Posts & Dis</span>
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`flex-1 py-3 px-4 text-center transition-colors ${
              activeTab === 'news'
                ? 'border-b-2 border-[#F97171] text-[#F97171]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FileText className="w-5 h-5 mx-auto mb-1" />
            <span className="text-sm">News</span>
          </button>
        </div></center>

        {/* Content Grid */}
        <div className="space-y-4 pb-20">
          {getCurrentTabData().length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                {activeTab === 'posts' && <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />}
                {activeTab === 'discussions' && <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />}
                {activeTab === 'news' && <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />}
              </div>
              <p className="text-gray-400">
                No {activeTab} yet
              </p>
            </div>
          ) : (
            getCurrentTabData().map((item) => (
              <div key={item.id} className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-white line-clamp-2 flex-1">{item.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ml-2 ${
                    item.status === 'active' ? 'bg-green-900 text-green-300' :
                    item.status === 'resolved' ? 'bg-blue-900 text-blue-300' :
                    'bg-yellow-900 text-yellow-300'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span className="capitalize">{item.type}</span>
                  <div className="flex items-center space-x-4">
                    {item.upvotes > 0 && (
                      <span className="flex items-center space-x-1">
                        <BarChart3 className="w-4 h-4" />
                        <span>{item.upvotes}</span>
                      </span>
                    )}
                    <span>{item.createdAt}</span>
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