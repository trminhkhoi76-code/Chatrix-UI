import { Search, Bell, Video, Pin, Users } from 'lucide-react';
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
    <header
      className="h-14 border-b border-[#1e2333]/60 flex items-center px-4 gap-3 flex-shrink-0"
      style={{ background: 'rgba(24, 29, 42, var(--panel-opacity, 0.97))' }}
    >
      {/* Channel icon & name */}
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        {activeChat?.kind === 'room' ? (
          <span className="text-[#ff8c5a] font-bold text-lg leading-none">#</span>
        ) : (
          <span className="w-5 h-5 rounded-full bg-green-500 flex-shrink-0" />
        )}
        <span className="font-bold text-white truncate text-[15px]">{title}</span>
        {subtitle && (
          <>
            <span className="text-[#2e3649] hidden md:block">|</span>
            <span className="text-[#636b82] text-sm hidden md:block truncate">{subtitle}</span>
          </>
        )}
      </div>

      {/* Action icon buttons (decorative, matching reference UI) */}
      {activeChat?.kind === 'room' && (
        <div className="hidden md:flex items-center gap-1.5 mr-1">
          <button className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#ffa85e] flex items-center justify-center hover:opacity-80 transition-opacity shadow-md shadow-[#ff6b35]/20">
            <span className="text-white text-[13px] font-bold">☀</span>
          </button>
          <button className="w-8 h-8 rounded-full bg-[#252b3a] flex items-center justify-center hover:bg-[#2e3649] transition-colors">
            <span className="text-[#9ba3b8] text-sm">●</span>
          </button>
          <button className="w-8 h-8 rounded-full bg-gradient-to-br from-[#a855f7] via-[#ec4899] to-[#ff6b35] flex items-center justify-center hover:opacity-80 transition-opacity shadow-md shadow-purple-500/20">
            <span className="text-white text-[11px] font-bold">✦</span>
          </button>
        </div>
      )}

      {/* Standard actions */}
      <div className="flex items-center gap-0.5 flex-shrink-0">
        {activeChat?.kind === 'room' && (
          <>
            <button className="p-2 text-[#636b82] hover:text-white hover:bg-[#252b3a] rounded-lg transition-all duration-150">
              <Video size={17} />
            </button>
            <button className="p-2 text-[#636b82] hover:text-white hover:bg-[#252b3a] rounded-lg transition-all duration-150">
              <Pin size={17} />
            </button>
            <button className="p-2 text-[#636b82] hover:text-white hover:bg-[#252b3a] rounded-lg transition-all duration-150">
              <Users size={17} />
            </button>
          </>
        )}
        <button className="p-2 text-[#636b82] hover:text-white hover:bg-[#252b3a] rounded-lg transition-all duration-150">
          <Bell size={17} />
        </button>
        {/* Search */}
        <div className="relative ml-1">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#636b82]" />
          <input
            type="text"
            placeholder="Search"
            className="bg-[#13151d] border border-[#252b3a] rounded-xl pl-8 pr-3 py-1.5 text-sm text-[#9ba3b8] placeholder-[#636b82] focus:outline-none focus:border-[#ff6b35]/60 focus:ring-1 focus:ring-[#ff6b35]/30 w-32 focus:w-48 transition-all duration-200"
          />
        </div>
      </div>
    </header>
  );
}

