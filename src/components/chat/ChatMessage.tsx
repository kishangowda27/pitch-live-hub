import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ChatMessageProps {
  message: ChatMessageType;
  onReaction: (messageId: string, emoji: string) => void;
  onReply: (messageId: string, username: string) => void;
  isOwn?: boolean;
}

const REACTION_EMOJIS = ['❤️', '👍', '😂', '😮', '😢', '🔥', '👏', '🎉'];

export const ChatMessage = ({ 
  message, 
  onReaction, 
  onReply, 
  isOwn = false 
}: ChatMessageProps) => {
  const [showReactions, setShowReactions] = useState(false);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getReactionCount = (emoji: string) => {
    return message.reactions?.filter(r => r.emoji === emoji).length || 0;
  };

  const uniqueReactions = message.reactions 
    ? [...new Set(message.reactions.map(r => r.emoji))]
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 p-3 rounded-lg transition-colors hover:bg-white/5 ${
        isOwn ? 'bg-primary/10' : ''
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-sm">
          {message.avatar || '👤'}
        </div>
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-white text-sm">
            {message.username}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTime(message.timestamp)}
          </span>
          {isOwn && (
            <span className="text-xs text-primary">You</span>
          )}
        </div>

        {/* Reply indicator */}
        {message.reply_to && (
          <div className="text-xs text-muted-foreground mb-1 pl-3 border-l-2 border-primary/30">
            Replying to a message
          </div>
        )}

        {/* Message text */}
        <p className="text-white/90 text-sm break-words">
          {message.message}
        </p>

        {/* Reactions */}
        {uniqueReactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {uniqueReactions.map(emoji => (
              <button
                key={emoji}
                onClick={() => onReaction(message.id, emoji)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-xs"
              >
                <span>{emoji}</span>
                <span className="text-muted-foreground">
                  {getReactionCount(emoji)}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReactions(!showReactions)}
            className="h-6 px-2 text-xs hover:bg-white/10"
          >
            <Heart className="w-3 h-3 mr-1" />
            React
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReply(message.id, message.username)}
            className="h-6 px-2 text-xs hover:bg-white/10"
          >
            <MessageCircle className="w-3 h-3 mr-1" />
            Reply
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-white/10"
              >
                <MoreHorizontal className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="glass-card border-white/10">
              <DropdownMenuItem className="hover:bg-white/10">
                Copy message
              </DropdownMenuItem>
              {isOwn && (
                <DropdownMenuItem className="hover:bg-white/10 text-destructive">
                  Delete message
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Quick reactions */}
        {showReactions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-wrap gap-1 mt-2 p-2 bg-white/5 rounded-lg"
          >
            {REACTION_EMOJIS.map(emoji => (
              <button
                key={emoji}
                onClick={() => {
                  onReaction(message.id, emoji);
                  setShowReactions(false);
                }}
                className="w-8 h-8 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center text-lg"
              >
                {emoji}
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};