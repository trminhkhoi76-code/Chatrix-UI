import { Avatar } from '@/components/ui/Avatar';
import { cn, formatTime } from '@/lib/utils';
import type { ChatMessage } from '@/types';

interface MessageBubbleProps {
  message: ChatMessage;
  showSender?: boolean;
}

export function MessageBubble({ message, showSender = true }: MessageBubbleProps) {
  const isOwn = message.isOwn;
  const isSystem = message.type === 'SYSTEM' || message.type === 'ERROR';

  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <span
          className={cn(
            'text-xs px-3 py-1 rounded-full',
            message.type === 'ERROR'
              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
              : 'bg-[#252d3d] text-gray-400'
          )}
        >
          {message.content}
        </span>
      </div>
    );
  }

  if (isOwn) {
    return (
      <div className="flex justify-end gap-2 group px-4 py-1">
        <div className="flex flex-col items-end gap-1 max-w-[70%]">
          {showSender && (
            <span className="text-xs text-gray-500 px-1">You</span>
          )}
          <div className="flex items-end gap-2">
            <span className="text-[11px] text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity self-end mb-1">
              {formatTime(message.timestamp)}
            </span>
            <div
              className={cn(
                'px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm text-white shadow-md',
                'bg-gradient-to-br from-orange-500 to-orange-600'
              )}
            >
              {message.attachmentUrl && (
                <img
                  src={message.attachmentUrl}
                  alt="attachment"
                  className="max-w-xs rounded-lg mb-2"
                />
              )}
              {message.content}
            </div>
          </div>
        </div>
        <div className="w-9 flex-shrink-0" />
      </div>
    );
  }

  // Other user's message
  return (
    <div className="flex gap-3 group px-4 py-1">
      <div className="flex-shrink-0 mt-1">
        {showSender ? (
          <Avatar name={message.senderName ?? 'U'} size="md" />
        ) : (
          <div className="w-9" />
        )}
      </div>
      <div className="flex flex-col gap-1 max-w-[70%]">
        {showSender && (
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-white">{message.senderName ?? 'Unknown'}</span>
            <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
          </div>
        )}
        <div className="flex items-end gap-2">
          <div
            className={cn(
              'px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm text-white shadow-md',
              'bg-[#1e2535] border border-[#252d3d]'
            )}
          >
            {message.attachmentUrl && (
              <img
                src={message.attachmentUrl}
                alt="attachment"
                className="max-w-xs rounded-lg mb-2"
              />
            )}
            {message.content}
          </div>
          <span className="text-[11px] text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity self-end mb-1">
            {!showSender && formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
}
