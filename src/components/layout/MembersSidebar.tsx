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
      className="w-56 flex-shrink-0 overflow-y-auto py-4 hidden xl:block animate-slide-right"
      style={{
        background: 'var(--side-bg)',
        borderLeft: '1px solid var(--divider)',
        transition: 'background .45s ease',
      }}
    >
      <div className="px-3 mb-3">
        <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--faint)' }}>
          Online — {onlineMembers.length}
        </span>
      </div>
      {onlineMembers.map((m, i) => (
        <MemberRow key={m.id} {...m} animDelay={i * 40} />
      ))}

      <div className="px-3 mt-5 mb-3">
        <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--faint)' }}>
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
        'flex items-center gap-3 px-3 py-2 mx-2 rounded-xl cursor-pointer transition-all duration-150 group',
        !online && 'opacity-50'
      )}
      style={{ animationDelay: `${animDelay ?? 0}ms` }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--hover-bg)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
    >
      <Avatar name={name} size="sm" online={online} />
      <div className="min-w-0">
        <p className="text-sm font-semibold truncate leading-tight" style={{ color: 'var(--text)' }}>{name}</p>
        <p className="text-xs truncate" style={{ color: 'var(--muted)' }}>{activity}</p>
      </div>
    </div>
  );
}

