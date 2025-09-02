'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import ChatInterface from '@/components/ChatInterface';
import { Thread, Message } from '@/types/chat';
import { storageUtils } from '@/utils/storage';

export default function Home() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // Load threads and messages on component mount
  useEffect(() => {
    const loadedThreads = storageUtils.getThreads();
    setThreads(loadedThreads);
    
    // If there are threads, select the first one
    if (loadedThreads.length > 0 && !currentThreadId) {
      const firstThread = loadedThreads[0];
      setCurrentThreadId(firstThread.id);
      const threadMessages = storageUtils.getMessages(firstThread.id);
      setMessages(threadMessages);
    }
  }, [currentThreadId]);

  // Load messages when thread changes
  useEffect(() => {
    if (currentThreadId) {
      const threadMessages = storageUtils.getMessages(currentThreadId);
      setMessages(threadMessages);
    } else {
      setMessages([]);
    }
  }, [currentThreadId]);

  const handleNewThread = () => {
    const newThread: Thread = {
      id: uuidv4(),
      title: 'New Conversation',
      createdAt: new Date()
    };

    storageUtils.addThread(newThread);
    setThreads(prev => [newThread, ...prev]);
    setCurrentThreadId(newThread.id);
    setMessages([]);
  };

  const handleThreadSelect = (threadId: string) => {
    setCurrentThreadId(threadId);
  };

  const handleMessagesUpdate = (newMessages: Message[]) => {
    setMessages(newMessages);
    if (currentThreadId) {
      storageUtils.updateMessages(currentThreadId, newMessages);
    }
  };

  const handleThreadUpdate = (threadId: string, title: string, lastMessage: string) => {
    const updatedThreads = threads.map(thread => 
      thread.id === threadId 
        ? { ...thread, title, lastMessage }
        : thread
    );
    setThreads(updatedThreads);
    storageUtils.updateThread(threadId, { title, lastMessage });
  };

  const handleThreadsUpdate = (newThreads: Thread[]) => {
    setThreads(newThreads);
  };

  return (
    <div className="h-screen flex bg-gray-100 dark:bg-gray-900">
      <div className="hidden md:block">
        <Sidebar
          threads={threads}
          currentThreadId={currentThreadId}
          onThreadSelect={handleThreadSelect}
          onNewThread={handleNewThread}
          onThreadsUpdate={handleThreadsUpdate}
        />
      </div>
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI Chatbot
          </h1>
          <button
            onClick={handleNewThread}
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <ChatInterface
          threadId={currentThreadId}
          messages={messages}
          onMessagesUpdate={handleMessagesUpdate}
          onThreadUpdate={handleThreadUpdate}
        />
      </div>
    </div>
  );
}
