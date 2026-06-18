import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

const SERVER_ICONS = [
  { id: 'main', label: 'Chatrix', gradient: 'from-orange-500 to-purple-600', letter: 'C' },
  { id: 's1', label: 'Gaming', emoji: '🎮' },
  { id: 's2', label: 'Dev', emoji: '💻' },
  { id: 's3', label: 'Music', emoji: '🎵' },
  { id: 's4', label: 'Art', emoji: '🎨' },
];

interface ServerSidebarProps {
  activeServerId: string;
  onSelect: (id: string) => void;
}

export function ServerSidebar({ activeServerId, onSelect }: ServerSidebarProps) {
  return (
    <aside className="w-[68px] bg-[#0f1117] flex flex-col items-center py-4 gap-3 border-r border-[#1e2535]">
      {SERVER_ICONS.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          title={s.label}
          className={cn(
            'w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all duration-200',
            'hover:rounded-[14px]',
            activeServerId === s.id
              ? 'rounded-[14px] shadow-lg'
              : 'bg-[#1e2535] hover:bg-[#252d3d]',
            s.gradient && `bg-gradient-to-br ${s.gradient}`
          )}
        >
          {s.letter ? (
            <span className="text-white font-bold text-lg">{s.letter}</span>
          ) : (
            <span>{s.emoji}</span>
          )}
        </button>
      ))}

      {/* Separator */}
      <div className="w-8 h-px bg-[#252d3d] my-1" />

      {/* Add server */}
      <button className="w-12 h-12 rounded-2xl bg-[#1e2535] hover:bg-green-600 hover:rounded-[14px] flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200">
        <Plus size={22} />
      </button>
    </aside>
  );
}
