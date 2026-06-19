import { LayoutDashboard, Users, BarChart3, Hash, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import type { AdminView } from '@/pages/AdminPage';

interface Props {
  activeView: AdminView;
  onNavigate: (view: AdminView) => void;
}

const NAV_ITEMS = [
  { id: 'dashboard' as AdminView, label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { id: 'members'   as AdminView, label: 'Members',   icon: Users,           badge: '12' },
  { id: 'reports'   as AdminView, label: 'Reports',   icon: BarChart3,       badge: null },
];
const GEN_ITEMS = [
  { id: 'channels' as AdminView, label: 'Channels', icon: Hash,     badge: null },
  { id: 'settings' as AdminView, label: 'Settings', icon: Settings, badge: null },
];

export default function AdminSidebar({ activeView, onNavigate }: Props) {
  const { user, logout } = useAuthStore();

  return (
    <div
      className="w-[236px] flex-shrink-0 flex flex-col h-full"
      style={{ background: 'var(--side-bg)', borderRight: '1px solid var(--divider)', transition: 'background .45s ease' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-[11px] px-[18px] pt-5 pb-[18px]">
        <div
          className="w-10 h-10 rounded-[13px] flex items-center justify-center font-extrabold text-[19px] text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#ff9a52,#ff6b35)', boxShadow: '0 6px 22px rgba(255,106,61,.4)' }}
        >C</div>
        <div style={{ lineHeight: 1.15 }}>
          <div className="font-extrabold text-[16px]" style={{ color: 'var(--text)' }}>Chatrix</div>
          <div className="font-bold text-[11px] tracking-[0.5px]" style={{ color: '#ff6b35' }}>ADMIN</div>
        </div>
      </div>

      {/* Menu */}
      <p className="px-3 pb-2 text-[10.5px] font-extrabold tracking-[1px] uppercase" style={{ color: 'var(--faint)' }}>MENU</p>
      <div className="flex flex-col gap-[3px] px-3">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex items-center gap-[11px] w-full border-0 cursor-pointer px-3 py-[10px] rounded-xl text-[13.5px] font-bold transition-all duration-150"
              style={{
                background: isActive ? 'color-mix(in srgb,#ff6b35 15%,transparent)' : 'transparent',
                color: isActive ? '#ff6b35' : 'var(--muted)',
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--hover-bg)'; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <Icon size={18} className="flex-shrink-0" style={{ opacity: isActive ? 1 : 0.7 }} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] font-extrabold bg-[#e8493f] text-white rounded-full px-[7px] py-[2px]">{item.badge}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* General */}
      <p className="px-3 pt-[18px] pb-2 text-[10.5px] font-extrabold tracking-[1px] uppercase" style={{ color: 'var(--faint)' }}>GENERAL</p>
      <div className="flex flex-col gap-[3px] px-3">
        {GEN_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex items-center gap-[11px] w-full border-0 cursor-pointer px-3 py-[10px] rounded-xl text-[13.5px] font-bold transition-all duration-150"
              style={{
                background: isActive ? 'color-mix(in srgb,#ff6b35 15%,transparent)' : 'transparent',
                color: isActive ? '#ff6b35' : 'var(--muted)',
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--hover-bg)'; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <Icon size={18} className="flex-shrink-0" style={{ opacity: isActive ? 1 : 0.7 }} />
              <span className="flex-1 text-left">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex-1" />

      {/* All systems green — orange gradient matching reference */}
      <div
        className="mx-3 mb-3 p-[15px] rounded-2xl text-white"
        style={{ background: 'linear-gradient(135deg,#ff9a52,#ff6b35)', boxShadow: '0 6px 22px rgba(255,106,61,.4)' }}
      >
        <div className="font-extrabold text-[14px] mb-[3px]">All systems green</div>
        <div className="font-semibold text-[12px] leading-[1.4]" style={{ opacity: 0.85 }}>Uptime 99.98% · 0 incidents this week</div>
      </div>

      {/* User panel */}
      <div className="flex items-center gap-[10px] px-4 py-3 border-t" style={{ borderColor: 'var(--divider)' }}>
        <div
          className="w-9 h-9 rounded-[11px] flex items-center justify-center text-[14px] font-extrabold text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#ff9a52,#ff6b35)' }}
        >
          {(user?.displayName ?? user?.username ?? 'M')[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold leading-tight truncate" style={{ color: 'var(--text)' }}>{user?.displayName ?? user?.username ?? 'Admin'}</p>
          <p className="text-[11px]" style={{ color: 'var(--muted)' }}>Super Admin</p>
        </div>
        <button
          onClick={logout}
          className="p-1.5 rounded-lg transition-colors"
          title="Sign out"
          style={{ color: 'var(--muted)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#ef4444'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; }}
        >
          <LogOut size={15} />
        </button>
      </div>
    </div>
  );
}
