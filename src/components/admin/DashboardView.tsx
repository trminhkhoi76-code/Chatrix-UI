import { useState } from 'react';
import type { Period } from '@/pages/AdminPage';

// ─── Sparkline chart ─────────────────────────────────────────────────────────
function Sparkline({ points, color }: { points: string; color: string }) {
  return (
    <svg viewBox="0 0 80 32" className="w-20 h-8" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sf-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={points.replace(/\d+ \d+/g, m => m)}
        fill={`url(#sf-${color.replace('#', '')})`}
        stroke="none"
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  emoji, label, value, change, sparkPoints, sparkColor,
}: {
  emoji: string; label: string; value: string; change: string;
  sparkPoints: string; sparkColor: string;
}) {
  return (
    <div className="bg-[#1b1f2b] rounded-2xl p-5 border border-[#252b3a] flex flex-col gap-3 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{emoji}</span>
          <span className="text-[11px] font-semibold text-[#22c55e] bg-[#22c55e]/10 px-1.5 py-0.5 rounded-md">▲ {change}</span>
        </div>
        <Sparkline points={sparkPoints} color={sparkColor} />
      </div>
      <div>
        <p className="text-[26px] font-bold text-white leading-none tracking-tight">{value}</p>
        <p className="text-[12px] text-[#636b82] mt-1">{label}</p>
      </div>
    </div>
  );
}

// ─── Donut segment ────────────────────────────────────────────────────────────
const DONUT_SEGMENTS = [
  { label: '#general', pct: 38, color: '#f97316', dash: 179, offset: 0 },
  { label: '#gaming', pct: 24, color: '#8b5cf6', dash: 113, offset: -179 },
  { label: '#design', pct: 16, color: '#10b981', dash: 75, offset: -292 },
  { label: '#music', pct: 12, color: '#38bdf8', dash: 57, offset: -367 },
  { label: '#random', pct: 10, color: '#eab308', dash: 47, offset: -424 },
];

const CIRC = 471; // 2π × 75

function DonutChart() {
  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-[160px]">
      <g transform="rotate(-90 100 100)">
        {DONUT_SEGMENTS.map(seg => (
          <circle
            key={seg.label}
            cx="100" cy="100" r="75"
            fill="none"
            stroke={seg.color}
            strokeWidth="26"
            strokeDasharray={`${seg.dash} ${CIRC - seg.dash}`}
            strokeDashoffset={seg.offset}
            strokeLinecap="butt"
          />
        ))}
        {/* Inner ring bg */}
        <circle cx="100" cy="100" r="60" fill="#1b1f2b" />
      </g>
      <text x="100" y="96" textAnchor="middle" fontSize="18" fontWeight="700" fill="white">1.24M</text>
      <text x="100" y="112" textAnchor="middle" fontSize="11" fill="#636b82">total msgs</text>
    </svg>
  );
}

// ─── Growth chart ─────────────────────────────────────────────────────────────
const GROWTH_PTS = [
  [0, 165], [43, 148], [86, 156], [130, 137], [173, 121],
  [216, 130], [259, 105], [302, 90], [345, 98], [388, 72],
  [431, 52], [474, 36], [517, 20], [560, 8],
];

function GrowthChart() {
  const area = `M 0 180 L ${GROWTH_PTS.map(([x, y]) => `${x} ${y}`).join(' L ')} L 560 180 Z`;
  return (
    <svg viewBox="0 0 560 180" className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="growth-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ff6b35" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#growth-fill)" />
      <polyline
        points={GROWTH_PTS.map(([x, y]) => `${x},${y}`).join(' ')}
        fill="none"
        stroke="#ff6b35"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Active dot at end */}
      <circle cx="560" cy="8" r="4" fill="#ff6b35" />
      <circle cx="560" cy="8" r="7" fill="#ff6b35" fillOpacity="0.2" />
    </svg>
  );
}

// ─── Bar chart (Messages sent per day) ────────────────────────────────────────
const BAR_DATA = [
  { label: 'Mon', h: 58 }, { label: 'Tue', h: 68 }, { label: 'Wed', h: 64 },
  { label: 'Thu', h: 73 }, { label: 'Fri', h: 80 }, { label: 'Sat', h: 86 },
  { label: 'Sun', h: 95 },
];

