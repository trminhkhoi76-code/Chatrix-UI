import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const CHANNELS_DATA = [
  { emoji: '💬', name: 'general', members: 3241, messages: '418k', lastActive: '2 min ago', status: 'Active' },
  { emoji: '💡', name: 'ideas', members: 2100, messages: '120k', lastActive: '8 min ago', status: 'Active' },
  { emoji: '🎨', name: 'design', members: 1840, messages: '176k', lastActive: '14 min ago', status: 'Active' },
  { emoji: '🎮', name: 'gaming', members: 2410, messages: '264k', lastActive: '1 min ago', status: 'Active' },
  { emoji: '🎵', name: 'music', members: 1620, messages: '132k', lastActive: '32 min ago', status: 'Active' },
  { emoji: '🎲', name: 'random', members: 1290, messages: '110k', lastActive: '1 hr ago', status: 'Active' },
  { emoji: '📁', name: 'archive', members: 890, messages: '45k', lastActive: '3 days ago', status: 'Archived' },
];

export default function ChannelsView() {
  const [channels, setChannels] = useState(CHANNELS_DATA);

  return (
    <div className="space-y-5">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#1b1f2b] rounded-2xl p-5 border border-[#252b3a]">
          <p className="text-[12px] text-[#636b82] mb-2">Total channels</p>
          <p className="text-[28px] font-bold text-white leading-none">{channels.length}</p>
        </div>
        <div className="bg-[#1b1f2b] rounded-2xl p-5 border border-[#252b3a]">
          <p className="text-[12px] text-[#636b82] mb-2">Total messages</p>
          <p className="text-[28px] font-bold text-white leading-none">1.26M</p>
        </div>
        <div className="bg-[#1b1f2b] rounded-2xl p-5 border border-[#252b3a]">
          <p className="text-[12px] text-[#636b82] mb-2">Active members</p>
          <p className="text-[28px] font-bold text-white leading-none">13,391</p>
        </div>
      </div>

      {/* Channels table */}
      <div className="bg-[#1b1f2b] rounded-2xl border border-[#252b3a] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#252b3a]">
          <p className="text-[15px] font-semibold text-white">All channels</p>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-br from-[#ff6b35] to-[#e8503a] text-white text-[12px] font-semibold hover:opacity-90 transition-opacity shadow-md shadow-[#ff6b35]/20">
            <Plus size={13} />
            New channel
          </button>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1.5fr_1fr_80px] px-5 py-3 border-b border-[#252b3a]">
          {['CHANNEL', 'MEMBERS', 'MESSAGES', 'LAST ACTIVE', 'STATUS', ''].map((col, i) => (
            <span key={i} className="text-[10px] font-semibold text-[#636b82] tracking-wider">{col}</span>
          ))}
        </div>

        <div className="divide-y divide-[#252b3a]/60">
          {channels.map((ch, i) => (
            <div
              key={ch.name}
              className="grid grid-cols-[2fr_1fr_1fr_1.5fr_1fr_80px] items-center px-5 py-3.5 hover:bg-white/[0.02] transition-colors group animate-fade-in"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {/* Channel */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#13151d] flex items-center justify-center text-base flex-shrink-0">
                  {ch.emoji}
                </div>
                <span className="text-[13px] font-semibold text-white font-mono">#{ch.name}</span>
              </div>
              {/* Members */}
              <span className="text-[13px] text-white">{ch.members.toLocaleString()}</span>
              {/* Messages */}
              <span className="text-[13px] text-white">{ch.messages}</span>
              {/* Last active */}
              <span className="text-[12px] text-[#8891a8]">{ch.lastActive}</span>
              {/* Status */}
              <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full w-fit ${
                ch.status === 'Active'
                  ? 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/20'
                  : 'bg-[#636b82]/15 text-[#636b82] border border-[#636b82]/20'
              }`}>
                {ch.status}
              </span>
              {/* Actions */}
              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-7 h-7 rounded-lg bg-[#252b3a] flex items-center justify-center text-[#636b82] hover:text-white transition-colors">
                  <Pencil size={12} />
                </button>
                <button
                  onClick={() => setChannels(prev => prev.filter(c => c.name !== ch.name))}
                  className="w-7 h-7 rounded-lg bg-[#252b3a] flex items-center justify-center text-[#636b82] hover:text-[#ef4444] transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
