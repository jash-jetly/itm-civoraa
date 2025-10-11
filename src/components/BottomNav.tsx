import { Home, Newspaper, Plus, Wallet, User } from 'lucide-react';

interface BottomNavProps {
  currentPage: 'home' | 'local' | 'create' | 'wallet' | 'me';
  onNavigate: (page: 'home' | 'local' | 'create' | 'wallet' | 'me') => void;
}

export default function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'home' as const, icon: Home, label: 'Home' },
    { id: 'local' as const, icon: Newspaper, label: 'Local' },
    { id: 'create' as const, icon: Plus, label: 'Create' },
    { id: 'wallet' as const, icon: Wallet, label: 'Wallet' },
    { id: 'me' as const, icon: User, label: 'Me' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-[#1A1A1A] z-50">
      <div className="flex items-center justify-around px-6 py-3">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-all ${
              currentPage === id
                ? 'text-[#F97171]'
                : 'text-[#9DA3AF] hover:text-white'
            }`}
          >
            <Icon className={`w-6 h-6 ${currentPage === id ? 'fill-current' : ''}`} strokeWidth={1.5} />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
