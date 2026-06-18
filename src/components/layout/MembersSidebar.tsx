import { Avatar } from '@/components/ui/Avatar';
import { useChatStore } from '@/store/chatStore';
import { cn } from '@/lib/utils';

export function MembersSidebar() {
  const activeChat = useChatStore((s) => s.activeChat);

  // For demo: show online/offline members
  const onlineMembers = [
    { id: '1', name: 'Kente', username: 'kente', online: true },
    { id: '2', name: 'Verve', username: 'verve', online: true },
    { id: '3', name: 'Sair', username: 'sair', online: true },
    { id: '4', name: 'Mario', username: 'mario', online: true },
  ];
  const offlineMembers = [
    { id: '5', name: 'Stois', username: 'stois', online: false },
  ];

  if (activeChat?.kind === 'direct') return null;

  return (
    <aside className="w-56 bg-[#161b27] border-l border-[#1e2535] flex-shrink-0 overflow-y-auto py-4 hidden xl:block">
      <div className="px-3 mb-2">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Online — {onlineMembers.length}
        </span>
      </div>
      {onlineMembers.map((m) => (
        <MemberRow key={m.id} name={m.name} username={m.username} online />
      ))}

      <div className="px-3 mt-4 mb-2">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Offline — {offlineMembers.length}
        </span>
      </div>
      {offlineMembers.map((m) => (
        <MemberRow key={m.id} name={m.name} username={m.username} online={false} />
      ))}
    </aside>
  );
}

function MemberRow({ name, username, online }: { name: string; username: string; online: boolean }) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-3 py-1.5 mx-2 rounded-lg cursor-pointer transition-colors',
        'hover:bg-[#252d3d]',
        !online && 'opacity-50'
      )}
    >
      <Avatar name={name} size="sm" online={online} />
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-200 truncate">{name}</p>
        <p className="text-xs text-gray-500 truncate">@{username}</p>
      </div>
    </div>
  );
}
