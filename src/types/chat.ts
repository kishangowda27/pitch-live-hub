export interface ChatMessage {
  id: string;
  match_id: string;
  user_id: string;
  username: string;
  avatar?: string;
  message: string;
  timestamp: string;
  reactions?: ChatReaction[];
  reply_to?: string;
  message_type: 'text' | 'reaction' | 'system';
}

export interface ChatReaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  timestamp: string;
}

export interface ChatUser {
  id: string;
  username: string;
  avatar?: string;
  is_online: boolean;
  last_seen: string;
}

export interface LiveChatState {
  messages: ChatMessage[];
  users: ChatUser[];
  isConnected: boolean;
  isLoading: boolean;
}