import { useState, useEffect, useCallback } from 'react';
import { ChatMessage, ChatUser, LiveChatState } from '@/types/chat';
import { ChatService } from '@/services/chatService';

export const useChat = (matchId: string) => {
  const [state, setState] = useState<LiveChatState>({
    messages: [],
    users: [],
    isConnected: false,
    isLoading: true
  });

  const chatService = ChatService.getInstance();

  // Initialize chat when component mounts
  useEffect(() => {
    let mounted = true;

    const initChat = async () => {
      if (!matchId) return;

      setState(prev => ({ ...prev, isLoading: true }));

      try {
        await chatService.initializeChat(matchId);
        
        if (mounted) {
          setState(prev => ({ 
            ...prev, 
            isConnected: true, 
            isLoading: false 
          }));
        }
      } catch (error) {
        console.error('Failed to initialize chat:', error);
        if (mounted) {
          setState(prev => ({ 
            ...prev, 
            isConnected: false, 
            isLoading: false 
          }));
        }
      }
    };

    initChat();

    return () => {
      mounted = false;
      chatService.cleanup(matchId);
    };
  }, [matchId]);

  // Subscribe to messages
  useEffect(() => {
    const unsubscribe = chatService.subscribeToMessages((messages: ChatMessage[]) => {
      setState(prev => ({ ...prev, messages }));
    });

    return unsubscribe;
  }, []);

  // Subscribe to users
  useEffect(() => {
    const unsubscribe = chatService.subscribeToUsers((users: ChatUser[]) => {
      setState(prev => ({ ...prev, users }));
    });

    return unsubscribe;
  }, []);

  // Load online users periodically
  useEffect(() => {
    if (!matchId || !state.isConnected) return;

    const loadUsers = async () => {
      const users = await chatService.getOnlineUsers(matchId);
      setState(prev => ({ ...prev, users }));
    };

    loadUsers();
    const interval = setInterval(loadUsers, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [matchId, state.isConnected]);

  // Send message function
  const sendMessage = useCallback(async (
    message: string, 
    replyTo?: string
  ): Promise<boolean> => {
    if (!message.trim() || !matchId) return false;

    try {
      const userId = localStorage.getItem('chat_user_id') || 'anonymous';
      const username = localStorage.getItem('chat_username') || `Fan${Math.floor(Math.random() * 1000)}`;
      const avatar = localStorage.getItem('chat_avatar') || '👤';

      const result = await chatService.sendMessage(
        matchId, 
        userId, 
        username, 
        message,
        avatar,
        replyTo
      );

      return !!result;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  }, [matchId]);

  // Add reaction function
  const addReaction = useCallback(async (
    messageId: string, 
    emoji: string
  ): Promise<boolean> => {
    try {
      const userId = localStorage.getItem('chat_user_id') || 'anonymous';
      return await chatService.addReaction(messageId, userId, emoji);
    } catch (error) {
      console.error('Failed to add reaction:', error);
      return false;
    }
  }, []);

  // Set user info function
  const setUserInfo = useCallback((username: string, avatar?: string) => {
    chatService.setUserInfo(username, avatar);
  }, []);

  return {
    messages: state.messages,
    users: state.users,
    isConnected: state.isConnected,
    isLoading: state.isLoading,
    sendMessage,
    addReaction,
    setUserInfo
  };
};