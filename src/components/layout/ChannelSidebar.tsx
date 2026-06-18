import { Hash, Plus, ChevronDown, Mic, MicOff, Headphones, Settings, LogOut } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';
import { chatWs } from '@/services/websocket';

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
    <aside className="w-60 bg-[#161b27] flex flex-col border-r border-[#1e2535]">
      {/* Server name header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-[#1e2535] shadow-sm">
        <span className="font-semibold text-white truncate">Chatrix</span>
        <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
      </div>

      {/* Channels */}
      <div className="flex-1 overflow-y-auto py-3">
        <div className="px-3 mb-1 flex items-center justify-between group">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Text Channels
          </span>
          <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-opacity">
            <Plus size={14} />
          </button>
        </div>

        <div className="flex flex-col gap-px px-2">
          {rooms.map((room) => {
            const isActive = activeChat?.kind === 'room' && activeChat.roomId === room.id;
            return (
              <button
                key={room.id}
                onClick={() => handleSelectRoom(room.id)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm w-full text-left transition-colors duration-100',
                  isActive
                    ? 'bg-[#252d3d] text-white'
                    : 'text-gray-400 hover:bg-[#1e2535] hover:text-gray-200'
                )}
              >
                <Hash size={16} className="flex-shrink-0 opacity-60" />
                <span className="flex-1 truncate">{room.name}</span>
                <div className="flex items-center gap-1">
                  {room.isNew && (
                    <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                      Now
                    </span>
                  )}
                  {(room.unreadCount ?? 0) > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
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
      <div className="h-14 bg-[#0f1117] border-t border-[#1e2535] flex items-center px-3 gap-2">
        <div className="relative">
          <Avatar name={user?.displayName ?? user?.username ?? 'U'} src={user?.avatarUrl} size="sm" />
          <span
            className={cn(
              'absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0f1117]',
              wsConnected ? 'bg-green-400' : 'bg-gray-500'
            )}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate leading-tight">
            {user?.displayName ?? user?.username}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {wsConnected ? 'Online' : 'Connecting...'}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1.5 text-gray-400 hover:text-white hover:bg-[#252d3d] rounded-lg transition-colors">
            <Mic size={16} />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-white hover:bg-[#252d3d] rounded-lg transition-colors">
            <Headphones size={16} />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-white hover:bg-[#252d3d] rounded-lg transition-colors">
            <Settings size={16} />
          </button>
          <button
            onClick={handleLogout}
            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-[#252d3d] rounded-lg transition-colors"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}

export { MicOff };
