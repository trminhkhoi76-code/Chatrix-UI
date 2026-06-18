import { Hash, Search, Bell, Video, Pin, Users } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';

export function ChatHeader() {
  const activeChat = useChatStore((s) => s.activeChat);
  const rooms = useChatStore((s) => s.rooms);
  const conversations = useChatStore((s) => s.conversations);

  let title = '';
  let subtitle = '';

  if (activeChat?.kind === 'room') {
    const room = rooms.find((r) => r.id === activeChat.roomId);
    title = room?.name ?? activeChat.roomId;
    subtitle = 'Text channel';
  } else if (activeChat?.kind === 'direct') {
    const conv = conversations.find((c) => c.userId === activeChat.userId);
    title = conv?.displayName ?? conv?.username ?? activeChat.userId;
    subtitle = conv?.isOnline ? 'Online' : 'Offline';
  }

  return (
    <header className="h-14 bg-[#161b27] border-b border-[#1e2535] flex items-center px-4 gap-3 flex-shrink-0">
      {/* Channel icon & name */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {activeChat?.kind === 'room' ? (
          <Hash size={20} className="text-gray-400 flex-shrink-0" />
        ) : (
          <span className="w-5 h-5 rounded-full bg-green-500 flex-shrink-0" />
        )}
        <span className="font-semibold text-white truncate">{title}</span>
        {subtitle && (
          <>
            <span className="text-gray-600 hidden md:block">|</span>
            <span className="text-gray-400 text-sm hidden md:block truncate">{subtitle}</span>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {activeChat?.kind === 'room' && (
          <>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-[#252d3d] rounded-lg transition-colors">
              <Video size={18} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-[#252d3d] rounded-lg transition-colors">
              <Pin size={18} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-[#252d3d] rounded-lg transition-colors">
              <Users size={18} />
            </button>
          </>
        )}
        <button className="p-2 text-gray-400 hover:text-white hover:bg-[#252d3d] rounded-lg transition-colors">
          <Bell size={18} />
        </button>
        <div className="relative">
          <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            className="bg-[#0f1117] border border-[#252d3d] rounded-lg pl-8 pr-3 py-1.5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-orange-500 w-32 focus:w-48 transition-all duration-200"
          />
        </div>
      </div>
    </header>
  );
}
