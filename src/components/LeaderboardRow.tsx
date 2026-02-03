import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';
import type { User } from '@/data/users';

interface LeaderboardRowProps {
  user: User;
  index?: number;
  isCurrentUser?: boolean;
}

export const LeaderboardRow = ({ user, index = 0, isCurrentUser = false }: LeaderboardRowProps) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border-yellow-500/30';
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-500/10 border-gray-400/30';
      case 3:
        return 'bg-gradient-to-r from-amber-600/20 to-amber-700/10 border-amber-600/30';
      default:
        return 'bg-white/5 border-white/10';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:scale-[1.01] ${
        isCurrentUser
          ? 'bg-primary/10 border-primary/30 ring-1 ring-primary/20'
          : getRankBg(user.rank)
      }`}
    >
      {/* Rank */}
      <div className="w-12 flex items-center justify-center">
        {getRankIcon(user.rank) || (
          <span className="font-display text-xl font-bold text-muted-foreground">
            #{user.rank}
          </span>
        )}
      </div>

      {/* Avatar & Name */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <img
          src={user.avatar}
          alt={user.username}
          className={`w-12 h-12 rounded-full bg-muted ${
            user.rank <= 3 ? 'ring-2 ring-offset-2 ring-offset-background' : ''
          } ${
            user.rank === 1
              ? 'ring-yellow-400'
              : user.rank === 2
              ? 'ring-gray-300'
              : user.rank === 3
              ? 'ring-amber-600'
              : ''
          }`}
        />
        <div className="min-w-0">
          <p className="font-semibold text-white truncate">
            {user.username}
            {isCurrentUser && (
              <span className="ml-2 text-xs text-primary">(You)</span>
            )}
          </p>
          <div className="flex items-center gap-1 flex-wrap">
            {user.badges.slice(0, 3).map((badge) => (
              <span key={badge.id} className="text-sm" title={badge.name}>
                {badge.icon}
              </span>
            ))}
            {user.badges.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{user.badges.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="hidden sm:flex items-center gap-6 text-sm">
        <div className="text-center">
          <p className="text-muted-foreground text-xs">Comments</p>
          <p className="font-semibold text-white">{user.commentsCount}</p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground text-xs">Votes</p>
          <p className="font-semibold text-white">{user.votesCount}</p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground text-xs">Predictions</p>
          <p className="font-semibold text-white">
            {user.predictionsCorrect}/{user.predictionsTotal}
          </p>
        </div>
      </div>

      {/* Points */}
      <div className="text-right">
        <p className="font-display text-2xl font-bold text-white">
          {user.points.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground">points</p>
      </div>
    </motion.div>
  );
};