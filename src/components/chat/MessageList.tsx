import { useEffect, useRef } from 'react';
import { useChatStore } from '@/store/chatStore';
import { MessageBubble } from './MessageBubble';
import { formatDate } from '@/lib/utils';
import type { ChatMessage } from '@/types';

export function MessageList() {
  const activeChat = useChatStore((s) => s.activeChat);
  const messages = useChatStore((s) => s.messages);
  const rooms = useChatStore((s) => s.rooms);

  const bottomRef = useRef<HTMLDivElement>(null);

  const chatKey = activeChat
    ? activeChat.kind === 'room'
      ? activeChat.roomId
      : activeChat.userId
    : null;

  const msgs: ChatMessage[] = chatKey ? (messages[chatKey] ?? []) : [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs.length]);

  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center text-[#636b82] text-sm">
        Select a channel to start chatting
      </div>
    );
  }

  const roomName =
    activeChat.kind === 'room'
      ? rooms.find((r) => r.id === activeChat.roomId)?.name ?? activeChat.roomId
      : null;

  return (
    <div className="flex-1 overflow-y-auto flex flex-col py-4" style={{ background: 'var(--chat-bg)', transition: 'background .45s ease' }}>
      {/* Channel welcome */}
      {msgs.length === 0 && (
        <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center px-8 animate-float-in">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff6b35]/20 to-[#a855f7]/20 border border-[#ff6b35]/20 flex items-center justify-center text-3xl animate-bob">
            💬
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text)' }}>Welcome to #{roomName ?? 'chat'}!</h3>
            <p className="text-sm max-w-sm" style={{ color: 'var(--muted)' }}>
              This is the beginning of the <strong style={{ color: 'var(--muted)' }}>#{roomName ?? 'chat'}</strong> channel. Say hi!
            </p>
          </div>
        </div>
      )}

      {/* Messages grouped by date */}
      {msgs.map((msg, i) => {
        const prev = msgs[i - 1];
        const showDate =
          i === 0 ||
          formatDate(msg.timestamp) !== formatDate(prev?.timestamp);
        const showSender =
          showDate ||
          msg.senderId !== prev?.senderId ||
          msg.type === 'SYSTEM' ||
          msg.type === 'ERROR';

        return (
          <div key={msg.id ?? i}>
            {showDate && msg.timestamp && (
              <div className="flex items-center gap-3 px-6 my-4">
                <div className="flex-1 h-px" style={{ background: 'var(--divider)' }} />
                <span
                  className="text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
                  style={{ color: 'var(--faint)', background: 'var(--panel-bg)', border: '1px solid var(--divider)' }}
                >
                  {formatDate(msg.timestamp)}
                </span>
                <div className="flex-1 h-px" style={{ background: 'var(--divider)' }} />
              </div>
            )}
            <MessageBubble message={msg} showSender={showSender} />
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}

