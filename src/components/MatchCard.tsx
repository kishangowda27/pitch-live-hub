import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users } from 'lucide-react';
import type { Match } from '@/data/matches';

interface MatchCardProps {
  match: Match;
  index?: number;
}

export const MatchCard = ({ match, index = 0 }: MatchCardProps) => {
  const renderFlag = (flag?: string) => {
    if (!flag) return null;
    if (flag.startsWith('http')) {
      return (
        <img
          src={flag}
          alt="team flag"
          className="w-7 h-7 rounded-full object-cover border border-border"
        />
      );
    }
    return <span className="text-3xl">{flag}</span>;
  };

  const statusBadge = {
    live: 'badge-live',
    upcoming: 'badge-upcoming',
    completed: 'badge-completed',
  };

  const statusText = {
    live: 'LIVE',
    upcoming: 'UPCOMING',
    completed: 'COMPLETED',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Link to={`/match/${match.id}`}>
        <div className="glass-card-hover p-5 group">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {match.matchType}
            </span>
            <span className={statusBadge[match.status]}>
              {match.status === 'live' && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
              {statusText[match.status]}
            </span>
          </div>

          {/* Teams */}
          <div className="space-y-3">
            {/* Team 1 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {renderFlag(match.team1.flag)}
                <div>
                  <p className="font-semibold text-foreground">{match.team1.name}</p>
                  <p className="text-xs text-muted-foreground">{match.team1.shortName}</p>
                </div>
              </div>
              {match.team1.score && (
                <div className="text-right">
                  <p className="font-display text-xl font-bold text-foreground">{match.team1.score}</p>
                  <p className="text-xs text-muted-foreground">{match.team1.overs} overs</p>
                </div>
              )}
            </div>

            {/* VS Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-xs font-bold text-muted-foreground">VS</span>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            {/* Team 2 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {renderFlag(match.team2.flag)}
                <div>
                  <p className="font-semibold text-foreground">{match.team2.name}</p>
                  <p className="text-xs text-muted-foreground">{match.team2.shortName}</p>
                </div>
              </div>
              {match.team2.score && (
                <div className="text-right">
                  <p className="font-display text-xl font-bold text-foreground">{match.team2.score}</p>
                  <p className="text-xs text-muted-foreground">{match.team2.overs} overs</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-border">
            {match.status === 'completed' && match.result ? (
              <p className="text-sm text-cricket-green font-medium">{match.result}</p>
            ) : (
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[150px]">{match.venue}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{match.time}</span>
                </div>
              </div>
            )}
          </div>

          {/* Hover Glow Effect */}
          {match.status === 'live' && (
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};