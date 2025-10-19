import { useState } from 'react';
import { ArrowLeft, FileText, BarChart3, MessageSquare, Plus, Globe, GraduationCap } from 'lucide-react';
import BottomNav from '../components/BottomNav';

interface CreatePageProps {
  onNavigate: (page: 'home' | 'local' | 'create' | 'wallet' | 'me') => void;
}

type CreateType = 'issue' | 'poll' | 'discussion' | null;

const CLASSES = [
  {
    id: 1,
    name: 'Sam Altman',
    subject: 'Entrepreneurship & AI',
    time: '10:00 AM - 11:30 AM',
    room: 'Hall A-101'
  },
  {
    id: 2,
    name: 'Larry Page',
    subject: 'Innovation & Technology',
    time: '2:00 PM - 3:30 PM',
    room: 'Hall B-205'
  },
  {
    id: 3,
    name: 'Demis Hassabis',
    subject: 'AI & Machine Learning',
    time: '11:45 AM - 1:15 PM',
    room: 'Lab C-301'
  },
  {
    id: 4,
    name: 'Jeff Bezos',
    subject: 'Business Strategy',
    time: '4:00 PM - 5:30 PM',
    room: 'Hall D-102'
  }
];

export default function CreatePage({ onNavigate }: CreatePageProps) {
  const [selectedType, setSelectedType] = useState<CreateType>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const [visibility, setVisibility] = useState<'global' | 'class'>('global');
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [tags, setTags] = useState('');

  const addPollOption = () => {
    setPollOptions([...pollOptions, '']);
  };

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = () => {
    console.log({ 
      selectedType, 
      title, 
      description, 
      isAnonymous, 
      pollOptions: selectedType === 'poll' ? pollOptions : undefined,
      visibility,
      selectedClass: visibility === 'class' ? selectedClass : undefined,
      tags
    });
    setTitle('');
    setDescription('');
    setIsAnonymous(false);
    setPollOptions(['', '']);
    setVisibility('global');
    setSelectedClass(null);
    setTags('');
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

          <button
            onClick={() => setSelectedType('issue')}
            className="w-full bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] border border-[#1A1A1A] hover:border-[#F97171]/50 rounded-xl p-6 transition-all hover:shadow-[0_0_30px_rgba(249,113,113,0.2)] text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-[#F97171]/10 group-hover:bg-[#F97171]/20 transition-colors">
                <FileText className="w-6 h-6 text-[#F97171]" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Have some news ??</h3>
                <p className="text-[#9DA3AF] text-sm">Share it here!!!!!!!</p>
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
          <label className="text-sm text-[#9DA3AF] font-medium">
            {selectedType === 'poll' ? 'Poll Question' : 'Title'}
          </label>
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={selectedType === 'poll' ? "What's your opinion on the latest government policy?" : "Give it a clear, descriptive title"}
            rows={3}
            className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl text-white placeholder-[#9DA3AF]/50 focus:outline-none focus:border-[#F97171]/50 focus:ring-2 focus:ring-[#F97171]/20 transition-all resize-none"
          />
        </div>

        {selectedType === 'poll' && (
          <div className="space-y-4">
            <label className="text-sm text-[#9DA3AF] font-medium">Options</label>
            {pollOptions.map((option, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updatePollOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 px-4 py-3 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl text-white placeholder-[#9DA3AF]/50 focus:outline-none focus:border-[#F97171]/50 focus:ring-2 focus:ring-[#F97171]/20 transition-all"
                />
                {pollOptions.length > 2 && (
                  <button
                    onClick={() => removePollOption(index)}
                    className="px-3 py-3 text-[#9DA3AF] hover:text-red-400 transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addPollOption}
              className="w-full py-3 border-2 border-dashed border-[#1A1A1A] hover:border-[#F97171]/50 rounded-xl text-[#9DA3AF] hover:text-[#F97171] transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Option
            </button>
          </div>
        )}

        {selectedType === 'poll' && (
          <div className="space-y-4">
            <label className="text-sm text-[#9DA3AF] font-medium">Visibility</label>
            <div className="flex gap-2">
              <button
                onClick={() => setVisibility('global')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all ${
                  visibility === 'global'
                    ? 'bg-[#F97171] text-black border-[#F97171]'
                    : 'bg-[#0A0A0A] text-[#9DA3AF] border-[#1A1A1A] hover:border-[#F97171]/50'
                }`}
              >
                <Globe className="w-4 h-4" />
                Global
              </button>
              <button
                onClick={() => setVisibility('class')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all ${
                  visibility === 'class'
                    ? 'bg-[#F97171] text-black border-[#F97171]'
                    : 'bg-[#0A0A0A] text-[#9DA3AF] border-[#1A1A1A] hover:border-[#F97171]/50'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                Class
              </button>
            </div>
          </div>
        )}

        {selectedType === 'poll' && visibility === 'class' && (
          <div className="space-y-2">
            <label className="text-sm text-[#9DA3AF] font-medium">Select Class</label>
            <div className="space-y-2">
              {CLASSES.map((classItem) => (
                <button
                  key={classItem.id}
                  onClick={() => setSelectedClass(classItem.id)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    selectedClass === classItem.id
                      ? 'bg-[#F97171]/10 border-[#F97171] text-white'
                      : 'bg-[#0A0A0A] border-[#1A1A1A] text-[#9DA3AF] hover:border-[#F97171]/50'
                  }`}
                >
                  <div className="font-medium">{classItem.name}</div>
                  <div className="text-sm opacity-70">{classItem.subject}</div>
                  <div className="text-xs opacity-50">{classItem.time} • {classItem.room}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedType === 'poll' && (
          <div className="space-y-2">
            <label className="text-sm text-[#9DA3AF] font-medium">Tags (optional)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="politics, economy, social"
              className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl text-white placeholder-[#9DA3AF]/50 focus:outline-none focus:border-[#F97171]/50 focus:ring-2 focus:ring-[#F97171]/20 transition-all"
            />
          </div>
        )}

        {selectedType !== 'poll' && (
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
        )}

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
          Post
        </button>
      </div>

      <BottomNav currentPage="create" onNavigate={onNavigate} />
    </div>
  );
}
