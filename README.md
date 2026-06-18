# Chatrix UI

Front-end for the [Chatrix](../Chatrix) real-time chat platform. Built with Vite, React 19, TypeScript, Tailwind CSS v4, Zustand, and WebSocket.

---

## Prerequisites

- Node.js 18+
- npm 9+
- Chatrix backend running (`chatrix-api` on `:8080`, `chatrix-websocket` on `:8081`)

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (edit if backend runs on different ports)
cp .env .env.local
```

`.env` defaults:
```
VITE_API_URL=http://localhost:8080
VITE_WS_URL=ws://localhost:8081
```

---

## Running

```bash
# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

---

## Project Structure

```
src/
├── api/
│   └── client.ts          # Axios REST client (auth, users, files, admin)
├── services/
│   └── websocket.ts       # WebSocket manager (auto-reconnect, PING keepalive)
├── store/
│   ├── authStore.ts        # Auth state (persisted to localStorage)
│   └── chatStore.ts        # Rooms, messages, active chat
├── types/
│   └── index.ts            # Shared TypeScript types
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── ChatPage.tsx
├── components/
│   ├── auth/               # Route guards (ProtectedRoute, PublicOnlyRoute)
│   ├── ui/                 # Avatar, Button, Input
│   ├── layout/             # ServerSidebar, ChannelSidebar, ChatHeader, MembersSidebar
│   └── chat/               # MessageBubble, MessageList, MessageInput
└── lib/
    └── utils.ts            # cn(), formatTime(), getInitials(), etc.
```

---

## Authentication Flow

1. Register at `/register` → auto-login on success
2. Login at `/login` → JWT stored in `localStorage`
3. All REST requests include `Authorization: Bearer <token>` automatically
4. WebSocket connects to `ws://localhost:8081/ws/chat?token=<jwt>` on app load
5. Token expiry (401) → auto-redirect to `/login`

---

## Tech Stack

| Layer | Library |
|-------|---------|
| Build | Vite 8 |
| UI | React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| State | Zustand (persisted) |
| Server state | TanStack Query v5 |
| Routing | React Router v7 |
| Forms | React Hook Form + Zod |
| HTTP | Axios |
| Icons | Lucide React |
