// ─── Auth ────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  displayName: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  userId: string;
  username: string;
  roles: string[];
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  enabled: boolean;
  emailVerified: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  displayName?: string;
  email?: string;
  avatarUrl?: string;
}

// ─── File ─────────────────────────────────────────────────────────────────────

export interface FileMetadata {
  id: string;
  originalName: string;
  storedName: string;
  contentType: string;
  size: number;
  publicUrl: string;
  uploadedAt: string;
}

// ─── WebSocket Messages ───────────────────────────────────────────────────────

export type MessageType =
  | 'PING'
  | 'PONG'
  | 'JOIN_ROOM'
  | 'LEAVE_ROOM'
  | 'CHAT'
  | 'DIRECT'
  | 'SYSTEM'
  | 'ERROR';

export interface ChatMessage {
  type: MessageType;
  roomId?: string;
  senderId?: string;
  senderName?: string;
  recipientId?: string;
  content?: string;
  attachmentUrl?: string;
  timestamp?: string;
  // client-side only fields
  id?: string;
  isOwn?: boolean;
  reactions?: { emoji: string; count: number; reacted?: boolean }[];
}

// ─── UI State ─────────────────────────────────────────────────────────────────

export interface Room {
  id: string;
  name: string;
  unreadCount?: number;
  lastMessage?: string;
  lastMessageAt?: string;
  isNew?: boolean;
}

export interface DirectConversation {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  unreadCount?: number;
  lastMessage?: string;
  lastMessageAt?: string;
  isOnline?: boolean;
}

export type ActiveChat =
  | { kind: 'room'; roomId: string }
  | { kind: 'direct'; userId: string };

// ─── API Errors ───────────────────────────────────────────────────────────────

export interface ApiError {
  status: number;
  error: string;
  message: string;
  timestamp: string;
  fieldErrors?: Record<string, string>;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
