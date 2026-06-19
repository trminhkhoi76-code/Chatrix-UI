import { useState } from 'react';

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 flex-shrink-0 ${
        on ? 'bg-gradient-to-r from-[#ff6b35] to-[#e8503a]' : 'bg-[#252b3a]'
      }`}
      style={{ height: 22, width: 40 }}
    >
      <span
        className={`absolute top-0.5 w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform duration-200 ${
          on ? 'translate-x-[19px]' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

export default function SettingsView() {
  const [settings, setSettings] = useState({
    publicCommunity: true,
    allowInvites: true,
    requireApproval: false,
    emailNotify: true,
    mentionNotify: true,
    digestEmail: false,
    showActivity: true,
    twoFactor: false,
  });

  const toggle = (key: keyof typeof settings) =>
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="max-w-2xl space-y-5">
      {/* Community */}
      <div className="bg-[#1b1f2b] rounded-2xl p-5 border border-[#252b3a]">
        <p className="text-[15px] font-semibold text-white mb-1">Community</p>
        <p className="text-[12px] text-[#636b82] mb-5">General settings for your Chatrix community</p>

        <div className="space-y-4">
          <div>
            <label className="block text-[12px] font-medium text-[#c8cfe0] mb-1.5">Community name</label>
            <input
              defaultValue="Chatrix"
              className="w-full bg-[#13151d] border border-[#252b3a] rounded-xl px-3 py-2.5 text-[13px] text-white outline-none focus:border-[#ff6b35]/40 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[#c8cfe0] mb-1.5">Description</label>
            <textarea
              defaultValue="A community for creators, gamers, and designers."
              rows={3}
              className="w-full bg-[#13151d] border border-[#252b3a] rounded-xl px-3 py-2.5 text-[13px] text-white outline-none focus:border-[#ff6b35]/40 transition-colors resize-none"
            />
          </div>
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-[13px] font-medium text-white">Public community</p>
              <p className="text-[11px] text-[#636b82]">Anyone can discover and join</p>
            </div>
            <Toggle on={settings.publicCommunity} onChange={() => toggle('publicCommunity')} />
          </div>
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-[13px] font-medium text-white">Allow invites</p>
              <p className="text-[11px] text-[#636b82]">Members can invite others</p>
            </div>
            <Toggle on={settings.allowInvites} onChange={() => toggle('allowInvites')} />
          </div>
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-[13px] font-medium text-white">Require approval</p>
              <p className="text-[11px] text-[#636b82]">New members need admin approval</p>
            </div>
            <Toggle on={settings.requireApproval} onChange={() => toggle('requireApproval')} />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-[#1b1f2b] rounded-2xl p-5 border border-[#252b3a]">
        <p className="text-[15px] font-semibold text-white mb-1">Notifications</p>
        <p className="text-[12px] text-[#636b82] mb-5">Configure admin notification preferences</p>

        <div className="space-y-4">
          {[
            { key: 'emailNotify', label: 'Email notifications', sub: 'Receive alerts via email' },
            { key: 'mentionNotify', label: 'Mention alerts', sub: 'Notify when admins are mentioned' },
            { key: 'digestEmail', label: 'Weekly digest', sub: 'Summary email every Monday' },
            { key: 'showActivity', label: 'Activity feed', sub: 'Show real-time activity in sidebar' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between py-1">
              <div>
                <p className="text-[13px] font-medium text-white">{item.label}</p>
                <p className="text-[11px] text-[#636b82]">{item.sub}</p>
              </div>
              <Toggle on={settings[item.key as keyof typeof settings] as boolean} onChange={() => toggle(item.key as keyof typeof settings)} />
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-[#1b1f2b] rounded-2xl p-5 border border-[#252b3a]">
        <p className="text-[15px] font-semibold text-white mb-1">Security</p>
        <p className="text-[12px] text-[#636b82] mb-5">Account and access security</p>
        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-[13px] font-medium text-white">Two-factor authentication</p>
            <p className="text-[11px] text-[#636b82]">Require 2FA for all admin accounts</p>
          </div>
          <Toggle on={settings.twoFactor} onChange={() => toggle('twoFactor')} />
        </div>
        <div className="mt-4">
          <button className="px-4 py-2 rounded-xl bg-gradient-to-br from-[#ff6b35] to-[#e8503a] text-white text-[13px] font-semibold hover:opacity-90 transition-opacity shadow-md shadow-[#ff6b35]/20">
            Save changes
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-[#1b1f2b] rounded-2xl p-5 border border-[#ef4444]/20">
        <p className="text-[15px] font-semibold text-[#ef4444] mb-1">Danger zone</p>
        <p className="text-[12px] text-[#636b82] mb-4">Irreversible and destructive actions</p>
        <button className="px-4 py-2 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#ef4444] text-[13px] font-semibold hover:bg-[#ef4444]/20 transition-colors">
          Delete community
        </button>
      </div>
    </div>
  );
}
