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

  // Load threads on component mount
  useEffect(() => {
    const loadedThreads = storageUtils.getThreads();
    setThreads(loadedThreads);
    
    // If there are threads, select the first one
  //   if (loadedThreads.length > 0 && !currentThreadId) {
  //     const firstThread = loadedThreads[0];
  //     setCurrentThreadId(firstThread.id);
  //     const threadMessages = storageUtils.getMessages(firstThread.id);
  //     setMessages(threadMessages);
  //   }
  // }, [currentThreadId]);
  }, []);

  // Load messages when thread changes
  useEffect(() => {
    if (currentThreadId) {
      const threadMessages = storageUtils.getMessages(currentThreadId);
      setMessages(threadMessages);
    } else {
      setMessages([]);
    }
  }, [currentThreadId]);

    const handleNewThread = (firstMessageContent?: string) => {
    const newThread: Thread = {
      id: uuidv4(),
      title: firstMessageContent 
        ? (firstMessageContent.length > 50 ? firstMessageContent.substring(0, 50) + '...' : firstMessageContent) 
        : 'New Conversation',
      createdAt: new Date()
    };

    storageUtils.addThread(newThread);
    setThreads(prev => [newThread, ...prev]);
    setCurrentThreadId(newThread.id);

    if (firstMessageContent) {
      const userMessage: Message = {
        id: uuidv4(),
        content: firstMessageContent,
        role: 'user',
        timestamp: new Date()
      };
      storageUtils.addMessage(newThread.id, userMessage);
      setMessages([userMessage]);
      return { threadId: newThread.id, messages: [userMessage] };
    } else {
      setMessages([]);
      return { threadId: newThread.id, messages: [] };
    }
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
      <Sidebar
        threads={threads}
        currentThreadId={currentThreadId}
        onThreadSelect={handleThreadSelect}
        onNewThread={() => handleNewThread()}
        onThreadsUpdate={handleThreadsUpdate}
      />
      <div className="flex-1 flex flex-col">
        <ChatInterface
          threadId={currentThreadId}
          messages={messages}
          onMessagesUpdate={handleMessagesUpdate}
          onThreadUpdate={handleThreadUpdate}
          onNewThread={handleNewThread}
        />
      </div>
    </div>
  );
}
