import { useEffect, useRef } from 'react';
import { useChatStore } from '@/store/chatStore';
import { MessageBubble } from './MessageBubble';
import { formatDate } from '@/lib/utils';
import type { ChatMessage } from '@/types';
import { Hash } from 'lucide-react';

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
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a channel to start chatting
      </div>
    );
  }

  const roomName =
    activeChat.kind === 'room'
      ? rooms.find((r) => r.id === activeChat.roomId)?.name ?? activeChat.roomId
      : null;

  return (
    <div className="flex-1 overflow-y-auto flex flex-col py-4">
      {/* Channel welcome */}
      {msgs.length === 0 && (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center px-8">
          <div className="w-16 h-16 rounded-full bg-[#252d3d] flex items-center justify-center">
            <Hash size={28} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Welcome to #{roomName ?? 'chat'}!</h3>
          <p className="text-gray-400 text-sm max-w-sm">
            This is the beginning of the <strong>#{roomName ?? 'chat'}</strong> channel. Say hi!
          </p>
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
              <div className="flex items-center gap-3 px-4 my-3">
                <div className="flex-1 h-px bg-[#252d3d]" />
                <span className="text-xs text-gray-500 font-medium">{formatDate(msg.timestamp)}</span>
                <div className="flex-1 h-px bg-[#252d3d]" />
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
