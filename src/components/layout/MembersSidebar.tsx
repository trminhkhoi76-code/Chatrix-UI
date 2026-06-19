import { Avatar } from '@/components/ui/Avatar';
import { useChatStore } from '@/store/chatStore';
import { cn } from '@/lib/utils';

export function MembersSidebar() {
  const activeChat = useChatStore((s) => s.activeChat);

  const onlineMembers = [
    { id: '1', name: 'Aiko', username: 'aiko', activity: 'Playing Valorant', online: true },
    { id: '2', name: 'Ren', username: 'ren', activity: 'Designing in Figma', online: true },
    { id: '3', name: 'Mika', username: 'mika', activity: 'Listening to Lo-fi', online: true },
    { id: '4', name: 'mkt-76', username: 'mkt76', activity: 'Online', online: true },
  ];
  const offlineMembers = [
    { id: '5', name: 'Sora', username: 'sora', activity: 'Offline', online: false },
    { id: '6', name: 'Kai', username: 'kai', activity: 'Offline', online: false },
  ];

  if (activeChat?.kind === 'direct') return null;

  return (
    <aside
      className="w-56 border-l border-[#1e2333]/60 flex-shrink-0 overflow-y-auto py-4 hidden xl:block animate-slide-right"
      style={{ background: 'rgba(24, 29, 42, var(--panel-opacity, 0.97))' }}
    >
      <div className="px-3 mb-3">
        <span className="text-[11px] font-semibold text-[#5a6480] uppercase tracking-widest">
          Online — {onlineMembers.length}
        </span>
      </div>
      {onlineMembers.map((m, i) => (
        <MemberRow key={m.id} {...m} animDelay={i * 40} />
      ))}

      <div className="px-3 mt-5 mb-3">
        <span className="text-[11px] font-semibold text-[#5a6480] uppercase tracking-widest">
          Offline — {offlineMembers.length}
        </span>
      </div>
      {offlineMembers.map((m, i) => (
        <MemberRow key={m.id} {...m} animDelay={(onlineMembers.length + i) * 40} />
      ))}
    </aside>
  );
}

function MemberRow({
  name,
  activity,
  online,
  animDelay,
}: {
  name: string;
  username: string;
  activity: string;
  online: boolean;
  animDelay?: number;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-3 py-2 mx-2 rounded-xl cursor-pointer transition-all duration-150',
        'hover:bg-[#1e2333]/80 group',
        !online && 'opacity-50'
      )}
      style={{ animationDelay: `${animDelay ?? 0}ms` }}
    >
      <Avatar name={name} size="sm" online={online} />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#eef0f5] truncate leading-tight group-hover:text-white transition-colors">{name}</p>
        <p className="text-xs text-[#5a6480] truncate">{activity}</p>
      </div>
    </div>
  );
}

