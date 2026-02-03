import { useState } from 'react';
import { motion } from 'framer-motion';

interface ReactionBarProps {
  matchId?: string;
}

const reactions = [
  { emoji: '🔥', label: 'Fire', count: 1234 },
  { emoji: '👏', label: 'Clap', count: 856 },
  { emoji: '😮', label: 'Wow', count: 567 },
  { emoji: '❤️', label: 'Love', count: 432 },
  { emoji: '😂', label: 'Haha', count: 321 },
  { emoji: '😢', label: 'Sad', count: 123 },
];

export const ReactionBar = ({ matchId }: ReactionBarProps) => {
  const [localReactions, setLocalReactions] = useState(reactions);
  const [userReactions, setUserReactions] = useState<string[]>([]);

  const handleReaction = (emoji: string) => {
    if (userReactions.includes(emoji)) {
      setUserReactions((prev) => prev.filter((e) => e !== emoji));
      setLocalReactions((prev) =>
        prev.map((r) =>
          r.emoji === emoji ? { ...r, count: r.count - 1 } : r
        )
      );
    } else {
      setUserReactions((prev) => [...prev, emoji]);
      setLocalReactions((prev) =>
        prev.map((r) =>
          r.emoji === emoji ? { ...r, count: r.count + 1 } : r
        )
      );
    }
  };

  return (
    <div className="glass-card p-4">
      <p className="text-sm text-muted-foreground mb-3">React to this match</p>
      <div className="flex flex-wrap gap-2">
        {localReactions.map((reaction) => {
          const isActive = userReactions.includes(reaction.emoji);
          return (
            <motion.button
              key={reaction.emoji}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleReaction(reaction.emoji)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                isActive
                  ? 'bg-primary/20 border border-primary/50'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              <span className="text-xl">{reaction.emoji}</span>
              <span className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-white'}`}>
                {reaction.count.toLocaleString()}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};