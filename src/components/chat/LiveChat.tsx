import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Users, Settings, X, Wifi, WifiOff } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LiveChatProps {
  matchId: string;
  className?: string;
}

export const LiveChat = ({ matchId, className = '' }: LiveChatProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [replyTo, setReplyTo] = useState<{ id: string; username: string } | undefined>();
  const [showSettings, setShowSettings] = useState(false);
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('👤');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    users,
    isConnected,
    isLoading,
    sendMessage,
    addReaction,
    setUserInfo
  } = useChat(matchId);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Load user info from localStorage
  useEffect(() => {
    const savedUsername = localStorage.getItem('chat_username');
    const savedAvatar = localStorage.getItem('chat_avatar');
    
    if (savedUsername) setUsername(savedUsername);
    if (savedAvatar) setAvatar(savedAvatar);
  }, []);

  const handleSendMessage = async (message: string, replyToId?: string) => {
    const success = await sendMessage(message, replyToId);
    if (success && replyTo) {
      setReplyTo(undefined);
    }
    return success;
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    await addReaction(messageId, emoji);
  };

  const handleReply = (messageId: string, username: string) => {
    setReplyTo({ id: messageId, username });
  };

  const handleSaveSettings = () => {
    setUserInfo(username, avatar);
    setShowSettings(false);
  };

  const getCurrentUserId = () => {
    return localStorage.getItem('chat_user_id') || '';
  };

  if (!isExpanded) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`fixed bottom-4 right-4 z-50 ${className}`}
      >
        <Button
          onClick={() => setIsExpanded(true)}
          className="h-14 w-14 rounded-full gradient-primary shadow-lg hover:shadow-xl transition-all"
        >
          <MessageCircle className="w-6 h-6" />
          {messages.length > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
              {messages.length > 99 ? '99+' : messages.length}
            </Badge>
          )}
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className={`fixed bottom-4 right-4 w-96 h-[600px] glass-card border border-white/10 rounded-xl shadow-2xl z-50 flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-white">Live Chat</h3>
          </div>
          
          {/* Connection status */}
          <div className="flex items-center gap-1">
            {isConnected ? (
              <Wifi className="w-4 h-4 text-green-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-400" />
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Online users count */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{users.length}</span>
          </div>

          {/* Settings */}
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/10">
                <Settings className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-white/10">
              <DialogHeader>
                <DialogTitle>Chat Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="input-field"
                  />
                </div>
                <div>
                  <Label htmlFor="avatar">Avatar (emoji)</Label>
                  <Input
                    id="avatar"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="👤"
                    className="input-field"
                    maxLength={2}
                  />
                </div>
                <Button onClick={handleSaveSettings} className="w-full">
                  Save Settings
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(false)}
            className="h-8 w-8 p-0 hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No messages yet</p>
              <p className="text-sm text-muted-foreground">Be the first to start the conversation!</p>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onReaction={handleReaction}
                onReply={handleReply}
                isOwn={message.user_id === getCurrentUserId()}
              />
            ))}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <ChatInput
        onSendMessage={handleSendMessage}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(undefined)}
        disabled={!isConnected}
        placeholder={isConnected ? "Type your message..." : "Connecting..."}
      />

      {/* Online users sidebar (optional, can be toggled) */}
      {users.length > 0 && (
        <div className="absolute top-16 right-4 w-48 glass-card border border-white/10 rounded-lg p-3 hidden group-hover:block">
          <h4 className="text-sm font-semibold text-white mb-2">Online ({users.length})</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {users.slice(0, 10).map((user) => (
              <div key={user.id} className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-xs">{user.avatar}</span>
                <span className="text-white truncate">{user.username}</span>
              </div>
            ))}
            {users.length > 10 && (
              <div className="text-xs text-muted-foreground">
                +{users.length - 10} more
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};