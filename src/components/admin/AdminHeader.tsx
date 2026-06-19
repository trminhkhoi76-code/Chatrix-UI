import { Bell, Search } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import type { Period } from '@/pages/AdminPage';

interface Props {
  title: string;
  subtitle: string;
  period: Period;
  onPeriodChange: (p: Period) => void;
}

const THEMES = [
  { key: 'midnight' as const, icon: '🌙', label: 'Midnight' },
  { key: 'daylight' as const, icon: '☀️', label: 'Daylight' },
  { key: 'candy'    as const, icon: '🫧', label: 'Bubble'   },
];

export default function AdminHeader({ title, subtitle, period, onPeriodChange }: Props) {
  const { theme, setTheme } = useThemeStore();

  return (
    <div
      className="flex items-center gap-3.5 px-[26px] flex-shrink-0 border-b"
      style={{ height: 70, background: 'var(--header-bg)', backdropFilter: 'blur(14px)', borderColor: 'var(--divider)', transition: 'background .45s ease' }}
    >
      {/* Title */}
      <div className="flex-shrink-0">
        <h1 className="text-[19px] font-extrabold leading-tight" style={{ color: 'var(--text)' }}>{title}</h1>
        <p className="text-[12.5px] font-semibold leading-tight" style={{ color: 'var(--muted)' }}>{subtitle}</p>
      </div>

      <div className="flex-1" />

      {/* Search */}
      <div
        className="flex items-center gap-[7px] rounded-[11px] px-[13px] py-[9px] w-[200px]"
        style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)' }}
      >
        <Search size={15} style={{ color: 'var(--faint)', flexShrink: 0 }} />
        <span className="text-[13px] font-semibold" style={{ color: 'var(--faint)' }}>Search anything…</span>
      </div>

      {/* Period pills */}
      <div
        className="flex gap-[3px] rounded-xl p-[3px]"
        style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)' }}
      >
        {(['7d', '14d', '30d'] as Period[]).map(p => (
          <button
            key={p}
            onClick={() => onPeriodChange(p)}
            className="px-3 py-1.5 rounded-[9px] text-[12px] font-bold transition-all duration-150"
            style={{
              background: period === p ? 'linear-gradient(135deg,#ff9a52,#ff6b35)' : 'transparent',
              color:      period === p ? '#fff' : 'var(--muted)',
            }}
          >{p}</button>
        ))}
      </div>

      {/* Theme switcher — wired to useThemeStore */}
      <div
        className="flex gap-[3px] rounded-xl p-[3px]"
        style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)' }}
      >
        {THEMES.map(th => (
          <button
            key={th.key}
            onClick={() => setTheme(th.key)}
            title={th.label}
            className="w-[34px] h-[30px] rounded-[9px] flex items-center justify-center text-[15px] transition-all duration-200"
            style={{
              background:  theme === th.key ? 'linear-gradient(135deg,#ff9a52,#ff6b35)' : 'transparent',
              boxShadow:   theme === th.key ? '0 4px 14px rgba(255,106,61,.45)' : 'none',
              filter:      theme === th.key ? 'none' : 'grayscale(.4) opacity(.65)',
            }}
          >{th.icon}</button>
        ))}
      </div>

      {/* Bell */}
      <button
        className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all"
        style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--muted)' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--hover-bg)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--input-bg)'; }}
      >
        <Bell size={19} />
        <span className="absolute top-[8px] right-[9px] w-2 h-2 bg-[#e8493f] rounded-full border-2" style={{ borderColor: 'var(--side-bg)' }} />
      </button>
    </div>
  );
}
