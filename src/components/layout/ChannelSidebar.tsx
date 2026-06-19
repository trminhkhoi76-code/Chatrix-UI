import { Plus, ChevronDown, Mic, Headphones, Settings, LogOut } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';
import { chatWs } from '@/services/websocket';

const CHANNEL_ICONS: Record<string, string> = {
  general: '💬',
  ideas: '💡',
  design: '🎨',
  gaming: '🎮',
  music: '🎵',
  random: '🎲',
  archive: '📁',
};

export function ChannelSidebar() {
  const rooms = useChatStore((s) => s.rooms);
  const activeChat = useChatStore((s) => s.activeChat);
  const setActiveChat = useChatStore((s) => s.setActiveChat);
  const clearUnread = useChatStore((s) => s.clearUnread);
  const wsConnected = useChatStore((s) => s.wsConnected);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  function handleSelectRoom(roomId: string) {
    if (activeChat?.kind === 'room' && activeChat.roomId !== roomId) {
      chatWs.joinRoom(roomId);
    }
    setActiveChat({ kind: 'room', roomId });
    clearUnread(roomId);
  }

  function handleLogout() {
    chatWs.disconnect();
    logout();
  }

  return (
    <aside
      className="w-60 flex flex-col flex-shrink-0"
      style={{
        background: 'var(--side-bg)',
        borderRight: '1px solid var(--divider)',
        transition: 'background .45s ease',
      }}
    >
      {/* Server name header */}
      <div
        className="h-14 flex items-center justify-between px-4 shadow-sm flex-shrink-0"
        style={{ borderBottom: '1px solid var(--divider)' }}
      >
        <div className="flex items-center gap-2">
          <span className="font-bold truncate" style={{ color: 'var(--text)' }}>Chatrix</span>
          <span className="bg-gradient-to-r from-[#ff6b35] to-[#e84393] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none tracking-wide">
            PRO
          </span>
        </div>
        <ChevronDown size={15} className="text-[#5a6480] flex-shrink-0" />
      </div>

      {/* Channels */}
      <div className="flex-1 overflow-y-auto py-3">
        <div className="px-3 mb-2 flex items-center justify-between group">
          <span className="text-[11px] font-semibold text-[#5a6480] uppercase tracking-widest">
            Text Channels
          </span>
          <button className="opacity-0 group-hover:opacity-100 text-[#5a6480] hover:text-white transition-all duration-150 hover:bg-[#252b3a] rounded p-0.5">
            <Plus size={13} />
          </button>
        </div>

        <div className="flex flex-col gap-0.5 px-2">
          {rooms.map((room, i) => {
            const isActive = activeChat?.kind === 'room' && activeChat.roomId === room.id;
            const icon = CHANNEL_ICONS[room.id] ?? '💬';
            return (
              <button
                key={room.id}
                onClick={() => handleSelectRoom(room.id)}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm w-full text-left transition-all duration-150',
                  'animate-slide-left',
                  isActive
                    ? 'bg-[#ff6b35]/15 text-[#ff8c5a]'
                    : 'hover:bg-[var(--hover-bg)]'
                )}
                style={{ animationDelay: `${i * 30}ms`, color: isActive ? undefined : 'var(--muted)' }}
              >
                <span className="text-base leading-none w-5 text-center">{icon}</span>
                <span className="flex-1 truncate font-medium">{room.name}</span>
                <div className="flex items-center gap-1">
                  {room.isNew && (
                    <span className="bg-[#ff6b35] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                      Now
                    </span>
                  )}
                  {(room.unreadCount ?? 0) > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 leading-none">
                      {room.unreadCount}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* User panel */}
      <div
        className="h-14 border-t flex items-center px-3 gap-2 flex-shrink-0"
        style={{ background: 'var(--panel-bg)', borderColor: 'var(--divider)', transition: 'background .45s ease' }}
      >
        <div className="relative">
          <Avatar name={user?.displayName ?? user?.username ?? 'U'} src={user?.avatarUrl} size="sm" />
          <span
            className={cn(
              'absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#13151d] transition-colors duration-300',
              wsConnected ? 'bg-green-400' : 'bg-[#636b82]'
            )}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate leading-tight" style={{ color: 'var(--text)' }}>
            {user?.displayName ?? user?.username}
          </p>
          <p className={cn('text-xs truncate transition-colors duration-300', wsConnected ? 'text-green-400' : 'text-[#636b82]')}>
            {wsConnected ? 'Online' : 'Connecting...'}
          </p>
        </div>
        <div className="flex items-center gap-0.5">
          <button className="p-1.5 hover:text-white hover:bg-[#252b3a] rounded-lg transition-all duration-150" style={{ color: 'var(--muted)' }} title="Microphone">
            <Mic size={15} />
          </button>
          <button className="p-1.5 hover:text-white hover:bg-[#252b3a] rounded-lg transition-all duration-150" style={{ color: 'var(--muted)' }} title="Headphones">
            <Headphones size={15} />
          </button>
          <button className="p-1.5 hover:text-white hover:bg-[#252b3a] rounded-lg transition-all duration-150" style={{ color: 'var(--muted)' }} title="Settings">
            <Settings size={15} />
          </button>
          <button
            onClick={handleLogout}
            className="p-1.5 text-[#636b82] hover:text-red-400 hover:bg-[#252b3a] rounded-lg transition-all duration-150"
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}

