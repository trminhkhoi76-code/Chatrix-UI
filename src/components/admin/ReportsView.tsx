// ─── Line chart helper ────────────────────────────────────────────────────────
function LineChart({
  points, color, viewBox = '0 0 480 150',
}: {
  points: [number, number][];
  color: string;
  viewBox?: string;
}) {
  const pts = points.map(([x, y]) => `${x},${y}`).join(' ');
  const areaPath = `M 0 150 L ${points.map(([x, y]) => `${x} ${y}`).join(' L ')} L 480 150 Z`;
  const gradId = `lc-${color.replace('#', '')}`;
  return (
    <svg viewBox={viewBox} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={points[points.length - 1][0]} cy={points[points.length - 1][1]} r="4" fill={color} />
      <circle cx={points[points.length - 1][0]} cy={points[points.length - 1][1]} r="7" fill={color} fillOpacity="0.2" />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const REG_PTS: [number, number][] = [
  [0, 132], [37, 118], [74, 126], [111, 109], [148, 95],
  [185, 104], [222, 86], [259, 72], [296, 80], [333, 61],
  [370, 46], [407, 33], [443, 19], [480, 8],
];

const SESSION_PTS: [number, number][] = [
  [0, 128], [37, 114], [74, 120], [111, 104], [148, 90],
  [185, 98], [222, 81], [259, 67], [296, 76], [333, 57],
  [370, 42], [407, 28], [443, 15], [480, 6],
];

const ACTIVE_BARS = [35, 42, 38, 48, 55, 52, 62, 70, 65, 75, 82, 88, 90, 95];

const DATES = ['6/6', '6/8', '6/10', '6/12', '6/14', '6/16', '6/19'];

const KEY_METRICS = [
  { emoji: '📈', label: 'Retention (30d)', value: '68.4%', change: '▲ 2.1%', up: true },
  { emoji: '🔁', label: 'Messages / user', value: '99.3', change: '▲ 6.0%', up: true },
  { emoji: '🕒', label: 'Peak hour', value: '9–10pm', change: 'JST', up: null },
  { emoji: '🌍', label: 'Countries', value: '42', change: '▲ 3', up: true },
  { emoji: '⚡', label: 'Avg. response', value: '1m 12s', change: '▼ 8s', up: false },
];

// ─── Reports View ─────────────────────────────────────────────────────────────
export default function ReportsView() {
  return (
    <div className="space-y-5">
      {/* Row 1: two line charts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#1b1f2b] rounded-2xl p-5 border border-[#252b3a]">
          <p className="text-[15px] font-semibold text-white">New registrations</p>
          <p className="text-[12px] text-[#636b82] mb-4">Daily signups · 14 days</p>
          <div className="h-[180px]">
            <LineChart points={REG_PTS} color="#a855f7" />
          </div>
          <div className="flex justify-between mt-2 px-1">
            {DATES.map(d => (
              <span key={d} className="text-[10px] text-[#636b82]">{d}</span>
            ))}
          </div>
        </div>

        <div className="bg-[#1b1f2b] rounded-2xl p-5 border border-[#252b3a]">
          <p className="text-[15px] font-semibold text-white">Avg. session time</p>
          <p className="text-[12px] text-[#636b82] mb-4">Minutes per active user · 14 days</p>
          <div className="h-[180px]">
            <LineChart points={SESSION_PTS} color="#10b981" />
          </div>
          <div className="flex justify-between mt-2 px-1">
            {DATES.map(d => (
              <span key={d} className="text-[10px] text-[#636b82]">{d}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: bar chart + key metrics */}
      <div className="grid grid-cols-2 gap-4">
        {/* Active users bar */}
        <div className="bg-[#1b1f2b] rounded-2xl p-5 border border-[#252b3a]">
          <p className="text-[15px] font-semibold text-white">Active users</p>
          <p className="text-[12px] text-[#636b82] mb-4">Daily active · 14 days</p>
          <div className="flex items-end gap-1.5 h-[160px]">
            {ACTIVE_BARS.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-md bg-gradient-to-t from-[#e8503a]/70 to-[#ff9a52]/80 hover:from-[#e8503a] hover:to-[#ff9a52] transition-colors"
                style={{ height: `${h}%`, minHeight: 4 }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {DATES.map(d => (
              <span key={d} className="text-[10px] text-[#636b82]">{d}</span>
            ))}
          </div>
        </div>

        {/* Key metrics */}
        <div className="bg-[#1b1f2b] rounded-2xl p-5 border border-[#252b3a]">
          <p className="text-[15px] font-semibold text-white mb-4">Key metrics</p>
          <div className="space-y-3">
            {KEY_METRICS.map(m => (
              <div key={m.label} className="flex items-center gap-3 py-2 px-3 rounded-xl bg-[#13151d] border border-[#252b3a]">
                <span className="text-lg w-7 flex-shrink-0">{m.emoji}</span>
                <span className="flex-1 text-[13px] text-[#c8cfe0]">{m.label}</span>
                <span className="text-[14px] font-bold text-white">{m.value}</span>
                <span className={`text-[11px] font-semibold ml-1 ${
                  m.up === true ? 'text-[#10b981]' : m.up === false ? 'text-[#ef4444]' : 'text-[#636b82]'
                }`}>
                  {m.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
