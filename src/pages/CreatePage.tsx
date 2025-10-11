import { useState } from 'react';
import { ArrowLeft, FileText, BarChart3, MessageSquare } from 'lucide-react';
import BottomNav from '../components/BottomNav';

interface CreatePageProps {
  onNavigate: (page: 'home' | 'local' | 'create' | 'wallet' | 'me') => void;
}

type CreateType = 'issue' | 'poll' | 'discussion' | null;

export default function CreatePage({ onNavigate }: CreatePageProps) {
  const [selectedType, setSelectedType] = useState<CreateType>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = () => {
    console.log({ selectedType, title, description, isAnonymous });
    setTitle('');
    setDescription('');
    setIsAnonymous(false);
    setSelectedType(null);
    onNavigate('home');
  };

  if (!selectedType) {
    return (
      <div className="min-h-screen bg-black pb-20">
        <div className="px-6 pt-8 pb-6 border-b border-[#1A1A1A] sticky top-0 bg-black/95 backdrop-blur-xl z-40">
          <button
            onClick={() => onNavigate('home')}
            className="mb-4 text-[#9DA3AF] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold mb-1">Create</h1>
          <p className="text-[#9DA3AF] text-sm">What do you want to share?</p>
        </div>

        <div className="px-6 py-8 space-y-4">
          <button
            onClick={() => setSelectedType('issue')}
            className="w-full bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] border border-[#1A1A1A] hover:border-[#F97171]/50 rounded-xl p-6 transition-all hover:shadow-[0_0_30px_rgba(249,113,113,0.2)] text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-[#F97171]/10 group-hover:bg-[#F97171]/20 transition-colors">
                <FileText className="w-6 h-6 text-[#F97171]" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Report an Issue</h3>
                <p className="text-[#9DA3AF] text-sm">Share problems that need attention</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setSelectedType('poll')}
            className="w-full bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] border border-[#1A1A1A] hover:border-[#F97171]/50 rounded-xl p-6 transition-all hover:shadow-[0_0_30px_rgba(249,113,113,0.2)] text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-[#F97171]/10 group-hover:bg-[#F97171]/20 transition-colors">
                <BarChart3 className="w-6 h-6 text-[#F97171]" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Create a Poll</h3>
                <p className="text-[#9DA3AF] text-sm">Get opinions from the community</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setSelectedType('discussion')}
            className="w-full bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] border border-[#1A1A1A] hover:border-[#F97171]/50 rounded-xl p-6 transition-all hover:shadow-[0_0_30px_rgba(249,113,113,0.2)] text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-[#F97171]/10 group-hover:bg-[#F97171]/20 transition-colors">
                <MessageSquare className="w-6 h-6 text-[#F97171]" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Start a Discussion</h3>
                <p className="text-[#9DA3AF] text-sm">Open a conversation about anything</p>
              </div>
            </div>
          </button>
        </div>

        <BottomNav currentPage="create" onNavigate={onNavigate} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-20">
      <div className="px-6 pt-8 pb-6 border-b border-[#1A1A1A] sticky top-0 bg-black/95 backdrop-blur-xl z-40">
        <button
          onClick={() => setSelectedType(null)}
          className="mb-4 text-[#9DA3AF] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold mb-1 capitalize">{selectedType}</h1>
        <p className="text-[#9DA3AF] text-sm">Share your thoughts with the community</p>
      </div>

      <div className="px-6 py-6 space-y-6">
        <div className="space-y-2">
          <label className="text-sm text-[#9DA3AF] font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give it a clear, descriptive title"
            className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl text-white placeholder-[#9DA3AF]/50 focus:outline-none focus:border-[#F97171]/50 focus:ring-2 focus:ring-[#F97171]/20 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-[#9DA3AF] font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide more details..."
            rows={6}
            className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl text-white placeholder-[#9DA3AF]/50 focus:outline-none focus:border-[#F97171]/50 focus:ring-2 focus:ring-[#F97171]/20 transition-all resize-none"
          />
        </div>

        <label className="flex items-center justify-between p-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl cursor-pointer group hover:border-[#F97171]/30 transition-all">
          <div>
            <p className="text-white font-medium mb-1">Post Anonymously</p>
            <p className="text-[#9DA3AF] text-xs">Your identity will be hidden</p>
          </div>
          <div className="relative">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-12 h-6 rounded-full transition-all ${
              isAnonymous
                ? 'bg-[#F97171] shadow-[0_0_20px_rgba(249,113,113,0.5)]'
                : 'bg-[#1A1A1A]'
            }`}>
              <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                isAnonymous ? 'translate-x-6' : 'translate-x-0.5'
              } translate-y-0.5`}></div>
            </div>
          </div>
        </label>

        <button
          onClick={handleSubmit}
          disabled={!title || !description}
          className="w-full py-4 bg-[#F97171] hover:bg-[#F97171]/90 disabled:bg-[#F97171]/30 disabled:cursor-not-allowed text-black font-semibold rounded-xl transition-all shadow-[0_0_30px_rgba(249,113,113,0.3)] hover:shadow-[0_0_40px_rgba(249,113,113,0.5)] active:scale-[0.98]"
        >
          Submit to Blockchain
        </button>
      </div>

      <BottomNav currentPage="create" onNavigate={onNavigate} />
    </div>
  );
}
