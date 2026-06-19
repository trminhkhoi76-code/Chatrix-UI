import { Bell, Search } from 'lucide-react';
import type { Period } from '@/pages/AdminPage';

interface Props {
  title: string;
  subtitle: string;
  period: Period;
  onPeriodChange: (p: Period) => void;
}

export default function AdminHeader({ title, subtitle, period, onPeriodChange }: Props) {
  return (
    <div className="flex items-center gap-3 px-6 py-3.5 border-b border-[#1e2333] flex-shrink-0" style={{ background: '#13151d' }}>
      {/* Title */}
      <div className="flex-shrink-0">
        <h1 className="text-[18px] font-bold text-white leading-tight">{title}</h1>
        <p className="text-[11px] text-[#636b82] leading-tight">{subtitle}</p>
      </div>

      <div className="flex-1" />

      {/* Search */}
      <div className="flex items-center gap-2 bg-[#1e2333] border border-[#252b3a] rounded-xl px-3 py-2 w-48">
        <Search size={13} className="text-[#636b82] flex-shrink-0" />
        <input
          placeholder="Search anything…"
          className="bg-transparent text-[12px] text-white placeholder-[#636b82] outline-none w-full"
        />
      </div>

      {/* Period pills */}
      <div className="flex items-center bg-[#1e2333] border border-[#252b3a] rounded-xl p-1 gap-0.5">
        {(['7d', '14d', '30d'] as Period[]).map(p => (
          <button
            key={p}
            onClick={() => onPeriodChange(p)}
            className={`px-3 py-1 rounded-lg text-[12px] font-semibold transition-all duration-150 ${
              period === p
                ? 'bg-gradient-to-br from-[#ff6b35] to-[#e8503a] text-white shadow-md shadow-[#ff6b35]/20'
                : 'text-[#636b82] hover:text-white'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Decorative buttons */}
      <div className="flex items-center gap-1">
        {['🌙', '☀️', '🫧'].map(emoji => (
          <button
            key={emoji}
            className="w-8 h-8 rounded-full bg-[#1e2333] border border-[#252b3a] flex items-center justify-center text-sm hover:bg-[#252b3a] transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Bell */}
      <button className="relative w-9 h-9 rounded-xl bg-[#1e2333] border border-[#252b3a] flex items-center justify-center text-[#636b82] hover:text-white hover:bg-[#252b3a] transition-all">
        <Bell size={15} />
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#ef4444] rounded-full border-2 border-[#13151d]" />
      </button>
    </div>
  );
}
