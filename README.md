# AI Chatbot Web Application

A responsive, modern chatbot web application built with Next.js, TypeScript, and Tailwind CSS v4. Features real-time WebSocket communication, thread management, and smooth animations.

## Features

- 🤖 **AI-Powered Conversations**: Real-time chat with AI assistant
- 📱 **Responsive Design**: Works seamlessly across all devices
- 🧵 **Thread Management**: Organize conversations with collapsible sidebar
- ⚡ **Real-time Streaming**: WebSocket-based message streaming with intermediate responses
- 🎨 **Modern UI**: Clean, intuitive interface with dark mode support
- 💾 **Local Storage**: Persistent conversation history
- 🔍 **SEO Optimized**: Proper meta tags and structured data
- ✨ **Smooth Animations**: Collapse animations for message transitions

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **WebSocket**: Native WebSocket API
- **Storage**: LocalStorage for persistence
- **UUID**: For unique thread generation

## Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Backend server running on `localhost:8001` (WebSocket endpoint)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chatbot-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

## Development

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Building for Production

Build the application:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

Start the production server:

```bash
npm start
# or
yarn start
# or
pnpm start
```

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles and animations
│   ├── layout.tsx           # Root layout with SEO metadata
│   └── page.tsx             # Main application page
├── components/
│   ├── Sidebar.tsx          # Collapsible sidebar with thread list
│   └── ChatInterface.tsx    # Chat area with message display
├── types/
│   └── chat.ts              # TypeScript type definitions
└── utils/
    ├── storage.ts           # LocalStorage utilities
    └── websocket.ts         # WebSocket connection management
```

## Backend Integration

The application expects a WebSocket server running on `localhost:8001` with the following endpoint:

- **WebSocket URL**: `ws://localhost:8001/ws/generate`
- **Request Format**: 
  ```json
  {
    "question": "string",
    "user_id": "string", 
    "thread_id": "string"
  }
  ```
- **Response Format**:
  ```json
  {
    "message": "string"
  }
  ```

## Features in Detail

### Thread Management
- Create new conversation threads with unique IDs
- View conversation history in collapsible sidebar
- Delete threads with confirmation
- Automatic thread title generation from first message

### Real-time Messaging
- WebSocket connection for real-time communication
- Intermediate message display with "Checking on:" prefix
- Smooth collapse animation when final response arrives
- Fallback to last intermediate message if final is empty

### Responsive Design
- Desktop: Two-column layout with sidebar and chat area
- Mobile: Single column with header and chat area
- Collapsible sidebar for space optimization
- Touch-friendly interface elements

### SEO Optimization
- Comprehensive meta tags
- Open Graph and Twitter Card support
- Structured data (JSON-LD)
- Mobile web app capabilities
- Canonical URLs

## Customization

### Styling
Modify `src/app/globals.css` to customize:
- Color schemes
- Animations
- Scrollbar styles
- Transitions

### WebSocket Configuration
Update `src/utils/websocket.ts` to change:
- WebSocket URL
- Connection parameters
- Message handling logic

### Storage
Modify `src/utils/storage.ts` to:
- Change storage keys
- Add data validation
- Implement different storage backends

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
