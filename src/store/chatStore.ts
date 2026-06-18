import { create } from 'zustand';
import type { ChatMessage, Room, DirectConversation, ActiveChat } from '@/types';
import { nanoid } from './nanoid';

interface ChatState {
  // Rooms joined
  rooms: Room[];
  // Direct conversations
  conversations: DirectConversation[];
  // Active chat selection
  activeChat: ActiveChat | null;
  // Messages per room/userId key
  messages: Record<string, ChatMessage[]>;
  // WebSocket connection state
  wsConnected: boolean;

  setActiveChat: (chat: ActiveChat | null) => void;
  addMessage: (key: string, msg: ChatMessage) => void;
  setRooms: (rooms: Room[]) => void;
  addRoom: (room: Room) => void;
  setConversations: (convs: DirectConversation[]) => void;
  addConversation: (conv: DirectConversation) => void;
  setWsConnected: (connected: boolean) => void;
  clearUnread: (key: string) => void;
  incrementUnread: (key: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  rooms: [
    { id: 'general', name: 'general', isNew: true },
    { id: 'server-11', name: 'Server 11' },
    { id: 'server-2', name: 'Server 2' },
    { id: 'server-3', name: 'Server 3' },
    { id: 'server-4', name: 'Server 4' },
    { id: 'server-8', name: 'Server 8' },
    { id: 'server-10', name: 'Server 10' },
  ],
  conversations: [],
  activeChat: { kind: 'room', roomId: 'general' },
  messages: {},
  wsConnected: false,

  setActiveChat: (chat) => set({ activeChat: chat }),

  addMessage: (key, msg) =>
    set((state) => {
      const prev = state.messages[key] ?? [];
      const enriched = { ...msg, id: msg.id ?? nanoid() };
      return { messages: { ...state.messages, [key]: [...prev, enriched] } };
    }),

  setRooms: (rooms) => set({ rooms }),

  addRoom: (room) =>
    set((state) => ({
      rooms: state.rooms.find((r) => r.id === room.id) ? state.rooms : [...state.rooms, room],
    })),

  setConversations: (conversations) => set({ conversations }),

  addConversation: (conv) =>
    set((state) => ({
      conversations: state.conversations.find((c) => c.userId === conv.userId)
        ? state.conversations
        : [...state.conversations, conv],
    })),

  setWsConnected: (wsConnected) => set({ wsConnected }),

  clearUnread: (key) =>
    set((state) => {
      const rooms = state.rooms.map((r) =>
        r.id === key ? { ...r, unreadCount: 0 } : r
      );
      const conversations = state.conversations.map((c) =>
        c.userId === key ? { ...c, unreadCount: 0 } : c
      );
      return { rooms, conversations };
    }),

  incrementUnread: (key) =>
    set((state) => {
      const rooms = state.rooms.map((r) =>
        r.id === key ? { ...r, unreadCount: (r.unreadCount ?? 0) + 1 } : r
      );
      const conversations = state.conversations.map((c) =>
        c.userId === key ? { ...c, unreadCount: (c.unreadCount ?? 0) + 1 } : c
      );
      return { rooms, conversations };
    }),
}));
