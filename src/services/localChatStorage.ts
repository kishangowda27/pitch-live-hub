import { ChatMessage, ChatReaction, ChatUser } from '@/types/chat';

export class LocalChatStorage {
  private static instance: LocalChatStorage;
  private readonly STORAGE_KEYS = {
    MESSAGES: 'chat_messages',
    USERS: 'chat_users',
    USER_INFO: 'chat_user_info',
    SESSIONS: 'chat_sessions'
  };

  static getInstance(): LocalChatStorage {
    if (!LocalChatStorage.instance) {
      LocalChatStorage.instance = new LocalChatStorage();
    }
    return LocalChatStorage.instance;
  }

  // Message storage methods
  saveMessages(matchId: string, messages: ChatMessage[]): void {
    try {
      const key = `${this.STORAGE_KEYS.MESSAGES}_${matchId}`;
      const data = {
        messages,
        lastUpdated: new Date().toISOString(),
        matchId
      };
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save messages to local storage:', error);
    }
  }

  getMessages(matchId: string): ChatMessage[] {
    try {
      const key = `${this.STORAGE_KEYS.MESSAGES}_${matchId}`;
      const data = localStorage.getItem(key);
      if (!data) return [];

      const parsed = JSON.parse(data);
      return parsed.messages || [];
    } catch (error) {
      console.error('Failed to get messages from local storage:', error);
      return [];
    }
  }

  addMessage(matchId: string, message: ChatMessage): void {
    try {
      const existingMessages = this.getMessages(matchId);
      const updatedMessages = [...existingMessages, message];
      this.saveMessages(matchId, updatedMessages);
    } catch (error) {
      console.error('Failed to add message to local storage:', error);
    }
  }

  updateMessage(matchId: string, messageId: string, updates: Partial<ChatMessage>): void {
    try {
      const messages = this.getMessages(matchId);
      const updatedMessages = messages.map(msg => 
        msg.id === messageId ? { ...msg, ...updates } : msg
      );
      this.saveMessages(matchId, updatedMessages);
    } catch (error) {
      console.error('Failed to update message in local storage:', error);
    }
  }

  // User storage methods
  saveUsers(matchId: string, users: ChatUser[]): void {
    try {
      const key = `${this.STORAGE_KEYS.USERS}_${matchId}`;
      const data = {
        users,
        lastUpdated: new Date().toISOString(),
        matchId
      };
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save users to local storage:', error);
    }
  }

  getUsers(matchId: string): ChatUser[] {
    try {
      const key = `${this.STORAGE_KEYS.USERS}_${matchId}`;
      const data = localStorage.getItem(key);
      if (!data) return [];

      const parsed = JSON.parse(data);
      return parsed.users || [];
    } catch (error) {
      console.error('Failed to get users from local storage:', error);
      return [];
    }
  }

  // User info methods
  saveUserInfo(userId: string, username: string, avatar?: string): void {
    try {
      const userInfo = {
        userId,
        username,
        avatar,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(this.STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo));
    } catch (error) {
      console.error('Failed to save user info to local storage:', error);
    }
  }

  getUserInfo(): { userId: string; username: string; avatar?: string } | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.USER_INFO);
      if (!data) return null;
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to get user info from local storage:', error);
      return null;
    }
  }

  // Session tracking
  startSession(matchId: string, userId: string): void {
    try {
      const sessionData = {
        matchId,
        userId,
        startTime: new Date().toISOString(),
        messagesSent: 0,
        reactionsGiven: 0
      };
      
      const key = `${this.STORAGE_KEYS.SESSIONS}_${matchId}_${userId}`;
      localStorage.setItem(key, JSON.stringify(sessionData));
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  }

  updateSessionStats(matchId: string, userId: string, messagesSent: number, reactionsGiven: number): void {
    try {
      const key = `${this.STORAGE_KEYS.SESSIONS}_${matchId}_${userId}`;
      const data = localStorage.getItem(key);
      
      if (data) {
        const session = JSON.parse(data);
        session.messagesSent = messagesSent;
        session.reactionsGiven = reactionsGiven;
        session.lastActivity = new Date().toISOString();
        localStorage.setItem(key, JSON.stringify(session));
      }
    } catch (error) {
      console.error('Failed to update session stats:', error);
    }
  }

  endSession(matchId: string, userId: string): void {
    try {
      const key = `${this.STORAGE_KEYS.SESSIONS}_${matchId}_${userId}`;
      const data = localStorage.getItem(key);
      
      if (data) {
        const session = JSON.parse(data);
        session.endTime = new Date().toISOString();
        localStorage.setItem(key, JSON.stringify(session));
      }
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  }

  // Cleanup methods
  clearMatchData(matchId: string): void {
    try {
      const keys = [
        `${this.STORAGE_KEYS.MESSAGES}_${matchId}`,
        `${this.STORAGE_KEYS.USERS}_${matchId}`
      ];
      
      keys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Failed to clear match data:', error);
    }
  }

  clearAllChatData(): void {
    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith(this.STORAGE_KEYS.MESSAGES) ||
        key.startsWith(this.STORAGE_KEYS.USERS) ||
        key.startsWith(this.STORAGE_KEYS.SESSIONS)
      );
      
      keys.forEach(key => localStorage.removeItem(key));
      localStorage.removeItem(this.STORAGE_KEYS.USER_INFO);
    } catch (error) {
      console.error('Failed to clear all chat data:', error);
    }
  }

  // Sync status tracking
  markMessageAsSynced(matchId: string, messageId: string): void {
    try {
      const messages = this.getMessages(matchId);
      const updatedMessages = messages.map(msg => 
        msg.id === messageId ? { ...msg, synced: true } : msg
      );
      this.saveMessages(matchId, updatedMessages);
    } catch (error) {
      console.error('Failed to mark message as synced:', error);
    }
  }

  getUnsyncedMessages(matchId: string): ChatMessage[] {
    try {
      const messages = this.getMessages(matchId);
      return messages.filter(msg => !(msg as any).synced);
    } catch (error) {
      console.error('Failed to get unsynced messages:', error);
      return [];
    }
  }

  // Data export/import for backup
  exportChatData(): string {
    try {
      const chatData: any = {};
      
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('chat_')) {
          chatData[key] = localStorage.getItem(key);
        }
      });
      
      return JSON.stringify({
        data: chatData,
        exportedAt: new Date().toISOString(),
        version: '1.0'
      });
    } catch (error) {
      console.error('Failed to export chat data:', error);
      return '{}';
    }
  }

  importChatData(jsonData: string): boolean {
    try {
      const parsed = JSON.parse(jsonData);
      
      if (parsed.data) {
        Object.entries(parsed.data).forEach(([key, value]) => {
          if (typeof value === 'string') {
            localStorage.setItem(key, value);
          }
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to import chat data:', error);
      return false;
    }
  }
}