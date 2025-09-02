export interface Thread {
  id: string;
  title: string;
  createdAt: Date;
  lastMessage?: string;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isIntermediate?: boolean;
  isFinal?: boolean;
  intermediateMessages?: string[];
}

export interface WebSocketMessage {
  message: string;
}

export interface QuestionRequest {
  question: string;
  user_id: string;
  thread_id: string;
}