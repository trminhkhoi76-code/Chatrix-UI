import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

const SERVER_ICONS = [
  { id: 'main', label: 'Chatrix', gradient: 'from-[#ff6b35] to-[#e84393]', letter: 'C' },
  { id: 's1', label: 'Gaming', gradient: 'from-[#f472b6] to-[#a855f7]', emoji: '🎮' },
  { id: 's2', label: 'Dev', gradient: 'from-[#3b82f6] to-[#06b6d4]', emoji: '💻' },
  { id: 's3', label: 'Music', gradient: 'from-[#22c55e] to-[#10b981]', emoji: '🎵' },
  { id: 's4', label: 'Art', gradient: 'from-[#f59e0b] to-[#ef4444]', emoji: '🎨' },
];

interface ServerSidebarProps {
  activeServerId: string;
  onSelect: (id: string) => void;
}

export function ServerSidebar({ activeServerId, onSelect }: ServerSidebarProps) {
  return (
    <aside className="w-[68px] bg-[#13151d] flex flex-col items-center py-4 gap-3 border-r border-[#1e2333]/60 flex-shrink-0">
      {SERVER_ICONS.map((s, i) => (
        <div key={s.id} className="relative group" style={{ animationDelay: `${i * 50}ms` }}>
          {/* Active indicator */}
          {activeServerId === s.id && (
            <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full transition-all duration-200" />
          )}
          <button
            onClick={() => onSelect(s.id)}
            title={s.label}
            className={cn(
              'w-12 h-12 flex items-center justify-center text-xl transition-all duration-200 relative overflow-hidden',
              activeServerId === s.id
                ? 'rounded-[14px]'
                : 'rounded-2xl hover:rounded-[14px]',
              `bg-gradient-to-br ${s.gradient}`,
              activeServerId !== s.id && 'opacity-80 hover:opacity-100',
            )}
          >
            {s.letter ? (
              <span className="text-white font-bold text-lg leading-none">{s.letter}</span>
            ) : (
              <span className="leading-none">{s.emoji}</span>
            )}
          </button>
          {/* Tooltip */}
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-[#0d0f15] text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-xl">
            {s.label}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#0d0f15]" />
          </div>
        </div>
      ))}

      {/* Separator */}
      <div className="w-8 h-px bg-[#252b3a] my-1" />

      {/* Add server */}
      <button className="w-12 h-12 rounded-2xl hover:rounded-[14px] flex items-center justify-center text-[#5a6480] hover:text-[#22c55e] border-2 border-dashed border-[#2e3649] hover:border-[#22c55e] hover:bg-[#22c55e]/10 transition-all duration-200">
        <Plus size={20} />
      </button>
    </aside>
  );
}
