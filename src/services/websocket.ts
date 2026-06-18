import type { ChatMessage, MessageType } from '@/types';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { nanoid } from '@/store/nanoid';

// Use relative WS path through Vite proxy so the Origin header matches the backend's allowed origins.
// If VITE_WS_URL is set explicitly (e.g. in production), use it directly.
const WS_BASE =
  import.meta.env.VITE_WS_URL ||
  window.location.origin.replace(/^http/, 'ws');
const PING_INTERVAL_MS = 30_000;

/** Decode JWT payload (no verification — just check exp client-side) */
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

class ChatrixWebSocket {
  private ws: WebSocket | null = null;
  private pingTimer: ReturnType<typeof setInterval> | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private maxReconnects = 10;

  connect(token: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return;

    // Don't attempt if token is already expired
    if (isTokenExpired(token)) {
      console.warn('[WS] Token expired — skipping WS connect');
      return;
    }

    const url = `${WS_BASE}/ws/chat?token=${encodeURIComponent(token)}`;
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log('[WS] Connected');
      useChatStore.getState().setWsConnected(true);
      this.reconnectAttempts = 0;
      this.startPing();

      // Re-join rooms after reconnect
      const { rooms, activeChat } = useChatStore.getState();
      rooms.forEach((r) => this.send({ type: 'JOIN_ROOM', roomId: r.id }));
      if (activeChat?.kind === 'room') {
        // already joined above
      }
    };

    this.ws.onmessage = (event) => {
      try {
        const msg: ChatMessage = JSON.parse(event.data as string);
        this.handleMessage(msg);
      } catch {
        console.warn('[WS] Failed to parse message', event.data);
      }
    };

    this.ws.onclose = () => {
      console.log('[WS] Disconnected');
      useChatStore.getState().setWsConnected(false);
      this.stopPing();
      this.scheduleReconnect();
    };

    this.ws.onerror = (err) => {
      console.error('[WS] Error', err);
    };
  }

  private handleMessage(msg: ChatMessage): void {
    const store = useChatStore.getState();

    switch (msg.type) {
      case 'PONG':
        break;
      case 'CHAT': {
        const key = msg.roomId ?? 'unknown';
        const { activeChat } = store;
        const isActive = activeChat?.kind === 'room' && activeChat.roomId === key;
        const isOwn = msg.senderId === useAuthStore.getState().user?.id;
        // Skip echo of own messages — already added optimistically in MessageInput
        if (!isOwn) {
          store.addMessage(key, { ...msg, id: nanoid(), isOwn: false });
          if (!isActive) store.incrementUnread(key);
        }
        break;
      }
      case 'DIRECT': {
        const isOwn = msg.senderId === useAuthStore.getState().user?.id;
        // For own DMs the conversation is keyed by recipientId, for incoming by senderId
        const key = isOwn ? (msg.recipientId ?? 'unknown') : (msg.senderId ?? 'unknown');
        const { activeChat } = store;
        const isActive = activeChat?.kind === 'direct' && activeChat.userId === key;
        if (!isOwn) {
          store.addMessage(key, { ...msg, id: nanoid(), isOwn: false });
          if (!isActive) store.incrementUnread(key);
        }
        break;
      }
      case 'SYSTEM':
      case 'ERROR': {
        // Add as system message to active chat
        const { activeChat } = store;
        if (activeChat) {
          const key = activeChat.kind === 'room' ? activeChat.roomId : activeChat.userId;
          store.addMessage(key, { ...msg, id: nanoid() });
        }
        break;
      }
    }
  }

  joinRoom(roomId: string): void {
    this.send({ type: 'JOIN_ROOM', roomId });
  }

  leaveRoom(roomId: string): void {
    this.send({ type: 'LEAVE_ROOM', roomId });
  }

  sendChat(roomId: string, content: string, attachmentUrl?: string): void {
    this.send({ type: 'CHAT', roomId, content, attachmentUrl });
  }

  sendDirect(recipientId: string, content: string, attachmentUrl?: string): void {
    this.send({ type: 'DIRECT', recipientId, content, attachmentUrl });
  }

  private send(msg: Partial<ChatMessage> & { type: MessageType }): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
  }

  private startPing(): void {
    this.pingTimer = setInterval(() => {
      this.send({ type: 'PING' });
    }, PING_INTERVAL_MS);
  }

  private stopPing(): void {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnects) {
      console.warn('[WS] Max reconnects reached — WS unavailable');
      return;
    }
    this.reconnectAttempts++;
    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 60_000);
    console.log(`[WS] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    this.reconnectTimer = setTimeout(() => {
      const token = localStorage.getItem('accessToken');
      if (token) this.connect(token);
    }, delay);
  }

  disconnect(): void {
    this.stopPing();
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
    this.reconnectAttempts = this.maxReconnects; // prevent reconnect
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const chatWs = new ChatrixWebSocket();
