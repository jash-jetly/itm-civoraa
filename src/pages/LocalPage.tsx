import { useState } from 'react';
import { Megaphone, Calendar, Newspaper, MessageCircle, ThumbsUp, ThumbsDown, X } from 'lucide-react';
import BottomNav from '../components/BottomNav';

interface LocalPageProps {
  onNavigate: (page: 'home' | 'local' | 'create' | 'wallet' | 'me') => void;
}

const MOCK_LOCAL_POSTS = [
  {
    id: 1,
    type: 'announcement',
    title: "India's Digital Payment Revolution: UPI Transactions Cross 10 Billion Monthly",
    content: 'The Unified Payments Interface (UPI) has revolutionized digital payments in India, with monthly transactions now exceeding 10 billion....',
    timestamp: '8/25/2024',
    source: 'Economic Times',
    image: '/api/placeholder/400/300',
    important: true
  },
  {
    id: 2,
    type: 'event',
    title: 'Tech Giants Invest $50B in AI Infrastructure',
    content: 'Major technology companies announce massive investments in artificial intelligence infrastructure to support growing demand.',
    timestamp: '8/24/2024',
    source: 'Tech News',
    image: '/api/placeholder/400/300',
    important: false
  },
  {
    id: 3,
    type: 'news',
    title: 'Climate Summit 2024: Global Leaders Commit to Carbon Neutrality',
    content: 'World leaders gather to discuss climate action and commit to ambitious carbon neutrality goals by 2050.',
    timestamp: '8/23/2024',
    source: 'Global News',
    image: '/api/placeholder/400/300',
    important: false
  },
  {
    id: 4,
    type: 'announcement',
    title: 'Space Mission Success: Mars Rover Discovers Water Evidence',
    content: 'Latest Mars rover mission provides compelling evidence of ancient water activity on the red planet.',
    timestamp: '8/22/2024',
    source: 'Space Today',
    image: '/api/placeholder/400/300',
    important: true
  },
  {
    id: 5,
    type: 'event',
    title: 'Breakthrough in Quantum Computing Achieved',
    content: 'Scientists achieve major breakthrough in quantum computing, bringing us closer to practical quantum computers.',
    timestamp: '8/21/2024',
    source: 'Science Daily',
    image: '/api/placeholder/400/300',
    important: false
  }
];

export default function LocalPage({ onNavigate }: LocalPageProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    if (direction === 'up') {
      setSelectedNews(MOCK_LOCAL_POSTS[currentCardIndex]);
      setShowChat(true);
    } else {
      // Move to next card
      if (currentCardIndex < MOCK_LOCAL_POSTS.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
      }
    }
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages([...chatMessages, {
        id: Date.now(),
        text: newMessage,
        user: 'You',
        timestamp: new Date().toLocaleTimeString()
      }]);
      setNewMessage('');
    }
  };

  const currentCard = MOCK_LOCAL_POSTS[currentCardIndex];

  if (!currentCard) {
    return (
      <div className="min-h-screen bg-black pb-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">No more news!</h2>
          <p className="text-[#9DA3AF]">Check back later for updates</p>
        </div>
        <BottomNav currentPage="local" onNavigate={onNavigate} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-20 relative overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 text-center">
        <h1 className="text-2xl font-bold text-white mb-1">India News Feed</h1>
        <p className="text-[#9DA3AF] text-sm">Swipe right to agree, left to disagree, up for comments</p>
      </div>

      {/* News Card */}
      <div className="px-6 flex-1 flex items-center justify-center">
        <div className="w-full max-w-sm mx-auto">
          <div className="bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] border border-[#1A1A1A] rounded-2xl overflow-hidden shadow-2xl">
            {/* News Image */}
            <div className="h-64 bg-gradient-to-br from-[#F97171]/20 to-[#9DA3AF]/20 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop" 
                alt="News" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* News Content */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-2 py-1 bg-[#F97171]/20 text-[#F97171] rounded">
                  {currentCard.source}
                </span>
                <span className="text-xs text-[#9DA3AF]">{currentCard.timestamp}</span>
              </div>

              <h3 className="text-white font-bold text-lg mb-3 leading-tight">
                {currentCard.title}
              </h3>
              
              <p className="text-[#9DA3AF] text-sm leading-relaxed mb-4">
                {currentCard.content}
              </p>

              <button className="text-[#F97171] text-sm font-medium">
                Read More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-6">
        <div className="flex justify-center gap-6">
          <button
            onClick={() => handleSwipe('left')}
            className="w-16 h-16 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-full flex items-center justify-center transition-all"
          >
            <ThumbsDown className="w-6 h-6 text-red-400" />
          </button>
          
          <button
            onClick={() => handleSwipe('up')}
            className="w-16 h-16 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-full flex items-center justify-center transition-all"
          >
            <MessageCircle className="w-6 h-6 text-blue-400" />
          </button>
          
          <button
            onClick={() => handleSwipe('right')}
            className="w-16 h-16 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-full flex items-center justify-center transition-all"
          >
            <ThumbsUp className="w-6 h-6 text-green-400" />
          </button>
        </div>
      </div>

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-end">
          <div className="w-full bg-[#0A0A0A] border-t border-[#1A1A1A] rounded-t-2xl max-h-[80vh] flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-[#1A1A1A] flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold">Discussion</h3>
                <p className="text-[#9DA3AF] text-sm">{selectedNews?.title}</p>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="w-8 h-8 bg-[#1A1A1A] hover:bg-[#2A2A2A] rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-[#9DA3AF]" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              {chatMessages.length === 0 ? (
                <div className="text-center text-[#9DA3AF] py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Start the conversation!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {chatMessages.map((message) => (
                    <div key={message.id} className="bg-[#1A1A1A] rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[#F97171] text-sm font-medium">{message.user}</span>
                        <span className="text-[#9DA3AF] text-xs">{message.timestamp}</span>
                      </div>
                      <p className="text-white text-sm">{message.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-[#1A1A1A]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="flex-1 px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-white placeholder-[#9DA3AF]/50 focus:outline-none focus:border-[#F97171]/50"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  className="px-6 py-3 bg-[#F97171] hover:bg-[#F97171]/90 text-black font-medium rounded-xl transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav currentPage="local" onNavigate={onNavigate} />
    </div>
  );
}
