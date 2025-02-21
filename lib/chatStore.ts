type ChatHandler = (message: string) => void;

class ChatStore {
  private static instance: ChatStore;
  private handlers: ChatHandler[] = [];

  private constructor() {}

  static getInstance(): ChatStore {
    if (!ChatStore.instance) {
      ChatStore.instance = new ChatStore();
    }
    return ChatStore.instance;
  }

  subscribe(handler: ChatHandler) {
    this.handlers.push(handler);
  }

  unsubscribe(handler: ChatHandler) {
    this.handlers = this.handlers.filter((h) => h !== handler);
  }

  sendMessage(message: string) {
    this.handlers.forEach((handler) => handler(message));
  }
}

export const chatStore = ChatStore.getInstance();
