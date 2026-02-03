import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Comment, Reaction } from '@/data/comments';

interface ChatMessageProps {
  comment: Comment;
  index?: number;
}

const availableEmojis = ['🔥', '👏', '❤️', '😂', '😮', '👎'];

export const ChatMessage = ({ comment, index = 0 }: ChatMessageProps) => {
  const [reactions, setReactions] = useState<Reaction[]>(comment.reactions);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleReaction = (emoji: string) => {
    setReactions((prev) => {
      const existing = prev.find((r) => r.emoji === emoji);
      if (existing) {
        return prev.map((r) =>
          r.emoji === emoji ? { ...r, count: r.count + 1 } : r
        );
      }
      return [...prev, { emoji, count: 1 }];
    });
    setShowEmojiPicker(false);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group flex gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors"
    >
      {/* Avatar */}
      <img
        src={comment.avatar}
        alt={comment.username}
        className="w-10 h-10 rounded-full bg-muted flex-shrink-0"
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-white text-sm">{comment.username}</span>
          <span className="text-xs text-muted-foreground">{formatTime(comment.timestamp)}</span>
        </div>

        {/* Message */}
        <p className="text-white/90 text-sm leading-relaxed break-words">
          {comment.message}
        </p>

        {/* Reactions */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {reactions.map((reaction, idx) => (
            <button
              key={`${reaction.emoji}-${idx}`}
              onClick={() => handleReaction(reaction.emoji)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm"
            >
              <span>{reaction.emoji}</span>
              <span className="text-xs text-muted-foreground">{reaction.count}</span>
            </button>
          ))}

          {/* Add Reaction Button */}
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="opacity-0 group-hover:opacity-100 transition-opacity px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/10 text-sm text-muted-foreground"
            >
              +
            </button>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute bottom-full left-0 mb-2 p-2 glass-card flex gap-1 z-10"
              >
                {availableEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(emoji)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors text-lg"
                  >
                    {emoji}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};