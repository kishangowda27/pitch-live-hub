import { useState, useRef, KeyboardEvent } from 'react';
import { Send, X, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInputProps {
  onSendMessage: (message: string, replyTo?: string) => Promise<boolean>;
  replyTo?: { id: string; username: string };
  onCancelReply?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

const QUICK_REACTIONS = ['🔥', '👏', '😍', '💯', '⚡', '🎯', '🚀', '💪'];

export const ChatInput = ({
  onSendMessage,
  replyTo,
  onCancelReply,
  disabled = false,
  placeholder = "Type your message..."
}: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const success = await onSendMessage(message, replyTo?.id);
      if (success) {
        setMessage('');
        onCancelReply?.();
        inputRef.current?.focus();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const insertEmoji = (emoji: string) => {
    const newMessage = message + emoji;
    setMessage(newMessage);
    setShowEmojis(false);
    inputRef.current?.focus();
  };

  const adjustTextareaHeight = () => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  return (
    <div className="border-t border-border p-4 bg-background/50 backdrop-blur-sm">
      {/* Reply indicator */}
      <AnimatePresence>
        {replyTo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-between p-2 mb-2 bg-primary/10 rounded-lg border-l-4 border-primary"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                Replying to
              </span>
              <span className="text-sm font-medium text-primary">
                {replyTo.username}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancelReply}
              className="h-6 w-6 p-0 hover:bg-accent"
            >
              <X className="w-3 h-3" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input area */}
      <div className="flex items-end gap-2">
        {/* Emoji button */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEmojis(!showEmojis)}
            className="h-10 w-10 p-0 hover:bg-accent"
            disabled={disabled}
          >
            <Smile className="w-4 h-4" />
          </Button>

          {/* Emoji picker */}
          <AnimatePresence>
            {showEmojis && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute bottom-full mb-2 left-0 p-3 bg-popover border border-border rounded-lg shadow-lg z-50"
              >
                <div className="grid grid-cols-4 gap-1">
                  {QUICK_REACTIONS.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => insertEmoji(emoji)}
                      className="w-8 h-8 rounded hover:bg-accent transition-colors flex items-center justify-center text-lg"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Text input */}
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              adjustTextareaHeight();
            }}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            className="w-full min-h-[40px] max-h-[120px] px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 resize-none transition-all"
            rows={1}
          />
        </div>

        {/* Send button */}
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled || isLoading}
          className="h-10 w-10 p-0 gradient-primary"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Character count */}
      {message.length > 200 && (
        <div className="text-xs text-muted-foreground mt-1 text-right">
          {message.length}/500
        </div>
      )}
    </div>
  );
};