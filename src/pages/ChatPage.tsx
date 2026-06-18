import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { chatWs } from '@/services/websocket';
import { useChatStore } from '@/store/chatStore';
import { ServerSidebar } from '@/components/layout/ServerSidebar';
import { ChannelSidebar } from '@/components/layout/ChannelSidebar';
import { MembersSidebar } from '@/components/layout/MembersSidebar';
import { ChatHeader } from '@/components/layout/ChatHeader';
import { MessageList } from '@/components/chat/MessageList';
import { MessageInput } from '@/components/chat/MessageInput';

export default function ChatPage() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const rooms = useChatStore((s) => s.rooms);
  const [activeServerId, setActiveServerId] = useState('main');

  // Connect WebSocket on mount
  useEffect(() => {
    if (!accessToken) return;
    chatWs.connect(accessToken);

    return () => {
      chatWs.disconnect();
    };
  }, [accessToken]);

  // Join all rooms once connected
  useEffect(() => {
    const interval = setInterval(() => {
      if (chatWs.isConnected) {
        rooms.forEach((r) => chatWs.joinRoom(r.id));
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-screen flex overflow-hidden bg-[#0f1117]">
      {/* Left: Server icons */}
      <ServerSidebar activeServerId={activeServerId} onSelect={setActiveServerId} />

      {/* Channel list */}
      <ChannelSidebar />

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#1a2030]">
        <ChatHeader />
        <MessageList />
        <MessageInput />
      </div>

      {/* Right: Members */}
      <MembersSidebar />
    </div>
  );
}
