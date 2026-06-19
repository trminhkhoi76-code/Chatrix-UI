import { LayoutDashboard, Users, BarChart3, Hash, Settings } from 'lucide-react';
import type { AdminView } from '@/pages/AdminPage';

interface Props {
  activeView: AdminView;
  onNavigate: (view: AdminView) => void;
}

const MENU_ITEMS = [
  { id: 'dashboard' as AdminView, label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { id: 'members' as AdminView, label: 'Members', icon: Users, badge: '12' },
  { id: 'reports' as AdminView, label: 'Reports', icon: BarChart3, badge: null },
];

const GENERAL_ITEMS = [
  { id: 'channels' as AdminView, label: 'Channels', icon: Hash, badge: null },
  { id: 'settings' as AdminView, label: 'Settings', icon: Settings, badge: null },
];

export default function AdminSidebar({ activeView, onNavigate }: Props) {
  return (
    <div className="w-[240px] flex-shrink-0 flex flex-col h-full" style={{ background: '#1b1f2b' }}>
      {/* Logo */}
      <div className="px-5 pt-5 pb-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff6b35] to-[#e8503a] flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-[#ff6b35]/20 flex-shrink-0">
          C
        </div>
        <div className="flex flex-col leading-none gap-0.5">
          <span className="font-bold text-[15px] text-white">Chatrix</span>
          <span className="text-[9px] font-bold text-[#ff8c5a] tracking-[0.18em] uppercase">Admin</span>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-3 space-y-0.5">
        <p className="px-2 pt-1 pb-2 text-[10px] font-semibold text-[#636b82] tracking-[0.15em] uppercase">Menu</p>
        {MENU_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-gradient-to-r from-[#ff6b35]/20 to-transparent text-white'
                  : 'text-[#8891a8] hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-[#ff8c5a]' : 'opacity-70'} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] font-bold bg-[#ef4444] text-white rounded-full px-1.5 min-w-[18px] text-center leading-[18px]">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <p className="px-2 pt-4 pb-2 text-[10px] font-semibold text-[#636b82] tracking-[0.15em] uppercase">General</p>
        {GENERAL_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-gradient-to-r from-[#ff6b35]/20 to-transparent text-white'
                  : 'text-[#8891a8] hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-[#ff8c5a]' : 'opacity-70'} />
              <span className="flex-1 text-left">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Status card */}
      <div className="mx-3 mb-3 p-3 rounded-xl border border-[#22c55e]/20" style={{ background: 'rgba(34,197,94,0.08)' }}>
        <div className="flex items-center gap-2 mb-0.5">
          <div className="w-2 h-2 rounded-full bg-[#22c55e] flex-shrink-0" style={{ boxShadow: '0 0 6px #22c55e' }} />
          <span className="text-[12px] font-semibold text-[#22c55e]">All systems green</span>
        </div>
        <p className="text-[11px] text-[#636b82] pl-4">Uptime 99.98% · 0 incidents this week</p>
      </div>

      {/* User panel */}
      <div className="p-3 border-t border-[#252b3a] flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff9a52] to-[#ff6b35] flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
          M
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-white leading-tight">mkt-76</p>
          <p className="text-[11px] text-[#636b82]">Super Admin</p>
        </div>
      </div>
    </div>
  );
}
