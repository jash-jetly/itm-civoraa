import { GraduationCap } from 'lucide-react';
import BottomNav from '../components/BottomNav';

interface InClassPageProps {
  onNavigate: (page: 'home' | 'local' | 'create' | 'wallet' | 'me' | 'inclass') => void;
}

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

export default function InClassPage({ onNavigate }: InClassPageProps) {
  return (
    <div className="min-h-screen bg-black pb-20">
      <div className="px-6 pt-8 pb-6 border-b border-[#1A1A1A] sticky top-0 bg-black/95 backdrop-blur-xl z-40">
        <h1 className="text-2xl font-bold mb-1">In-Class</h1>
        <p className="text-[#9DA3AF] text-sm">Today's classes and schedules</p>
      </div>

      {/* Classes Section */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-2 mb-6">
          <GraduationCap className="w-6 h-6 text-[#F97171]" />
          <h2 className="text-xl font-semibold text-white">Today's Classes</h2>
        </div>
        
        <div className="grid gap-4">
          {CLASSES.map(classItem => (
            <div
              key={classItem.id}
              className="bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] border border-[#1A1A1A] hover:border-[#F97171]/30 rounded-xl p-6 transition-all hover:shadow-[0_0_30px_rgba(249,113,113,0.1)]"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-bold text-xl mb-2">{classItem.name}</h3>
                  <p className="text-[#F97171] text-base font-semibold mb-3">{classItem.subject}</p>
                  <div className="flex items-center gap-6 text-[#9DA3AF] text-sm">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#F97171] rounded-full"></div>
                      {classItem.time}
                    </span>
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#9DA3AF] rounded-full"></div>
                      {classItem.room}
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#F97171]/10 border border-[#F97171]/20">
                  <GraduationCap className="w-6 h-6 text-[#F97171]" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state for when no classes */}
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

      <BottomNav currentPage="local" onNavigate={onNavigate} />
    </div>
  );
}