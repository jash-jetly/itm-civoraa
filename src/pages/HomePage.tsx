import { useState, useEffect } from 'react';
import { Trophy, Mail, MessageCircle, Share2, Plus, BarChart3, FileText } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { getGlobalPolls, Poll, voteOnPoll } from '../services/pollService';
import { getUserData } from '../services/authService';

interface HomePageProps {
  onNavigate: (page: 'home' | 'local' | 'inclass' | 'create' | 'wallet' | 'me') => void;
  onNavigateToUserProfile: (userEmail: string) => void;
  onNavigateToPostDetail: (post: Poll) => void;
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

export default function HomePage({ onNavigate, onNavigateToUserProfile, onNavigateToPostDetail }: HomePageProps) {
  const [scope, setScope] = useState<'global' | 'inclass'>('global');
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voting, setVoting] = useState<Record<string, boolean>>({});
  const [userEmail, setUserEmail] = useState<string>('');

  const handleScope = (value: 'global' | 'inclass') => {
    setScope(value);
    if (value === 'inclass') onNavigate('inclass');
  };

  const loadGlobalPolls = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getGlobalPolls();
      if (result.success && result.polls) {
        setPolls(result.polls);
      } else {
        setError(result.error || 'Failed to load polls');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error loading polls:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scope === 'global') {
      loadGlobalPolls();
    }
  }, [scope]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        if (email) {
          setUserEmail(email);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchUserData();
  }, []);

  const formatTimeAgo = (timestamp: any): string => {
    if (!timestamp) return 'Just now';
    
    const now = new Date();
    const postTime = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - postTime.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const handleVote = async (pollId: string, optionId: string) => {
    if (!pollId || voting[pollId] || !userEmail) return;
    
    setVoting(prev => ({ ...prev, [pollId]: true }));
    
    try {
      const result = await voteOnPoll(pollId, optionId, 'global', userEmail);
      if (result.success) {
        // Update local state to reflect the vote
        setPolls(prevPolls => 
          prevPolls.map(poll => {
            if (poll.id === pollId) {
              const updatedOptions = poll.options.map(option => {
                if (option.id === optionId) {
                  return { ...option, votes: option.votes + 1 };
                }
                return option;
              });
              const newTotalVotes = updatedOptions.reduce((total, option) => total + option.votes, 0);
              const updatedVotedUsers = [...(poll.votedUsers || []), userEmail];
              return { 
                ...poll, 
                options: updatedOptions, 
                totalVotes: newTotalVotes,
                votedUsers: updatedVotedUsers
              };
            }
            return poll;
          })
        );
        
        // Update selected state
        setSelected(prev => ({ ...prev, [pollId]: optionId }));
      } else {
        console.error('Failed to vote:', result.error);
      }
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setVoting(prev => ({ ...prev, [pollId]: false }));
    }
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

      {/* Feed Content */}
      <div className="px-4 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-8 h-8 border-2 border-[#F97171] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[#9DA3AF] text-sm">Loading posts...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Error loading posts</h3>
            <p className="text-[#9DA3AF] text-sm mb-4">{error}</p>
            <button 
              onClick={loadGlobalPolls}
              className="px-4 py-2 bg-[#F97171] text-black rounded-lg font-medium"
            >
              Try Again
            </button>
          </div>
        ) : polls.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 rounded-full bg-[#F97171]/10 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-[#F97171]" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No posts yet</h3>
            <p className="text-[#9DA3AF] text-sm max-w-sm text-center">
              Be the first to create a post and start the conversation in your community.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {polls.map((poll) => (
              <div
                key={poll.id}
                className="bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] border border-[#1A1A1A] hover:border-[#F97171]/30 rounded-xl p-6 transition-all"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-[#F97171]/10">
                    {poll.type === 'poll' && <BarChart3 className="w-5 h-5 text-[#F97171]" />}
                    {poll.type === 'discussion' && <MessageCircle className="w-5 h-5 text-[#F97171]" />}
                    {poll.type === 'news' && <FileText className="w-5 h-5 text-[#F97171]" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {poll.isAnonymous ? (
                        <span className="text-[#F97171] font-medium">
                          {poll.authorTag}
                        </span>
                      ) : (
                        <button 
                          onClick={() => onNavigateToUserProfile(poll.authorEmail)}
                          className="text-[#F97171] font-medium hover:text-[#FF6B6B] transition-colors cursor-pointer"
                        >
                          {poll.authorName || 'Unknown User'}
                        </button>
                      )}
                      <span className="text-[#9DA3AF] text-sm">{poll.addressShort}</span>
                      <span className="text-[#9DA3AF] text-sm">•</span>
                      <span className="text-[#9DA3AF] text-sm">{formatTimeAgo(poll.createdAt)}</span>
                    </div>
                    <h3 className="text-white font-semibold mb-3">{poll.title}</h3>
                    
                    {poll.type === 'poll' && poll.options && (
                      <div className="space-y-2 mb-4">
                        {poll.options.map((option) => {
                          const pollId = poll.id;
                          const isSelected = pollId && selected[pollId] === option.id;
                          const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
                          const isVoting = pollId && voting[pollId];
                          const hasVoted = poll.votedUsers && poll.votedUsers.includes(userEmail);
                          
                          return (
                            <div
                              key={option.id}
                              className={`relative p-3 rounded-lg border transition-all ${
                                isSelected 
                                  ? 'border-[#F97171] bg-[#F97171]/10' 
                                  : 'border-[#1A1A1A] bg-[#0A0A0A]'
                              } ${
                                hasVoted || isVoting 
                                  ? 'opacity-50 cursor-not-allowed' 
                                  : 'cursor-pointer hover:border-[#F97171]/30'
                              }`}
                              onClick={() => {
                                if (pollId && !isVoting && !hasVoted) {
                                  handleVote(pollId, option.id);
                                }
                              }}
                            >
                              <div className="flex justify-between items-center relative z-10">
                                <span className="text-white text-sm">{option.text}</span>
                                <span className="text-[#9DA3AF] text-sm">
                                  {isVoting ? 'Voting...' : hasVoted ? 'Already voted' : `${option.votes} votes`}
                                </span>
                              </div>
                              {percentage > 0 && (
                                <div 
                                  className="absolute inset-0 bg-[#F97171]/20 rounded-lg transition-all duration-300"
                                  style={{ width: `${percentage}%` }}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {poll.type !== 'poll' && poll.description && (
                      <p className="text-[#9DA3AF] mb-4">{poll.description}</p>
                    )}

                    {poll.tags && poll.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {poll.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-[#F97171]/10 text-[#F97171] text-xs rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-[#9DA3AF] text-sm">
                      <button 
                        onClick={() => onNavigateToPostDetail(poll)}
                        className="flex items-center gap-1 hover:text-[#F97171] transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{poll.comments}</span>
                      </button>
                      <div className="flex items-center gap-1">
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating create button */}

      <BottomNav currentPage="home" onNavigate={onNavigate} />
    </div>
  );
}
