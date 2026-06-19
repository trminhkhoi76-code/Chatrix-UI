import { useState } from 'react';
import type { Period } from '@/pages/AdminPage';

// ─── Path generator (matches reference pathFor) ───────────────────────────────
function pathFor(vals: number[], w: number, h: number, padT: number, padB: number) {
  const min = Math.min(...vals), max = Math.max(...vals), span = (max - min) || 1;
  const n = vals.length;
  const X = (i: number) => n === 1 ? w / 2 : (i / (n - 1)) * w;
  const Y = (v: number) => h - padB - ((v - min) / span) * (h - padT - padB);
  const pts: [number, number][] = vals.map((v, i) => [X(i), Y(v)]);
  const line = 'M' + pts.map(p => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L');
  const area = line + ` L${w} ${h} L0 ${h} Z`;
  return { line, area, pts };
}

function dayLabel(i: number, n: number) {
  const d = new Date();
  d.setDate(d.getDate() - (n - 1 - i));
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const DATA = {
  signups:  [12,18,15,22,19,28,32,30,38,42,39,48,52,61],
  active:   [120,135,128,150,142,168,180,175,195,210,205,230,248,265],
  messages: [820,940,880,1100,1020,1280,1450,1390,1600,1720,1680,1900,2050,2240],
  session:  [8.2,8.5,8.1,9.0,8.7,9.4,9.8,9.6,10.2,10.5,10.3,11.0,11.2,11.6],
};
const WEEK = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const CHANNELS = [
  { name:'general', icon:'💬', count:'418k', color:'#FF6A3D', raw:38 },
  { name:'gaming',  icon:'🎮', count:'264k', color:'#7C5CFF', raw:24 },
  { name:'design',  icon:'🎨', count:'176k', color:'#21c197', raw:16 },
  { name:'music',   icon:'🎵', count:'132k', color:'#3D9DF6', raw:12 },
  { name:'random',  icon:'🎲', count:'110k', color:'#FFB13D', raw:10 },
];
const METRIC_MAP = {
  active:   { label: 'Active users', short: 'Active',  data: DATA.active,   fmt: (v: number) => v.toLocaleString() },
  signups:  { label: 'New signups',  short: 'Signups', data: DATA.signups,  fmt: (v: number) => v.toLocaleString() },
  messages: { label: 'Messages',     short: 'Messages',data: DATA.messages, fmt: (v: number) => v.toLocaleString() },
} as const;
type MetricKey = keyof typeof METRIC_MAP;

// ─── SparkArea ────────────────────────────────────────────────────────────────
function SparkArea({ vals, color }: { vals: number[]; color: string }) {
  const { line, area } = pathFor(vals, 120, 34, 4, 4);
  const id = `sp${color.replace('#','').slice(0,6)}`;
  return (
    <svg viewBox="0 0 120 34" width="100%" height="34" preserveAspectRatio="none" style={{ display:'block', marginTop:12 }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function DashboardView({ period: _period }: { period: Period }) {
  const [metric, setMetric] = useState<MetricKey>('active');
  const [chartHover, setChartHover] = useState<number | null>(null);
  const [barHover,   setBarHover]   = useState<number | null>(null);

  const cur = METRIC_MAP[metric];
  const CW = 720, CH = 240;
  const n = cur.data.length;
  const cp = pathFor(cur.data, CW, CH, 24, 28);
  const xlabelIdxs = [0, Math.floor(n/4), Math.floor(n/2), Math.floor(3*n/4), n-1];

  // Donut
  const CIRC = 2 * Math.PI * 48;
  let acc = 0;
  const donutSegs = CHANNELS.map(c => {
    const len = CIRC * c.raw / 100;
    const seg = { color: c.color, dash: `${len.toFixed(1)} ${(CIRC-len).toFixed(1)}`, offset: (-acc).toFixed(1) };
    acc += len;
    return { ...c, ...seg };
  });

  // Week bars
  const wk = DATA.messages.slice(-7);
  const wkMax = Math.max(...wk);

  const card: React.CSSProperties = {
    background: 'var(--panel-bg)', border: '1px solid var(--divider)',
    borderRadius: 18, padding: 18, boxShadow: 'var(--card-shadow)',
    transition: 'transform .18s, background .45s ease',
  };

  return (
    <div className="space-y-5">
      {/* ── KPI cards ── */}
      <div className="grid grid-cols-4 gap-4">
        {([
          { icon:'👥', iconBg:'color-mix(in srgb,#7C5CFF 16%,transparent)', value:'12,480',  label:'Total registered', trend:'▲ 8.2%',  data:DATA.signups,  color:'#7C5CFF' },
          { icon:'🟢', iconBg:'color-mix(in srgb,#21c197 16%,transparent)', value:'2,317',   label:'Active today',     trend:'▲ 4.1%',  data:DATA.active,   color:'#21c197' },
          { icon:'💬', iconBg:'color-mix(in srgb,#ff6b35 16%,transparent)', value:'1.24M',   label:'Total messages',   trend:'▲ 12.6%', data:DATA.messages, color:'#ff6b35' },
          { icon:'⏱️', iconBg:'color-mix(in srgb,#3D9DF6 16%,transparent)', value:'11m 36s', label:'Avg. session',     trend:'▲ 5.3%',  data:DATA.session,  color:'#3D9DF6' },
        ] as const).map((k, i) => (
          <div
            key={k.label}
            className="animate-float-in"
            style={{ ...card, animationDelay:`${i*80}ms`, cursor:'default' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; }}
          >
            <div className="flex items-start justify-between mb-3.5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[19px]" style={{ background: k.iconBg }}>{k.icon}</div>
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-lg" style={{ color:'#21c197', background:'color-mix(in srgb,#21c197 14%,transparent)' }}>{k.trend}</span>
            </div>
            <p className="text-[27px] font-extrabold leading-none tracking-tight animate-count-up" style={{ color:'var(--text)' }}>{k.value}</p>
            <p className="text-[12.5px] mt-0.5 font-semibold" style={{ color:'var(--muted)' }}>{k.label}</p>
            <SparkArea vals={k.data as unknown as number[]} color={k.color} />
          </div>
        ))}
      </div>

      {/* ── Row 2: Growth chart + Donut ── */}
      <div className="grid gap-4" style={{ gridTemplateColumns: '1.62fr 1fr' }}>

        {/* Growth chart */}
        <div style={card}>
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <div>
              <p className="text-[16px] font-extrabold" style={{ color:'var(--text)' }}>Growth &amp; activity</p>
              <p className="text-[12.5px] font-semibold" style={{ color:'var(--muted)' }}>Last 14 days · {cur.label}</p>
            </div>
            <div className="flex gap-[3px] rounded-[11px] p-[3px]" style={{ background:'var(--input-bg)', border:'1px solid var(--input-border)' }}>
              {(Object.keys(METRIC_MAP) as MetricKey[]).map(k => (
                <button
                  key={k}
                  onClick={() => setMetric(k)}
                  className="px-3 py-1.5 rounded-[9px] text-[12px] font-bold transition-all duration-150 border-0 cursor-pointer"
                  style={{
                    background: metric===k ? 'linear-gradient(135deg,#ff9a52,#ff6b35)' : 'transparent',
                    color:      metric===k ? '#fff' : 'var(--muted)',
                  }}
                >{METRIC_MAP[k].short}</button>
              ))}
            </div>
          </div>

          <div className="relative mt-2.5">
            <svg viewBox={`0 0 ${CW} ${CH}`} width="100%" height={240} preserveAspectRatio="none" style={{ display:'block', overflow:'visible' }}>
              {[0,1,2,3].map(i => {
                const y = (24 + (i/3)*(CH-24-28)).toFixed(1);
                return <line key={i} x1="0" y1={y} x2={CW} y2={y} stroke="var(--divider)" strokeWidth="1" />;
              })}
              <path d={cp.area} fill="#ff6b35" opacity="0.12" />
              <path d={cp.line} fill="none" stroke="#ff6b35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {chartHover != null && (() => {
                const [hx, hy] = cp.pts[chartHover];
                return (
                  <>
                    <line x1={hx} y1="0" x2={hx} y2={CH} stroke="#ff6b35" strokeWidth="1.4" strokeDasharray="4 4" opacity=".55" />
                    <circle cx={hx} cy={hy} r="6" fill="#ff6b35" stroke="var(--panel-bg)" strokeWidth="3" />
                  </>
                );
              })()}
            </svg>
            {chartHover != null && (
              <div
                className="absolute pointer-events-none rounded-[11px] px-[11px] py-[7px] z-10"
                style={{
                  top: -6,
                  left: `${(cp.pts[chartHover][0] / CW * 100).toFixed(2)}%`,
                  transform: 'translateX(-50%)',
                  background: 'var(--panel-bg)', border: '1px solid var(--divider)',
                  boxShadow: 'var(--card-shadow)', whiteSpace: 'nowrap',
                }}
              >
                <p className="text-[14px] font-extrabold" style={{ color:'var(--text)' }}>{cur.fmt(cur.data[chartHover])}</p>
                <p className="text-[11px] font-semibold" style={{ color:'var(--muted)' }}>{dayLabel(chartHover, n)}</p>
              </div>
            )}
            <div className="absolute inset-0 flex">
              {cur.data.map((_, i) => (
                <div key={i} className="flex-1 cursor-pointer" onMouseEnter={() => setChartHover(i)} onMouseLeave={() => setChartHover(null)} />
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-2 px-0.5">
            {xlabelIdxs.map(i => (
              <span key={i} className="text-[11px] font-semibold" style={{ color:'var(--faint)' }}>{dayLabel(i, n)}</span>
            ))}
          </div>
        </div>

        {/* Donut */}
        <div style={card}>
          <p className="text-[16px] font-extrabold" style={{ color:'var(--text)' }}>Messages by channel</p>
          <p className="text-[12.5px] font-semibold mb-2" style={{ color:'var(--muted)' }}>Share of total volume</p>
          <div className="flex items-center gap-[18px] mt-2.5">
            <div className="relative flex-none" style={{ width:148, height:148 }}>
              <svg viewBox="0 0 120 120" width="148" height="148" style={{ transform:'rotate(-90deg)', display:'block' }}>
                <circle cx="60" cy="60" r="48" fill="none" stroke="var(--input-bg)" strokeWidth="16" />
                {donutSegs.map(seg => (
                  <circle key={seg.name} cx="60" cy="60" r="48" fill="none"
                    stroke={seg.color} strokeWidth="16" strokeLinecap="round"
                    strokeDasharray={seg.dash} strokeDashoffset={seg.offset} />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-[22px] font-extrabold" style={{ color:'var(--text)' }}>1.24M</p>
                <p className="text-[10.5px] font-semibold" style={{ color:'var(--muted)' }}>total msgs</p>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-[9px]">
              {donutSegs.map(seg => (
                <div key={seg.name} className="flex items-center gap-[9px]">
                  <span className="w-2.5 h-2.5 rounded-[4px] flex-none" style={{ background:seg.color }} />
                  <span className="flex-1 text-[13px] font-bold" style={{ color:'var(--text)' }}>#{seg.name}</span>
                  <span className="text-[13px] font-bold" style={{ color:'var(--muted)' }}>{seg.raw}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 3: Bar chart + Top channels ── */}
      <div className="grid grid-cols-2 gap-4">

        {/* Messages bar */}
        <div style={card}>
          <div className="flex items-start justify-between mb-3.5">
            <div>
              <p className="text-[16px] font-extrabold" style={{ color:'var(--text)' }}>Messages sent</p>
              <p className="text-[12.5px] font-semibold" style={{ color:'var(--muted)' }}>Per day · this week</p>
            </div>
            <span className="text-[13px] font-extrabold px-2.5 py-1 rounded-[9px]" style={{ color:'#21c197', background:'color-mix(in srgb,#21c197 15%,transparent)' }}>▲ 12.6%</span>
          </div>
          <div className="flex items-end gap-[10px]" style={{ height:150 }}>
            {wk.map((v, i) => {
              const h = (18 + (v/wkMax)*82).toFixed(0);
              const isLast = i === wk.length - 1;
              const hovered = barHover === i;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-[7px] h-full justify-end cursor-pointer"
                  onMouseEnter={() => setBarHover(i)} onMouseLeave={() => setBarHover(null)}>
                  {hovered && <span className="text-[11.5px] font-extrabold -mb-0.5" style={{ color:'var(--text)' }}>{v.toLocaleString()}</span>}
                  <div
                    className="w-[70%] rounded-t-lg rounded-b-sm animate-grow-bar"
                    style={{
                      height:`${h}%`, minHeight:4,
                      background: isLast ? 'linear-gradient(to top,#e8503a,#ff9a52)' : 'color-mix(in srgb,#ff6b35 38%,transparent)',
                      filter: hovered ? 'brightness(1.12)' : 'none', transition:'filter .15s',
                    }}
                  />
                  <span className="text-[11px] font-semibold" style={{ color:'var(--faint)' }}>{WEEK[i]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top channels */}
        <div style={card}>
          <p className="text-[16px] font-extrabold mb-3.5" style={{ color:'var(--text)' }}>Top channels</p>
          <div className="flex flex-col gap-[13px]">
            {CHANNELS.map(ch => (
              <div key={ch.name} className="flex items-center gap-3">
                <div className="w-[38px] h-[38px] rounded-[11px] flex items-center justify-center text-[18px] flex-none" style={{ background:'var(--input-bg)' }}>{ch.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-[5px]">
                    <span className="text-[13.5px] font-bold" style={{ color:'var(--text)' }}>#{ch.name}</span>
                    <span className="text-[12.5px] font-bold" style={{ color:'var(--muted)' }}>{ch.count}</span>
                  </div>
                  <div className="rounded-[6px] overflow-hidden" style={{ height:7, background:'var(--input-bg)' }}>
                    <div className="h-full rounded-[6px]"
                      style={{ width:`${(ch.raw/38*100).toFixed(0)}%`, background:'linear-gradient(90deg,#ff9a52,#ff6b35)', transition:'width .6s ease' }} />
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
