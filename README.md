# AI Chatbot Web Application

A modern, responsive chatbot web app built with Next.js, React, TypeScript, and Tailwind CSS v4. It features real-time streaming responses over WebSockets, conversation threads with persistence, and a clean, mobile-friendly UI.

## Features

- 🤖 **AI-Powered Chat**: Real-time assistant responses over WebSocket
- 🧵 **Threaded Conversations**: Create, view, and delete conversation threads
- ⚡ **Streaming UX**: Shows intermediate steps, collapses into a final answer
- 🎨 **Modern UI**: Responsive layout, light/dark-ready styles
- 💾 **Local Persistence**: Threads and messages stored in LocalStorage
- 🔍 **SEO-Ready**: Rich metadata, Open Graph, Twitter cards, JSON‑LD

## Tech Stack

- **Framework**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: `lucide-react`
- **Realtime**: Native `WebSocket`
- **Storage**: `localStorage`
- **Utilities**: `uuid`, `clsx`, `tailwind-merge`

## Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- A backend WebSocket server at `ws://localhost:8001/ws/generate`

## Getting Started

1) Clone and install

```bash
git clone <repository-url>
cd chatbot-app
npm install
# or: yarn install / pnpm install
```

2) Run the dev server

```bash
npm run dev
# or: yarn dev / pnpm dev
```

Visit http://localhost:3000

## Build and Run (Production)

```bash
npm run build
npm start
# or: yarn build && yarn start / pnpm build && pnpm start
```

## Scripts

- `dev`: Start Next.js in dev mode (Turbopack)
- `build`: Build for production (Turbopack)
- `start`: Run the production server
- `lint`: Run ESLint

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles and animations
│   ├── layout.tsx           # Root layout with SEO metadata & JSON-LD
│   └── page.tsx             # Main app shell (sidebar + chat)
├── components/
│   ├── Sidebar.tsx          # Collapsible thread list
│   └── ChatInterface.tsx    # Chat UI & streaming logic
├── lib/
│   └── websocket.ts         # Alternate WebSocket client (simple stream)
├── types/
│   └── chat.ts              # Thread/Message types
├── utils/
│   ├── storage.ts           # LocalStorage helpers (threads/messages)
│   └── websocket.ts         # WebSocket client (with intermediates)
public/                      # Static assets
```

## How It Works

- **Threads**: Managed in `Sidebar.tsx`, persisted via `storageUtils`.
- **Messages**: `ChatInterface.tsx` sends user messages and displays AI responses.
- **WebSocket**: `utils/websocket.ts` connects to `ws://localhost:8001/ws/generate` and:
  - Streams intermediate `message` chunks (shown as “Checking on:” then steps)
  - On close, finalizes by using the last non-empty message if the final is empty
  - Persists the assistant message with `intermediateMessages`

There is also `lib/websocket.ts`, a simplified client that streams messages without intermediate aggregation. The UI uses `utils/websocket.ts`.

## Backend Contract

- **URL**: `ws://localhost:8001/ws/generate`
- **Request**:
  ```json
  {
    "question": "string",
    "user_id": "string",
    "thread_id": "string"
  }
  ```
- **Response (streamed)**:
  ```json
  { "message": "string" }
  ```

The client emits a single request per user message and expects a sequence of JSON messages with a `message` field until the socket closes.

## Configuration

- WebSocket URL: update in `src/utils/websocket.ts` (and optionally `src/lib/websocket.ts`).
- SEO metadata and JSON‑LD: configured in `src/app/layout.tsx`.

## Customization

- **Styling**: Tweak `src/app/globals.css` and Tailwind classes.
- **Persistence**: Replace `localStorage` behavior in `src/utils/storage.ts` if needed.
- **WS Behavior**: Adjust intermediate handling or finalization logic in `src/utils/websocket.ts`.

## Browser Support

- Chrome 88+, Firefox 85+, Safari 14+, Edge 88+

## Troubleshooting

- No responses? Ensure your backend WS server is running at `ws://localhost:8001/ws/generate` and returns JSON lines with a `message` field.
- CORS/WS blocked? Check dev server and firewall settings; use matching protocols (ws/wss).
- Types not matching? Verify `src/types/chat.ts` matches your backend payloads.

## License

MIT
