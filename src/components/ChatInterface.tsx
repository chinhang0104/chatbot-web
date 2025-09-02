'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ChevronDown, ChevronUp } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '@/types/chat';
import { ChatWebSocket } from '@/utils/websocket';
import { storageUtils } from '@/utils/storage';

interface ChatInterfaceProps {
  threadId: string | null;
  messages: Message[];
  onMessagesUpdate: (messages: Message[]) => void;
  onThreadUpdate: (threadId: string, title: string, lastMessage: string) => void;
  onNewThread: (firstMessageContent: string) => void;
}

export default function ChatInterface({
  threadId,
  messages,
  onMessagesUpdate,
  onThreadUpdate,
  onNewThread,
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [intermediateMessages, setIntermediateMessages] = useState<string[]>([]);
  const [isCollapsing, setIsCollapsing] = useState(false);
  const [expandedLogic, setExpandedLogic] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<ChatWebSocket | null>(null);
  const intermediateMessagesRef = useRef<string[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleLogic = (messageId: string) => {
    setExpandedLogic(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, intermediateMessages]);

  const initiateAIResponse = (question: string, currentMessages: Message[]) => {
    if (!threadId) return;

    setIsLoading(true);
    setIntermediateMessages([]);
    intermediateMessagesRef.current = [];

    wsRef.current = new ChatWebSocket(
      (message: string, isIntermediate: boolean) => {
        if (isIntermediate) {
          setIntermediateMessages(prev => {
            const newMessages = [...prev, message];
            intermediateMessagesRef.current = newMessages;
            return newMessages;
          });
        }
      },
      (finalMessage: string) => {
        // Connection closed - finalize the response
        setIsLoading(false);
        setIsCollapsing(true);
        
        // Animate collapse of intermediate messages
        setTimeout(() => {
          console.log('Intermediate messages to store:', intermediateMessagesRef.current);
          const assistantMessage: Message = {
            id: uuidv4(),
            content: finalMessage,
            role: 'assistant',
            timestamp: new Date(),
            isFinal: true,
            intermediateMessages: intermediateMessagesRef.current
          };

          const finalMessages = [...currentMessages, assistantMessage];
          onMessagesUpdate(finalMessages);
          storageUtils.addMessage(threadId, assistantMessage);
          
          // Update thread with title and last message
          const threadTitle = question.length > 50 ? question.substring(0, 50) + '...' : question;
          onThreadUpdate(threadId, threadTitle, finalMessage);
          
          setIntermediateMessages([]);
          intermediateMessagesRef.current = [];
          setIsCollapsing(false);
        }, 500);
      },
      (error) => {
        console.error('WebSocket error:', error);
        setIsLoading(false);
        setIntermediateMessages([]);
        
        const errorMessage: Message = {
          id: uuidv4(),
          content: 'Sorry, there was an error processing your request. Please try again.',
          role: 'assistant',
          timestamp: new Date()
        };

        const finalMessages = [...currentMessages, errorMessage];
        onMessagesUpdate(finalMessages);
        storageUtils.addMessage(threadId, errorMessage);
      }
    );

    wsRef.current.connect(question, 'user-123', threadId);
  };

  useEffect(() => {
    if (threadId && messages.length === 1 && messages[0].role === 'user' && !isLoading) {
      initiateAIResponse(messages[0].content, messages);
    }
  }, [threadId, messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !threadId || isLoading) return;

    const question = inputValue.trim();
    const userMessage: Message = {
      id: uuidv4(),
      content: question,
      role: 'user',
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    onMessagesUpdate(updatedMessages);
    storageUtils.addMessage(threadId, userMessage);

    setInputValue('');
    initiateAIResponse(question, updatedMessages);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!threadId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-gray-800 p-4">
        <div className="text-center">
          <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Welcome to AI Chatbot
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Select a conversation or start a new one to begin chatting
          </p>
        </div>
        <div className="w-full max-w-3xl">
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
            <div className="flex gap-2">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (inputValue.trim()) {
                      onNewThread(inputValue.trim());
                      setInputValue('');
                    }
                  }
                }}
                placeholder="Type your message to start..."
                className="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm md:text-base"
                rows={1}
                disabled={isLoading}
              />
              <button
                onClick={() => {
                  if (inputValue.trim()) {
                    onNewThread(inputValue.trim());
                    setInputValue('');
                  }
                }}
                disabled={!inputValue.trim() || isLoading}
                className="px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[80%] rounded-lg px-3 sm:px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              <div className="flex items-start gap-2">
                {message.role === 'assistant' && (
                  <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                )}
                {message.role === 'user' && (
                  <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="whitespace-pre-wrap text-sm sm:text-base">{message.content}</p>
                  
                  {/* Debug log */}
                  {message.role === 'assistant' && (() => {
                    console.log('Checking message:', message.id, 'has intermediate:', message.intermediateMessages?.length || 0);
                    return null;
                  })()}
                  
                  {/* Show logic button for assistant messages with intermediate messages */}
                  {message.role === 'assistant' && ((message.intermediateMessages?.length || 0) > 0 || true) && (
                    <div className="mt-2">
                      <button
                        onClick={() => toggleLogic(message.id)}
                        className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                      >
                        {expandedLogic.has(message.id) ? (
                          <>
                            <ChevronUp className="w-3 h-3" />
                            Hide logic
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3 h-3" />
                            Show logic
                          </>
                        )}
                      </button>
                      
                      {/* Intermediate messages */}
                      <div className={`overflow-hidden transition-all duration-300 ${
                        expandedLogic.has(message.id) 
                          ? 'max-h-96 opacity-100 mt-2' 
                          : 'max-h-0 opacity-0'
                      }`}>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 space-y-2 max-h-80 overflow-y-auto">
                          {(message.intermediateMessages || ['Test intermediate message 1', 'Test intermediate message 2']).map((intermediateMsg, index) => (
                            <div key={index} className="text-xs text-yellow-800 dark:text-yellow-200">
                              <span className="font-medium">Step {index + 1}:</span>
                              <p className="whitespace-pre-wrap mt-1">{intermediateMsg}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Intermediate Messages */}
        {intermediateMessages.length > 0 && (
          <div className={`transition-all duration-500 ${isCollapsing ? 'opacity-0 max-h-0 overflow-hidden' : 'opacity-100'}`}>
            {intermediateMessages.map((message, index) => (
              <div key={index} className="flex justify-start">
                <div className="max-w-[85%] sm:max-w-[80%] rounded-lg px-3 sm:px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start gap-2">
                    <Bot className="w-4 h-4 mt-0.5 flex-shrink-0 text-yellow-600 dark:text-yellow-400" />
                    <div className="flex-1">
                      <p className="text-sm sm:text-base text-yellow-800 dark:text-yellow-200 whitespace-pre-wrap">
                        {index === 0 ? 'Checking on: ' : ''}{message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Show logic button when collapsing */}
            {isCollapsing && (
              <div className="flex justify-start mt-2">
                <div className="max-w-[85%] sm:max-w-[80%] rounded-lg px-3 sm:px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <button className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                      <ChevronDown className="w-4 h-4" />
                      Show logic
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && intermediateMessages.length === 0 && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg px-4 py-2 bg-gray-100 dark:bg-gray-700">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-gray-500" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm md:text-base"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
