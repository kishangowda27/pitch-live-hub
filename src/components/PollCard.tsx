import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, TrendingUp, Users } from 'lucide-react';
import type { Poll, PollOption } from '@/data/polls';

interface PollCardProps {
  poll: Poll;
  index?: number;
  compact?: boolean;
}

export const PollCard = ({ poll, index = 0, compact = false }: PollCardProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (optionId: string) => {
    if (hasVoted) return;
    setSelectedOption(optionId);
    setHasVoted(true);
  };

  const getPercentage = (option: PollOption) => {
    const total = hasVoted ? poll.totalVotes + 1 : poll.totalVotes;
    const votes = hasVoted && option.id === selectedOption ? option.votes + 1 : option.votes;
    return Math.round((votes / total) * 100);
  };

  const categoryColors = {
    match: 'bg-primary/20 text-primary',
    player: 'bg-cricket-gold/20 text-cricket-gold',
    prediction: 'bg-cricket-blue/20 text-cricket-blue',
    fun: 'bg-purple-500/20 text-purple-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={`glass-card p-5 ${compact ? '' : 'hover:bg-white/10 transition-all duration-300'}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full uppercase tracking-wider ${categoryColors[poll.category]}`}>
              {poll.category}
            </span>
            {poll.status === 'active' && (
              <span className="flex items-center gap-1 text-xs text-cricket-green">
                <Clock className="w-3 h-3" />
                Active
              </span>
            )}
          </div>
          <h3 className={`font-semibold text-white ${compact ? 'text-sm' : 'text-lg'}`}>
            {poll.question}
          </h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="w-3.5 h-3.5" />
          <span>{(poll.totalVotes + (hasVoted ? 1 : 0)).toLocaleString()}</span>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {poll.options.map((option) => {
          const percentage = getPercentage(option);
          const isSelected = selectedOption === option.id;

          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={hasVoted}
              className={`relative w-full text-left p-3 rounded-xl overflow-hidden transition-all duration-300 ${
                hasVoted
                  ? 'cursor-default'
                  : 'hover:bg-white/10 cursor-pointer'
              } ${isSelected ? 'ring-2 ring-primary' : 'bg-white/5'}`}
            >
              {/* Progress Bar */}
              <AnimatePresence>
                {hasVoted && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className={`absolute inset-y-0 left-0 ${
                      isSelected ? 'bg-primary/30' : 'bg-white/10'
                    }`}
                  />
                )}
              </AnimatePresence>

              {/* Content */}
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {hasVoted && isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  )}
                  <span className={`font-medium ${compact ? 'text-sm' : ''} ${isSelected ? 'text-primary' : 'text-white'}`}>
                    {option.text}
                  </span>
                </div>
                {hasVoted && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-bold text-white"
                  >
                    {percentage}%
                  </motion.span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      {!compact && (
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-muted-foreground">
          <span>Ends: {new Date(poll.endsAt).toLocaleDateString()}</span>
          {hasVoted && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1 text-cricket-green"
            >
              <CheckCircle2 className="w-3 h-3" />
              Voted
            </motion.span>
          )}
        </div>
      )}
    </motion.div>
  );
};