import { WebSocketMessage, QuestionRequest } from '@/types/chat';

export class ChatWebSocket {
  private ws: WebSocket | null = null;
  private onMessage: (message: string, isIntermediate: boolean) => void;
  private onClose: (finalMessage: string) => void;
  private onError: (error: Event) => void;
  private messageCount: number = 0;
  private lastMessage: string = '';
  private allMessages: string[] = [];

  constructor(
    onMessage: (message: string, isIntermediate: boolean) => void,
    onClose: (finalMessage: string) => void,
    onError: (error: Event) => void
  ) {
    this.onMessage = onMessage;
    this.onClose = onClose;
    this.onError = onError;
  }

  connect(question: string, userId: string, threadId: string): void {
    try {
      const wsUrl = process.env.WS_URL || 'ws://localhost:8001/ws/generate';
      this.ws = new WebSocket(wsUrl);
      this.messageCount = 0;
      this.lastMessage = '';
      this.allMessages = [];
      
      this.ws.onopen = () => {
        const request: QuestionRequest = {
          question,
          user_id: userId,
          thread_id: threadId
        };
        this.ws?.send(JSON.stringify(request));
      };

      this.ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          this.messageCount++;
          this.lastMessage = data.message;
          this.allMessages.push(data.message);
          
          // Only send non-empty messages as intermediate
          if (data.message && data.message.trim() !== '') {
            this.onMessage(data.message, true);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        // Check if final message is empty, if so use the last non-empty intermediate message
        let finalMessage = this.lastMessage;
        
        if (!finalMessage || finalMessage.trim() === '') {
          // Find the last non-empty message from allMessages
          for (let i = this.allMessages.length - 1; i >= 0; i--) {
            if (this.allMessages[i] && this.allMessages[i].trim() !== '') {
              finalMessage = this.allMessages[i];
              break;
            }
          }
          
          // If no non-empty message found, use fallback
          if (!finalMessage || finalMessage.trim() === '') {
            finalMessage = 'No response received';
          }
        }
        
        this.onClose(finalMessage);
      };

      this.ws.onerror = (error) => {
        this.onError(error);
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      this.onError(error as Event);
    }
  }

  close(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}
