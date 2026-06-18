import { useState, useRef, type FormEvent, type KeyboardEvent } from 'react';
import { Paperclip, Smile, Send } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { chatWs } from '@/services/websocket';
import { filesApi } from '@/api/client';
import { cn } from '@/lib/utils';

export function MessageInput() {
  const [content, setContent] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const activeChat = useChatStore((s) => s.activeChat);
  const addMessage = useChatStore((s) => s.addMessage);
  const user = useAuthStore((s) => s.user);

  const placeholder =
    activeChat?.kind === 'room'
      ? `Message #${activeChat.roomId}`
      : 'Send a message...';

  function handleSend(attachmentUrl?: string) {
    const text = content.trim();
    if (!text && !attachmentUrl) return;
    if (!activeChat || !user) return;

    const now = new Date().toISOString();
    const key = activeChat.kind === 'room' ? activeChat.roomId : activeChat.userId;

    // Optimistic local message
    addMessage(key, {
      type: activeChat.kind === 'room' ? 'CHAT' : 'DIRECT',
      roomId: activeChat.kind === 'room' ? activeChat.roomId : undefined,
      recipientId: activeChat.kind === 'direct' ? activeChat.userId : undefined,
      senderId: user.id,
      senderName: user.displayName ?? user.username,
      content: text || undefined,
      attachmentUrl,
      timestamp: now,
      isOwn: true,
    });

    // Send over WS
    if (activeChat.kind === 'room') {
      chatWs.sendChat(activeChat.roomId, text, attachmentUrl);
    } else {
      chatWs.sendDirect(activeChat.userId, text, attachmentUrl);
    }

    setContent('');
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    handleSend();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const meta = await filesApi.upload(file);
      handleSend(meta.publicUrl);
    } catch {
      // silently ignore
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div className="px-4 pb-4 flex-shrink-0">
      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2 bg-[#1e2535] rounded-2xl border border-[#2e3850] px-4 py-3"
      >
        {/* File attach */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="p-1.5 text-gray-400 hover:text-orange-400 transition-colors flex-shrink-0"
        >
          <Paperclip size={18} className={uploading ? 'animate-pulse' : ''} />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*,.pdf,.doc,.docx,.txt"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Text area */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={false}
          rows={1}
          className={cn(
            'flex-1 bg-transparent text-white placeholder-gray-500 text-sm resize-none',
            'focus:outline-none max-h-32 leading-relaxed'
          )}
          style={{ height: 'auto' }}
          onInput={(e) => {
            const t = e.currentTarget;
            t.style.height = 'auto';
            t.style.height = `${t.scrollHeight}px`;
          }}
        />

        {/* Emoji */}
        <button
          type="button"
          className="p-1.5 text-gray-400 hover:text-yellow-400 transition-colors flex-shrink-0"
        >
          <Smile size={18} />
        </button>

        {/* Send */}
        <button
          type="submit"
          disabled={!content.trim() && !uploading}
          className={cn(
            'p-2 rounded-xl transition-all duration-150 flex-shrink-0',
            content.trim()
              ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30'
              : 'text-gray-600'
          )}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
