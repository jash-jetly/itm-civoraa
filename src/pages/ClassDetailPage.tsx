import { useState, useEffect } from 'react';
import { ArrowLeft, MessageCircle, Share2, GraduationCap } from 'lucide-react';
import BottomNav from '../components/BottomNav';

interface ClassDetailPageProps {
  classId: number;
  className: string;
  onNavigate: (page: 'home' | 'local' | 'create' | 'wallet' | 'me' | 'inclass') => void;
  onBack: () => void;
}

export default function ClassDetailPage({ classId, className, onNavigate, onBack }: ClassDetailPageProps) {
  const [polls, setPolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClassPolls = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5173/polls?type=class&classId=${classId}`);
      if (response.ok) {
        const data = await response.json();
        setPolls(data.polls || []);
      }
    } catch (error) {
      console.error('Error fetching class polls:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (pollId: string, optionIndex: number) => {
    try {
      const response = await fetch('http://localhost:3001/vote-poll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pollId,
          optionIndex,
          userId: 'user123' // In real app, get from auth
        }),
      });

      if (response.ok) {
        // Refresh polls to show updated vote counts
        fetchClassPolls();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to vote');
      }
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to vote');
    }
  };

  useEffect(() => {
    fetchClassPolls();
  }, [classId]);

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Header */}
      <div className="px-4 pt-8 pb-6 border-b border-[#1A1A1A] sticky top-0 bg-black/95 backdrop-blur-xl z-40">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-[#1A1A1A] hover:bg-[#2A2A2A] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{className}</h1>
            <p className="text-[#9DA3AF] text-sm">Class polls and discussions</p>
          </div>
          <div className="p-3 rounded-xl bg-[#F97171]/10 border border-[#F97171]/20">
            <GraduationCap className="w-6 h-6 text-[#F97171]" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="text-[#9DA3AF]">Loading class polls...</div>
          </div>
        ) : polls.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#F97171]/10 flex items-center justify-center mx-auto">
                <MessageCircle className="w-8 h-8 text-[#F97171]" />
              </div>
              <h3 className="text-white font-semibold text-lg">No polls yet</h3>
              <p className="text-[#9DA3AF] text-sm max-w-sm">
                Be the first to create a poll for this class.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {polls.map((poll) => (
              <div key={poll.id} className="bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] border border-[#1A1A1A] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#F97171]/20 flex items-center justify-center">
                    <span className="text-[#F97171] text-xs font-bold">
                      {poll.author === 'Anonymous' ? 'A' : poll.author.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">{poll.author}</div>
                    <div className="text-[#9DA3AF] text-xs">
                      {new Date(poll.createdAt).toLocaleString()}
                    </div>
                  </div>
                  {poll.tags && poll.tags.length > 0 && (
                    <div className="flex gap-1">
                      {poll.tags.slice(0, 2).map((tag: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-[#F97171]/10 text-[#F97171] text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <h3 className="text-white font-semibold mb-4">{poll.title}</h3>
                {poll.description && (
                  <p className="text-[#9DA3AF] text-sm mb-4">{poll.description}</p>
                )}

                <div className="space-y-2 mb-4">
                  {poll.options.map((option: any, index: number) => {
                    const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
                    return (
                      <button
                        key={index}
                        onClick={() => handleVote(poll.id, index)}
                        className="w-full text-left p-3 bg-[#1A1A1A] hover:bg-[#2A2A2A] border border-[#2A2A2A] rounded-lg transition-all group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white text-sm">{option.text}</span>
                          <span className="text-[#9DA3AF] text-xs">{option.votes} votes</span>
                        </div>
                        <div className="w-full bg-[#0A0A0A] rounded-full h-2">
                          <div 
                            className="bg-[#F97171] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-[#9DA3AF] text-xs mt-1">{percentage.toFixed(1)}%</div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-4 text-[#9DA3AF] text-sm">
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>0 comments</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </div>
                  <div className="ml-auto text-xs">
                    Total votes: {poll.totalVotes}
                  </div>
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