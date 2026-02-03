import { insforge } from '@/lib/insforgeClient';
import { ChatMessage, ChatReaction, ChatUser } from '@/types/chat';
import { LocalChatStorage } from './localChatStorage';

export class ChatService {
  private static instance: ChatService;
  private subscribers: Set<(messages: ChatMessage[]) => void> = new Set();
  private userSubscribers: Set<(users: ChatUser[]) => void> = new Set();
  private realtimeChannel: any = null;
  private localStorage: LocalChatStorage;
  private currentMatchId: string | null = null;
  private syncInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.localStorage = LocalChatStorage.getInstance();
  }

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  // Subscribe to real-time chat messages
  subscribeToMessages(callback: (messages: ChatMessage[]) => void) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  // Subscribe to online users
  subscribeToUsers(callback: (users: ChatUser[]) => void) {
    this.userSubscribers.add(callback);
    return () => this.userSubscribers.delete(callback);
  }

  // Initialize real-time connection for a specific match
  async initializeChat(matchId: string) {
    try {
      this.currentMatchId = matchId;
      
      // Load cached messages first for immediate display
      const cachedMessages = this.localStorage.getMessages(matchId);
      if (cachedMessages.length > 0) {
        this.notifyMessageSubscribers(cachedMessages);
      }

      // Set up real-time subscription for chat messages
      this.realtimeChannel = insforge.realtime
        .channel(`match_chat_${matchId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `match_id=eq.${matchId}`
        }, (payload) => {
          this.handleNewMessage(payload.new as ChatMessage);
        })
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_messages',
          filter: `match_id=eq.${matchId}`
        }, (payload) => {
          this.handleMessageUpdate(payload.new as ChatMessage);
        })
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_reactions',
        }, () => {
          // Reload messages when reactions change
          this.loadMessages(matchId);
        })
        .on('postgres_changes', {
          event: 'DELETE',
          schema: 'public',
          table: 'chat_reactions',
        }, () => {
          // Reload messages when reactions change
          this.loadMessages(matchId);
        })
        .subscribe();

      // Load fresh messages from server
      await this.loadMessages(matchId);
      
      // Update user online status
      await this.updateUserStatus(matchId, true);

      // Start session tracking
      const userInfo = this.localStorage.getUserInfo();
      if (userInfo) {
        this.localStorage.startSession(matchId, userInfo.userId);
        await this.trackSession(matchId, userInfo.userId, 'start');
      }

      // Start periodic sync for offline messages
      this.startSyncInterval();

    } catch (error) {
      console.error('Failed to initialize chat:', error);
      // Fallback to cached data
      const cachedMessages = this.localStorage.getMessages(matchId);
      this.notifyMessageSubscribers(cachedMessages);
    }
  }

  // Load chat messages for a match
  async loadMessages(matchId: string): Promise<ChatMessage[]> {
    try {
      const { data, error } = await insforge.database
        .from('chat_messages')
        .select(`
          *,
          reactions:chat_reactions(*)
        `)
        .eq('match_id', matchId)
        .eq('is_deleted', false)
        .order('timestamp', { ascending: true })
        .limit(100);

      if (error) throw error;

      const messages = data || [];
      
      // Save to local storage
      this.localStorage.saveMessages(matchId, messages);
      
      // Mark all as synced
      messages.forEach(msg => {
        this.localStorage.markMessageAsSynced(matchId, msg.id);
      });
      
      this.notifyMessageSubscribers(messages);
      return messages;
    } catch (error) {
      console.error('Failed to load messages:', error);
      
      // Fallback to local storage
      const cachedMessages = this.localStorage.getMessages(matchId);
      this.notifyMessageSubscribers(cachedMessages);
      return cachedMessages;
    }
  }

  // Send a new chat message
  async sendMessage(
    matchId: string, 
    userId: string, 
    username: string, 
    message: string,
    avatar?: string,
    replyTo?: string
  ): Promise<ChatMessage | null> {
    try {
      const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const timestamp = new Date().toISOString();
      
      // Create temporary message for immediate UI update
      const tempMessage: ChatMessage = {
        id: tempId,
        match_id: matchId,
        user_id: userId,
        username,
        avatar,
        message: message.trim(),
        timestamp,
        reply_to: replyTo,
        message_type: 'text'
      };

      // Add to local storage immediately
      this.localStorage.addMessage(matchId, tempMessage);
      this.notifyMessageSubscribers(this.localStorage.getMessages(matchId));

      // Save user info
      this.localStorage.saveUserInfo(userId, username, avatar);

      // Try to send to server
      const newMessage: Omit<ChatMessage, 'id'> = {
        match_id: matchId,
        user_id: userId,
        username,
        avatar,
        message: message.trim(),
        timestamp,
        reply_to: replyTo,
        message_type: 'text'
      };

      const { data, error } = await insforge.database
        .from('chat_messages')
        .insert([newMessage])
        .select()
        .single();

      if (error) throw error;

      // Replace temp message with real message
      this.localStorage.updateMessage(matchId, tempId, { 
        id: data.id,
        ...data 
      });
      this.localStorage.markMessageAsSynced(matchId, data.id);

      // Update session stats
      await this.updateSessionStats(matchId, userId, 'message');
      
      return data;
    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Message stays in local storage as unsynced
      // Will be retried during sync
      return null;
    }
  }

  // Add reaction to a message
  async addReaction(
    messageId: string, 
    userId: string, 
    emoji: string
  ): Promise<boolean> {
    try {
      // Check if user already reacted with this emoji
      const { data: existing } = await insforge.database
        .from('chat_reactions')
        .select('id')
        .eq('message_id', messageId)
        .eq('user_id', userId)
        .eq('emoji', emoji)
        .single();

      if (existing) {
        // Remove reaction if it exists
        const { error } = await insforge.database
          .from('chat_reactions')
          .delete()
          .eq('id', existing.id);
        
        if (!error && this.currentMatchId) {
          await this.updateSessionStats(this.currentMatchId, userId, 'reaction');
        }
        
        return !error;
      } else {
        // Add new reaction
        const { error } = await insforge.database
          .from('chat_reactions')
          .insert([{
            message_id: messageId,
            user_id: userId,
            emoji,
            timestamp: new Date().toISOString()
          }]);

        if (!error && this.currentMatchId) {
          await this.updateSessionStats(this.currentMatchId, userId, 'reaction');
        }

        return !error;
      }
    } catch (error) {
      console.error('Failed to add reaction:', error);
      return false;
    }
  }

  // Update user online status
  async updateUserStatus(matchId: string, isOnline: boolean): Promise<void> {
    try {
      const userInfo = this.localStorage.getUserInfo();
      if (!userInfo) return;

      const userData = {
        id: userInfo.userId,
        username: userInfo.username,
        avatar: userInfo.avatar,
        match_id: matchId,
        is_online: isOnline,
        last_seen: new Date().toISOString()
      };

      await insforge.database
        .from('chat_users')
        .upsert(userData);

      // Update local storage
      const users = this.localStorage.getUsers(matchId);
      const updatedUsers = users.filter(u => u.id !== userInfo.userId);
      if (isOnline) {
        updatedUsers.push({
          id: userInfo.userId,
          username: userInfo.username,
          avatar: userInfo.avatar,
          is_online: isOnline,
          last_seen: new Date().toISOString()
        });
      }
      this.localStorage.saveUsers(matchId, updatedUsers);
      
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  }

  // Get online users for a match
  async getOnlineUsers(matchId: string): Promise<ChatUser[]> {
    try {
      const { data, error } = await insforge.database
        .from('chat_users')
        .select('*')
        .eq('match_id', matchId)
        .eq('is_online', true)
        .order('last_seen', { ascending: false });

      if (error) throw error;
      
      const users = data || [];
      this.localStorage.saveUsers(matchId, users);
      this.notifyUserSubscribers(users);
      
      return users;
    } catch (error) {
      console.error('Failed to get online users:', error);
      
      // Fallback to cached users
      const cachedUsers = this.localStorage.getUsers(matchId);
      this.notifyUserSubscribers(cachedUsers);
      return cachedUsers;
    }
  }

  // Track session in database
  private async trackSession(matchId: string, userId: string, action: 'start' | 'end'): Promise<void> {
    try {
      if (action === 'start') {
        await insforge.database
          .from('chat_sessions')
          .insert([{
            user_id: userId,
            match_id: matchId,
            session_start: new Date().toISOString(),
            messages_sent: 0,
            reactions_given: 0
          }]);
      } else {
        // Update the most recent session
        const { data: sessions } = await insforge.database
          .from('chat_sessions')
          .select('*')
          .eq('user_id', userId)
          .eq('match_id', matchId)
          .is('session_end', null)
          .order('session_start', { ascending: false })
          .limit(1);

        if (sessions && sessions.length > 0) {
          await insforge.database
            .from('chat_sessions')
            .update({ session_end: new Date().toISOString() })
            .eq('id', sessions[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to track session:', error);
    }
  }

  // Update session statistics
  private async updateSessionStats(matchId: string, userId: string, type: 'message' | 'reaction'): Promise<void> {
    try {
      const { data: sessions } = await insforge.database
        .from('chat_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('match_id', matchId)
        .is('session_end', null)
        .order('session_start', { ascending: false })
        .limit(1);

      if (sessions && sessions.length > 0) {
        const session = sessions[0];
        const updates: any = {};
        
        if (type === 'message') {
          updates.messages_sent = (session.messages_sent || 0) + 1;
        } else {
          updates.reactions_given = (session.reactions_given || 0) + 1;
        }

        await insforge.database
          .from('chat_sessions')
          .update(updates)
          .eq('id', session.id);

        // Update local storage stats
        this.localStorage.updateSessionStats(
          matchId, 
          userId, 
          updates.messages_sent || session.messages_sent || 0,
          updates.reactions_given || session.reactions_given || 0
        );
      }
    } catch (error) {
      console.error('Failed to update session stats:', error);
    }
  }

  // Start periodic sync for offline messages
  private startSyncInterval(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(async () => {
      if (this.currentMatchId) {
        await this.syncUnsyncedMessages(this.currentMatchId);
      }
    }, 30000); // Sync every 30 seconds
  }

  // Sync unsynced messages
  private async syncUnsyncedMessages(matchId: string): Promise<void> {
    try {
      const unsyncedMessages = this.localStorage.getUnsyncedMessages(matchId);
      
      for (const message of unsyncedMessages) {
        if (message.id.startsWith('temp_')) {
          // Try to send temp message
          const { data, error } = await insforge.database
            .from('chat_messages')
            .insert([{
              match_id: message.match_id,
              user_id: message.user_id,
              username: message.username,
              avatar: message.avatar,
              message: message.message,
              timestamp: message.timestamp,
              reply_to: message.reply_to,
              message_type: message.message_type
            }])
            .select()
            .single();

          if (!error && data) {
            // Replace temp message with real message
            this.localStorage.updateMessage(matchId, message.id, {
              id: data.id,
              ...data
            });
            this.localStorage.markMessageAsSynced(matchId, data.id);
          }
        }
      }
    } catch (error) {
      console.error('Failed to sync unsynced messages:', error);
    }
  }

  // Clean up when leaving chat
  async cleanup(matchId: string): Promise<void> {
    try {
      await this.updateUserStatus(matchId, false);
      
      const userInfo = this.localStorage.getUserInfo();
      if (userInfo) {
        this.localStorage.endSession(matchId, userInfo.userId);
        await this.trackSession(matchId, userInfo.userId, 'end');
      }
      
      if (this.realtimeChannel) {
        await insforge.realtime.removeChannel(this.realtimeChannel);
        this.realtimeChannel = null;
      }

      if (this.syncInterval) {
        clearInterval(this.syncInterval);
        this.syncInterval = null;
      }

      this.currentMatchId = null;
    } catch (error) {
      console.error('Failed to cleanup chat:', error);
    }
  }

  // Private helper methods
  private handleNewMessage(message: ChatMessage) {
    if (this.currentMatchId) {
      this.localStorage.addMessage(this.currentMatchId, message);
      this.localStorage.markMessageAsSynced(this.currentMatchId, message.id);
      this.notifyMessageSubscribers(this.localStorage.getMessages(this.currentMatchId));
    }
  }

  private handleMessageUpdate(message: ChatMessage) {
    if (this.currentMatchId) {
      this.localStorage.updateMessage(this.currentMatchId, message.id, message);
      this.localStorage.markMessageAsSynced(this.currentMatchId, message.id);
      this.notifyMessageSubscribers(this.localStorage.getMessages(this.currentMatchId));
    }
  }

  private notifyMessageSubscribers(messages: ChatMessage[]) {
    this.subscribers.forEach(callback => callback(messages));
  }

  private notifyUserSubscribers(users: ChatUser[]) {
    this.userSubscribers.forEach(callback => callback(users));
  }

  // Helper methods to get current user info
  private getCurrentUserId(): string {
    const userInfo = this.localStorage.getUserInfo();
    if (userInfo) return userInfo.userId;
    
    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.localStorage.saveUserInfo(id, `Fan${Math.floor(Math.random() * 1000)}`);
    return id;
  }

  private getCurrentUsername(): string {
    const userInfo = this.localStorage.getUserInfo();
    return userInfo?.username || `Fan${Math.floor(Math.random() * 1000)}`;
  }

  private getCurrentUserAvatar(): string {
    const userInfo = this.localStorage.getUserInfo();
    return userInfo?.avatar || '👤';
  }

  // Set user info
  setUserInfo(username: string, avatar?: string) {
    const userId = this.getCurrentUserId();
    this.localStorage.saveUserInfo(userId, username, avatar);
  }

  // Export/Import methods for data backup
  exportChatData(): string {
    return this.localStorage.exportChatData();
  }

  importChatData(jsonData: string): boolean {
    return this.localStorage.importChatData(jsonData);
  }

  // Clear all data
  clearAllData(): void {
    this.localStorage.clearAllChatData();
  }
}