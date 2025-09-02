import { Thread, Message } from '@/types/chat';

const THREADS_KEY = 'chatbot_threads';
const MESSAGES_KEY = 'chatbot_messages';

export const storageUtils = {
  // Thread management
  getThreads(): Thread[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(THREADS_KEY);
      return stored ? JSON.parse(stored).map((t: { id: string; title: string; createdAt: string; lastMessage?: string }) => ({
        ...t,
        createdAt: new Date(t.createdAt)
      })) : [];
    } catch {
      return [];
    }
  },

  saveThreads(threads: Thread[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(THREADS_KEY, JSON.stringify(threads));
    } catch (error) {
      console.error('Error saving threads:', error);
    }
  },

  addThread(thread: Thread): void {
    const threads = this.getThreads();
    threads.unshift(thread);
    this.saveThreads(threads);
  },

  updateThread(threadId: string, updates: Partial<Thread>): void {
    const threads = this.getThreads();
    const index = threads.findIndex(t => t.id === threadId);
    if (index !== -1) {
      threads[index] = { ...threads[index], ...updates };
      this.saveThreads(threads);
    }
  },

  deleteThread(threadId: string): void {
    const threads = this.getThreads();
    const filtered = threads.filter(t => t.id !== threadId);
    this.saveThreads(filtered);
    this.deleteMessages(threadId);
  },

  // Message management
  getMessages(threadId: string): Message[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(`${MESSAGES_KEY}_${threadId}`);
      return stored ? JSON.parse(stored).map((m: { id: string; content: string; role: 'user' | 'assistant'; timestamp: string; isIntermediate?: boolean; isFinal?: boolean; intermediateMessages?: string[] }) => ({
        ...m,
        timestamp: new Date(m.timestamp)
      })) : [];
    } catch {
      return [];
    }
  },

  saveMessages(threadId: string, messages: Message[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(`${MESSAGES_KEY}_${threadId}`, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  },

  addMessage(threadId: string, message: Message): void {
    const messages = this.getMessages(threadId);
    // Remove any existing message with the same ID before adding
    const filteredMessages = messages.filter(m => m.id !== message.id);
    filteredMessages.push(message);
    this.saveMessages(threadId, filteredMessages);
  },

  updateMessages(threadId: string, messages: Message[]): void {
    this.saveMessages(threadId, messages);
  },

  deleteMessages(threadId: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(`${MESSAGES_KEY}_${threadId}`);
    } catch (error) {
      console.error('Error deleting messages:', error);
    }
  }
};