function BarChart() {
  return (
    <div className="flex items-end gap-2 h-[120px] w-full">
      {BAR_DATA.map((bar, i) => {
        const isLast = i === BAR_DATA.length - 1;
        const height = `${bar.h}%`;
        return (
          <div key={bar.label} className="flex-1 flex flex-col items-center gap-1.5">
            <div
              className={`w-full rounded-t-lg transition-all ${isLast ? 'bg-gradient-to-t from-[#e8503a] to-[#ff9a52]' : 'bg-[#ff6b35]/50 hover:bg-[#ff6b35]/70'}`}
              style={{ height, minHeight: 4 }}
            />
            <span className="text-[10px] text-[#636b82]">{bar.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Top channels ─────────────────────────────────────────────────────────────
const TOP_CHANNELS = [
  { emoji: '💬', name: '#general', count: '418k', pct: 100 },
  { emoji: '🎮', name: '#gaming', count: '264k', pct: 63 },
  { emoji: '🎨', name: '#design', count: '176k', pct: 42 },
  { emoji: '🎵', name: '#music', count: '132k', pct: 32 },
  { emoji: '🎲', name: '#random', count: '110k', pct: 26 },
];

// ─── Dashboard View ────────────────────────────────────────────────────────────
export default function DashboardView({ period: _period }: { period: Period }) {
  const [activeTab, setActiveTab] = useState<'Active' | 'signups' | 'Messages'>('Active');

  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          emoji="👥" label="Total registered" value="12,480" change="8.2%"
          sparkPoints="0,28 10,24 20,26 30,20 40,16 50,14 60,10 70,7 80,4"
          sparkColor="#a855f7"
        />
        <StatCard
          emoji="🟢" label="Active today" value="2,317" change="4.1%"
          sparkPoints="0,26 10,22 20,24 30,18 40,16 50,12 60,10 70,7 80,5"
          sparkColor="#10b981"
        />
        <StatCard
          emoji="💬" label="Total messages" value="1.24M" change="12.6%"
          sparkPoints="0,28 10,25 20,22 30,19 40,17 50,14 60,11 70,8 80,5"
          sparkColor="#ff6b35"
        />
        <StatCard
          emoji="⏱️" label="Avg. session" value="11m 36s" change="5.3%"
          sparkPoints="0,26 10,23 20,24 30,19 40,18 50,14 60,11 70,8 80,5"
          sparkColor="#60a5fa"
        />
      </div>

      {/* Row 2: Growth + Donut */}
      <div className="grid grid-cols-[1fr_300px] gap-4">
        {/* Growth chart */}
        <div className="bg-[#1b1f2b] rounded-2xl p-5 border border-[#252b3a]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[15px] font-semibold text-white">Growth & activity</p>
              <p className="text-[12px] text-[#636b82]">Last 14 days · Active users</p>
            </div>
            <div className="flex items-center gap-1 bg-[#13151d] rounded-xl p-1">
              {(['Active', 'signups', 'Messages'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-gradient-to-br from-[#ff6b35] to-[#e8503a] text-white'
                      : 'text-[#636b82] hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[200px]">
            <GrowthChart />
          </div>
          {/* X-axis labels */}
          <div className="flex justify-between mt-2 px-1">
            {['6/6', '6/9', '6/13', '6/16', '6/19'].map(d => (
              <span key={d} className="text-[10px] text-[#636b82]">{d}</span>
            ))}
          </div>
        </div>

        {/* Messages by channel donut */}
        <div className="bg-[#1b1f2b] rounded-2xl p-5 border border-[#252b3a]">
          <p className="text-[15px] font-semibold text-white">Messages by channel</p>
          <p className="text-[12px] text-[#636b82] mb-4">Share of total volume</p>
          <div className="flex flex-col items-center gap-4">
            <DonutChart />
            <div className="w-full space-y-1.5">
              {DONUT_SEGMENTS.map(seg => (
                <div key={seg.label} className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: seg.color }} />
                    <span className="text-[#c8cfe0] font-mono text-[11px]">{seg.label}</span>
                  </div>
                  <span className="text-white font-semibold">{seg.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Bar chart + Top channels */}
      <div className="grid grid-cols-2 gap-4">
        {/* Messages sent bar chart */}
        <div className="bg-[#1b1f2b] rounded-2xl p-5 border border-[#252b3a]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[15px] font-semibold text-white">Messages sent</p>
              <p className="text-[12px] text-[#636b82]">Per day · this week</p>
            </div>
            <span className="text-[11px] font-semibold text-white bg-[#10b981]/20 text-[#10b981] px-2 py-0.5 rounded-md">▲ 12.6%</span>
          </div>
          <BarChart />
        </div>

        {/* Top channels */}
        <div className="bg-[#1b1f2b] rounded-2xl p-5 border border-[#252b3a]">
          <p className="text-[15px] font-semibold text-white mb-4">Top channels</p>
          <div className="space-y-3">
            {TOP_CHANNELS.map(ch => (
              <div key={ch.name} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#13151d] flex items-center justify-center text-base flex-shrink-0">
                  {ch.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-medium text-white font-mono">{ch.name}</span>
                    <span className="text-[12px] text-[#636b82]">{ch.count}</span>
                  </div>
                  <div className="h-1 bg-[#252b3a] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#ff6b35] to-[#e8503a]"
                      style={{ width: `${ch.pct}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
