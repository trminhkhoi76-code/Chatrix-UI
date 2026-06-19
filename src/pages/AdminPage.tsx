import { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import DashboardView from '@/components/admin/DashboardView';
import MembersView from '@/components/admin/MembersView';
import ReportsView from '@/components/admin/ReportsView';
import ChannelsView from '@/components/admin/ChannelsView';
import SettingsView from '@/components/admin/SettingsView';

export type AdminView = 'dashboard' | 'members' | 'reports' | 'channels' | 'settings';
export type Period = '7d' | '14d' | '30d';

const VIEW_META: Record<AdminView, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Realtime overview of your community' },
  members:   { title: 'Members',   subtitle: 'Manage everyone in Chatrix' },
  reports:   { title: 'Reports',   subtitle: 'Deep-dive analytics & trends' },
  channels:  { title: 'Channels',  subtitle: 'Organize text & voice spaces' },
  settings:  { title: 'Settings',  subtitle: 'Configure your community' },
};

export default function AdminPage() {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [period, setPeriod] = useState<Period>('14d');
  const meta = VIEW_META[activeView];

  return (
    <div className="flex h-screen bg-[#13151d] text-white overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <AdminSidebar activeView={activeView} onNavigate={setActiveView} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title={meta.title} subtitle={meta.subtitle} period={period} onPeriodChange={setPeriod} />
        <div className="flex-1 overflow-y-auto p-6">
          {activeView === 'dashboard' && <DashboardView period={period} />}
          {activeView === 'members'   && <MembersView />}
          {activeView === 'reports'   && <ReportsView />}
          {activeView === 'channels'  && <ChannelsView />}
          {activeView === 'settings'  && <SettingsView />}
        </div>
      </div>
    </div>
  );
}
