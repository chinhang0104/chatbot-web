import { QuestionRequest, WebSocketMessage } from '@/types/chat';

export class ChatWebSocket {
  private ws: WebSocket | null = null;
  private messageCallback: ((message: WebSocketMessage) => void) | null = null;
  private closeCallback: (() => void) | null = null;
  private errorCallback: ((error: Event) => void) | null = null;

  connect(
    onMessage: (message: WebSocketMessage) => void,
    onClose: () => void,
    onError: (error: Event) => void
  ) {
    this.messageCallback = onMessage;
    this.closeCallback = onClose;
    this.errorCallback = onError;

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8001/ws/generate';
    this.ws = new WebSocket(wsUrl);
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        this.messageCallback?.(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.closeCallback?.();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.errorCallback?.(error);
    };
  }

  sendQuestion(request: QuestionRequest) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(request));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

