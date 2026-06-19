import { useState } from 'react';
import { Search } from 'lucide-react';

const AVATAR_COLORS: Record<string, string> = {
  A: 'from-[#f472b6] to-[#ec4899]',
  R: 'from-[#a78bfa] to-[#7c3aed]',
  M: 'from-[#34d399] to-[#059669]',
  S: 'from-[#60a5fa] to-[#3b82f6]',
  K: 'from-[#fbbf24] to-[#f59e0b]',
  Y: 'from-[#ff9a52] to-[#ff6b35]',
  H: 'from-[#818cf8] to-[#6366f1]',
  L: 'from-[#f9a8d4] to-[#f472b6]',
};

const STATUS_STYLES: Record<string, string> = {
  Active: 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/20',
  Idle: 'bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/20',
  Offline: 'bg-[#636b82]/15 text-[#636b82] border border-[#636b82]/20',
};

const MEMBERS = [
  { initial: 'A', name: 'Aiko Tanaka', handle: '@aiko', role: 'Member', messages: '4,182', joined: 'Jan 4, 2026', status: 'Active' },
  { initial: 'R', name: 'Ren Watanabe', handle: '@ren', role: 'Moderator', messages: '3,920', joined: 'Dec 19, 2025', status: 'Active' },
  { initial: 'M', name: 'Mika Sato', handle: '@mika', role: 'Member', messages: '2,604', joined: 'Feb 11, 2026', status: 'Active' },
  { initial: 'S', name: 'Sora Kim', handle: '@sora', role: 'Member', messages: '1,870', joined: 'Mar 2, 2026', status: 'Idle' },
  { initial: 'K', name: 'Kai Nakamura', handle: '@kai', role: 'Member', messages: '1,540', joined: 'Mar 18, 2026', status: 'Offline' },
  { initial: 'Y', name: 'Yuki Mori', handle: '@yuki', role: 'Admin', messages: '6,210', joined: 'Nov 8, 2025', status: 'Active' },
  { initial: 'H', name: 'Hana Suzuki', handle: '@hana', role: 'Member', messages: '940', joined: 'Apr 1, 2026', status: 'Offline' },
  { initial: 'L', name: 'Leo Yamada', handle: '@leo', role: 'Member', messages: '2,118', joined: 'Feb 24, 2026', status: 'Idle' },
];

const ROLE_STYLES: Record<string, string> = {
  Member: 'text-[#8891a8]',
  Moderator: 'text-[#a78bfa]',
  Admin: 'text-[#ff8c5a]',
};

export default function MembersView() {
  const [filter, setFilter] = useState('');
  const filtered = MEMBERS.filter(m =>
    m.name.toLowerCase().includes(filter.toLowerCase()) ||
    m.handle.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Stat row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total members', value: '12,480', sub: null },
          { label: 'New this week', value: '+312', sub: null, green: true },
          { label: 'Active now', value: '2,317', sub: null },
          { label: 'Moderators', value: '18', sub: null },
        ].map(card => (
          <div key={card.label} className="bg-[#1b1f2b] rounded-2xl p-5 border border-[#252b3a]">
            <p className="text-[12px] text-[#636b82] mb-2">{card.label}</p>
            <p className={`text-[28px] font-bold leading-none ${card.green ? 'text-[#22c55e]' : 'text-white'}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Members table */}
      <div className="bg-[#1b1f2b] rounded-2xl border border-[#252b3a] overflow-hidden">
        {/* Table header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#252b3a]">
          <div className="flex items-center gap-3">
            <p className="text-[15px] font-semibold text-white">All members</p>
            <span className="text-[11px] font-semibold bg-[#ff6b35]/15 text-[#ff8c5a] px-2 py-0.5 rounded-md border border-[#ff6b35]/20">
              {filtered.length} total
            </span>
          </div>
          <div className="flex items-center gap-2 bg-[#13151d] border border-[#252b3a] rounded-xl px-3 py-1.5 w-52">
            <Search size={13} className="text-[#636b82] flex-shrink-0" />
            <input
              value={filter}
              onChange={e => setFilter(e.target.value)}
              placeholder="Filter members…"
              className="bg-transparent text-[12px] text-white placeholder-[#636b82] outline-none w-full"
            />
          </div>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1.5fr_1fr] px-5 py-3 border-b border-[#252b3a]">
          {['MEMBER', 'ROLE', 'MESSAGES', 'JOINED', 'STATUS'].map(col => (
            <span key={col} className="text-[10px] font-semibold text-[#636b82] tracking-wider">{col}</span>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-[#252b3a]/60">
          {filtered.map((m, i) => (
            <div
              key={m.handle}
              className="grid grid-cols-[2fr_1fr_1fr_1.5fr_1fr] items-center px-5 py-3.5 hover:bg-white/[0.02] transition-colors animate-fade-in"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {/* Member */}
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${AVATAR_COLORS[m.initial] ?? 'from-[#636b82] to-[#4b5563]'} flex items-center justify-center text-sm font-bold text-white flex-shrink-0`}>
                  {m.initial}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white leading-tight">{m.name}</p>
                  <p className="text-[11px] text-[#636b82]">{m.handle}</p>
                </div>
              </div>
              {/* Role */}
              <span className={`text-[12px] font-medium ${ROLE_STYLES[m.role] ?? 'text-[#8891a8]'}`}>{m.role}</span>
              {/* Messages */}
              <span className="text-[13px] text-white font-medium">{m.messages}</span>
              {/* Joined */}
              <span className="text-[12px] text-[#8891a8]">{m.joined}</span>
              {/* Status */}
              <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full w-fit ${STATUS_STYLES[m.status] ?? ''}`}>
                {m.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
