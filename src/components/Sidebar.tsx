'use client';

import { useState } from 'react';
import { Plus, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { Thread } from '@/types/chat';
import { storageUtils } from '@/utils/storage';

interface SidebarProps {
  threads: Thread[];
  currentThreadId: string | null;
  onThreadSelect: (threadId: string) => void;
  onNewThread: () => void;
  onThreadsUpdate: (threads: Thread[]) => void;
}

export default function Sidebar({
  threads,
  currentThreadId,
  onThreadSelect,
  onNewThread,
  onThreadsUpdate
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleDeleteThread = (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this thread?')) {
      storageUtils.deleteThread(threadId);
      const updatedThreads = threads.filter(t => t.id !== threadId);
      onThreadsUpdate(updatedThreads);
      if (currentThreadId === threadId) {
        onThreadSelect('');
      }
    }
  };

  if (isCollapsed) {
    return (
      <div className="w-16 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <button
          onClick={onNewThread}
          className="mt-4 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-80 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Conversations
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onNewThread}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              title="New conversation"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Threads List */}
      <div className="flex-1 overflow-y-auto">
        {threads.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs mt-1">Start a new conversation to get started</p>
          </div>
        ) : (
          <div className="p-2">
            {threads.map((thread) => (
              <div
                key={thread.id}
                onClick={() => onThreadSelect(thread.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors group relative ${
                  currentThreadId === thread.id
                    ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {thread.title}
                    </h3>
                    {thread.lastMessage && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                        {thread.lastMessage}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {formatDate(thread.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteThread(thread.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-all"
                    title="Delete thread"
                  >
                    <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
