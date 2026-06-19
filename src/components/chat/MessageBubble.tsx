import { Avatar } from '@/components/ui/Avatar';
import { cn, formatTime } from '@/lib/utils';
import type { ChatMessage } from '@/types';

interface MessageBubbleProps {
  message: ChatMessage;
  showSender?: boolean;
}

function ReactionBadge({ emoji, count, reacted }: { emoji: string; count: number; reacted?: boolean }) {
  return (
    <button
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-all duration-150',
        'hover:scale-105 active:scale-95',
        reacted
          ? 'bg-[#ff6b35]/20 border border-[#ff6b35]/40 text-[#ff8c5a]'
          : 'bg-[#1e2333] border border-[#252b3a] text-[#9ba3b8] hover:border-[#3d4660]'
      )}
    >
      <span>{emoji}</span>
      <span>{count}</span>
    </button>
  );
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
              : 'bg-[#252b3a] text-[#636b82]'
          )}
        >
          {message.content}
        </span>
      </div>
    );
  }

  if (isOwn) {
    return (
      <div className="flex justify-end gap-2 group px-4 py-0.5 msg-enter">
        <div className="flex flex-col items-end gap-1 max-w-[70%]">
          {showSender && (
            <div className="flex items-center gap-2 px-1">
              <span className="text-xs" style={{ color: 'var(--muted)' }}>
                {formatTime(message.timestamp)}
              </span>
              <span className="text-xs font-semibold text-[#ff8c5a]">You</span>
            </div>
          )}
          <div
            className={cn(
              'px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm text-white shadow-lg shadow-[#ff6b35]/10',
              'bg-gradient-to-br from-[#ff6b35] to-[#e8503a]',
              'hover:shadow-[#ff6b35]/20 transition-shadow duration-200'
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
          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex gap-1 flex-wrap mt-0.5">
              {message.reactions.map((r) => (
                <ReactionBadge key={r.emoji} {...r} />
              ))}
            </div>
          )}
          {!showSender && (
            <span className="text-[11px] text-[#636b82] opacity-0 group-hover:opacity-100 transition-opacity px-1">
              {formatTime(message.timestamp)}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Other user's message
  return (
    <div className="flex gap-3 group px-4 py-0.5 msg-enter">
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
            <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{message.senderName ?? 'Unknown'}</span>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>{formatTime(message.timestamp)}</span>
          </div>
        )}
        <div className="flex items-end gap-2">
          <div
            className="px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm shadow-md transition-colors duration-150"
            style={{
              background: 'var(--bubble-other-bg)',
              color: 'var(--bubble-other-text)',
              border: '1px solid var(--divider)',
              boxShadow: 'var(--card-shadow)',
            }}
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
          {!showSender && (
            <span className="text-[11px] opacity-0 group-hover:opacity-100 transition-opacity self-end mb-1" style={{ color: 'var(--muted)' }}>
              {formatTime(message.timestamp)}
            </span>
          )}
        </div>
        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex gap-1 flex-wrap mt-0.5">
            {message.reactions.map((r) => (
              <ReactionBadge key={r.emoji} {...r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

