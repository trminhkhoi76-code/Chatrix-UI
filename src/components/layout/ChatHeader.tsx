import { Search, Bell, Video, Pin, Users } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { useThemeStore, type Theme } from '@/store/themeStore';

const THEMES: { key: Theme; icon: string; label: string }[] = [
  { key: 'midnight', icon: '🌙', label: 'Midnight' },
  { key: 'daylight', icon: '☀️', label: 'Daylight' },
  { key: 'candy',    icon: '🫧', label: 'Bubble' },
];

export function ChatHeader() {
  const activeChat = useChatStore((s) => s.activeChat);
  const rooms = useChatStore((s) => s.rooms);
  const conversations = useChatStore((s) => s.conversations);
  const { theme, setTheme } = useThemeStore();

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
      className="h-14 border-b flex items-center px-4 gap-3 flex-shrink-0 backdrop-blur-sm"
      style={{
        background: 'var(--header-bg)',
        borderColor: 'var(--divider)',
        transition: 'background .45s ease, border-color .3s ease',
      }}
    >
      {/* Channel icon & name */}
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        {activeChat?.kind === 'room' ? (
          <span className="font-bold text-lg leading-none flex-shrink-0" style={{ color: 'var(--accent)' }}>#</span>
        ) : (
          <span className="w-5 h-5 rounded-full bg-green-500 flex-shrink-0" />
        )}
        <span className="font-bold truncate text-[15px]" style={{ color: 'var(--text)' }}>{title}</span>
        {subtitle && (
          <>
            <span className="hidden md:block" style={{ color: 'var(--divider)' }}>|</span>
            <span className="text-sm hidden md:block truncate" style={{ color: 'var(--muted)' }}>{subtitle}</span>
          </>
        )}
      </div>

      {/* Theme switcher */}
      {activeChat?.kind === 'room' && (
        <div
          className="hidden md:flex items-center gap-0.5 rounded-[13px] p-[3px]"
          style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', transition: 'background .45s ease' }}
        >
          {THEMES.map(({ key, icon, label }) => {
            const isActive = theme === key;
            return (
              <button
                key={key}
                onClick={() => setTheme(key)}
                title={label}
                className="w-[34px] h-[30px] rounded-[10px] flex items-center justify-center text-[15px] transition-all duration-200"
                style={{
                  background: isActive ? 'var(--accent-grad)' : 'transparent',
                  boxShadow: isActive ? 'var(--glow)' : 'none',
                  filter: isActive ? 'none' : 'grayscale(.4) opacity(.65)',
                }}
              >
                {icon}
              </button>
            );
          })}
        </div>
      )}

      {/* Standard actions */}
      <div className="flex items-center gap-0.5 flex-shrink-0">
        {activeChat?.kind === 'room' && (
          <>
            <button
              className="p-2 rounded-lg transition-all duration-150"
              style={{ color: 'var(--muted)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--hover-bg)'; (e.currentTarget as HTMLElement).style.color = 'var(--text)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; }}
            >
              <Video size={17} />
            </button>
            <button
              className="p-2 rounded-lg transition-all duration-150"
              style={{ color: 'var(--muted)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--hover-bg)'; (e.currentTarget as HTMLElement).style.color = 'var(--text)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; }}
            >
              <Pin size={17} />
            </button>
            <button
              className="p-2 rounded-lg transition-all duration-150"
              style={{ color: 'var(--muted)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--hover-bg)'; (e.currentTarget as HTMLElement).style.color = 'var(--text)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; }}
            >
              <Users size={17} />
            </button>
          </>
        )}
        <button
          className="p-2 rounded-lg transition-all duration-150"
          style={{ color: 'var(--muted)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--hover-bg)'; (e.currentTarget as HTMLElement).style.color = 'var(--text)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; }}
        >
          <Bell size={17} />
        </button>
        {/* Search */}
        <div className="relative ml-1">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--faint)' }} />
          <input
            type="text"
            placeholder="Search"
            className="rounded-xl pl-8 pr-3 py-1.5 text-sm w-32 focus:w-48 transition-all duration-200 outline-none"
            style={{
              background: 'var(--input-bg)',
              border: '1px solid var(--input-border)',
              color: 'var(--text)',
            }}
          />
        </div>
      </div>
    </header>
  );
}

