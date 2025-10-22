import { useState, useEffect } from 'react';
import { GraduationCap, MessageCircle, BarChart3, FileText, Share2, ArrowLeft } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { getClassPolls, Poll, voteOnPoll } from '../services/pollService';
import { getUserData } from '../services/authService';

interface InClassPageProps {
  onNavigate: (page: 'home' | 'local' | 'create' | 'wallet' | 'me' | 'inclass' | 'news') => void;
  onNavigateToUserProfile: (userEmail: string) => void;
  onNavigateToPostDetail: (post: Poll) => void;
}

const CLASSES = [
  {
    id: 1,
    name: 'Sam Altman',
    year: '2025'
  },
  {
    id: 2,
    name: 'Larry Page',
    year:'2025'
  },
  {
    id: 3,
    name: 'Demis Hassabis',
    year: '2025'
  },
  {
    id: 4,
    name: 'Jeff Bezos',
    year: '2025'
  }
];

export default function InClassPage({ onNavigate, onNavigateToUserProfile, onNavigateToPostDetail }: InClassPageProps) {
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [voting, setVoting] = useState<Record<string, boolean>>({});
  const [userEmail, setUserEmail] = useState<string>('');

  const loadClassPolls = async (classId: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getClassPolls(classId);
      if (result.success && result.polls) {
        setPolls(result.polls);
      } else {
        setError(result.error || 'Failed to load class polls');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error loading class polls:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClassSelect = (classId: number) => {
    setSelectedClass(classId);
    loadClassPolls(classId);
  };

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
      const result = await voteOnPoll(pollId, optionId, 'class', userEmail);
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

  if (selectedClass) {
    const selectedClassData = CLASSES.find(c => c.id === selectedClass);
    
    return (
      <div className="min-h-screen bg-black pb-20">
        <div className="px-6 pt-8 pb-6 border-b border-[#1A1A1A] sticky top-0 bg-black/95 backdrop-blur-xl z-40">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => setSelectedClass(null)}
              className="p-2 rounded-lg bg-[#1A1A1A] hover:bg-[#2A2A2A] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">{selectedClassData?.name}</h1>
              <p className="text-[#9DA3AF] text-sm">{selectedClassData?.year}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          {loading && (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-[#F97171] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#9DA3AF]">Loading polls...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Error loading polls</h3>
              <p className="text-[#9DA3AF] text-sm mb-4">{error}</p>
              <button
                onClick={() => loadClassPolls(selectedClass)}
                className="px-4 py-2 bg-[#F97171] text-white rounded-lg hover:bg-[#F97171]/80 transition-colors"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && polls.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#F97171]/10 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-[#F97171]" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">No polls yet</h3>
              <p className="text-[#9DA3AF] text-sm">
                Be the first to create a poll for this class!
              </p>
            </div>
          )}

          {!loading && !error && polls.length > 0 && (
            <div className="space-y-6">
              {polls.map((poll) => (
                <div
                  key={poll.id}
                  className="bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] border border-[#1A1A1A] rounded-xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F97171] to-[#FF6B6B] flex items-center justify-center">
                         <span className="text-white font-bold text-sm">
                           {poll.isAnonymous ? poll.authorTag.charAt(0).toUpperCase() : (poll.authorName?.charAt(0) || 'U').toUpperCase()}
                         </span>
                       </div>
                       <div>
                         {poll.isAnonymous ? (
                           <p className="text-white font-semibold">
                             {poll.authorTag}
                           </p>
                         ) : (
                           <button 
                             onClick={() => onNavigateToUserProfile(poll.authorEmail)}
                             className="text-white font-semibold hover:text-[#F97171] transition-colors cursor-pointer text-left"
                           >
                             {poll.authorName || 'Unknown User'}
                           </button>
                         )}
                         <p className="text-[#9DA3AF] text-sm">{formatTimeAgo(poll.createdAt)}</p>
                       </div>
                     </div>
                    <BarChart3 className="w-5 h-5 text-[#F97171]" />
                  </div>

                  <h3 className="text-white font-bold text-lg mb-2">{poll.title}</h3>

                  <div className="space-y-3 mb-4">
                    {poll.options.map((option, index) => {
                      const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
                      const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                      const pollId = poll.id || '';
                      const isSelected = pollId && selected[pollId] === option.text;
                      const isVoting = pollId && voting[pollId];
                      const hasVoted = poll.votedUsers && poll.votedUsers.includes(userEmail);

                       return (
                         <button
                           key={index}
                           onClick={() => {
                             if (pollId && !isVoting && !hasVoted) {
                               handleVote(pollId, option.id || option.text);
                             }
                           }}
                          className={`w-full text-left p-4 rounded-lg border transition-all ${
                            isSelected
                              ? 'border-[#F97171] bg-[#F97171]/10'
                              : 'border-[#1A1A1A] bg-[#0A0A0A]'
                          } ${
                            hasVoted || isVoting 
                              ? 'opacity-50 cursor-not-allowed' 
                              : 'hover:border-[#F97171]/30'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white font-medium">{option.text}</span>
                            <span className="text-[#9DA3AF] text-sm">
                              {isVoting ? 'Voting...' : hasVoted ? 'Already voted' : `${option.votes} votes`}
                            </span>
                          </div>
                          <div className="w-full bg-[#1A1A1A] rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-[#F97171] to-[#FF6B6B] h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <div className="text-right mt-1">
                            <span className="text-[#9DA3AF] text-xs">{percentage.toFixed(1)}%</span>
                          </div>
                        </button>
                      );
                    })}
                   </div>

                  {poll.description && (
                    <p className="text-[#9DA3AF] text-sm mb-4">{poll.description}</p>
                  )}

                  {poll.tags && poll.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {poll.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[#F97171]/10 text-[#F97171] text-xs rounded-full border border-[#F97171]/20"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-6 pt-4 border-t border-[#1A1A1A]">
                    <button 
                      onClick={() => onNavigateToPostDetail(poll)}
                      className="flex items-center gap-2 text-[#9DA3AF] hover:text-white transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">Comment</span>
                    </button>
                    <button className="flex items-center gap-2 text-[#9DA3AF] hover:text-white transition-colors">
                      <Share2 className="w-4 h-4" />
                      <span className="text-sm">Share</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <BottomNav currentPage="home" onNavigate={onNavigate} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-20">
      <div className="px-6 pt-8 pb-6 border-b border-[#1A1A1A] sticky top-0 bg-black/95 backdrop-blur-xl z-40">
        <h1 className="text-2xl font-bold mb-1">In-Cohorts</h1>
        <p className="text-[#9DA3AF] text-sm">Cohorts specific</p>
      </div>

      <div className="px-6 py-6">
        <div className="flex items-center gap-2 mb-6">
          <GraduationCap className="w-6 h-6 text-[#F97171]" />
          <h2 className="text-xl font-semibold text-white">Cohorts</h2>
        </div>
        
        <div className="grid gap-4">
          {CLASSES.map(classItem => (
            <button
              key={classItem.id}
              onClick={() => handleClassSelect(classItem.id)}
              className="w-full bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] border border-[#1A1A1A] hover:border-[#F97171]/30 rounded-xl p-6 transition-all hover:shadow-[0_0_30px_rgba(249,113,113,0.1)]"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 text-left">
                  <h3 className="text-white font-bold text-xl mb-2">{classItem.name}</h3>
                  <p className="text-[#F97171] text-base font-semibold mb-3">{classItem.year}</p>
                </div>
                <div className="p-3 rounded-xl bg-[#F97171]/10 border border-[#F97171]/20">
                  <GraduationCap className="w-6 h-6 text-[#F97171]" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {CLASSES.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-[#F97171]/10 flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-[#F97171]" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No classes today</h3>
            <p className="text-[#9DA3AF] text-sm">
              Enjoy your free day or check back tomorrow for your schedule.
            </p>
          </div>
        )}
      </div>

      <BottomNav currentPage="home" onNavigate={onNavigate} />
    </div>
  );
}