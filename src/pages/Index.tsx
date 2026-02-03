import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, MessageCircle, Users, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { MatchCard } from '@/components/MatchCard';
import { PollCard } from '@/components/PollCard';
import { LeaderboardRow } from '@/components/LeaderboardRow';
import { getLiveMatches, getUpcomingMatches } from '@/data/matches';
import { getTrendingPolls } from '@/data/polls';
import { getTrendingComments } from '@/data/comments';
import { getTopUsers } from '@/data/users';

const Index = () => {
  const liveMatches = getLiveMatches();
  const upcomingMatches = getUpcomingMatches();
  const trendingPolls = getTrendingPolls().slice(0, 3);
  const trendingComments = getTrendingComments().slice(0, 4);
  const topUsers = getTopUsers(5);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 gradient-stadium"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>
        
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(177, 18, 38, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(177, 18, 38, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-sm font-medium text-white/80">2 LIVE MATCHES NOW</span>
            </div>

            {/* Title */}
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-tight">
              WC 2026
              <span className="block text-gradient-primary">CRICKET SOCIAL HUB</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-white/60 mb-8 max-w-2xl mx-auto font-light">
              Comment. Vote. React. <span className="text-primary font-medium">Live.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/matches">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary flex items-center gap-2 text-lg"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  Join Live Match
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link to="/polls">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary text-lg"
                >
                  Explore Polls
                </motion.button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto">
              {[
                { icon: Users, label: 'Active Fans', value: '125K+' },
                { icon: MessageCircle, label: 'Comments Today', value: '45K' },
                { icon: TrendingUp, label: 'Polls Active', value: '24' },
                { icon: Trophy, label: 'Predictions', value: '89K' },
              ].map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="glass-card p-4 text-center"
                >
                  <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="font-display text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
          >
            <div className="w-1 h-2 bg-white/50 rounded-full"></div>
          </motion.div>
        </motion.div>
      </section>

      {/* Live Matches Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              LIVE MATCHES
            </h2>
            <p className="text-muted-foreground mt-2">Join the action, share your thoughts</p>
          </div>
          <Link to="/matches" className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1 text-sm font-medium">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {liveMatches.map((match, idx) => (
            <MatchCard key={match.id} match={match} index={idx} />
          ))}
        </div>

        {/* Upcoming Matches */}
        <div className="mt-12">
          <h3 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-cricket-blue">UPCOMING</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingMatches.map((match, idx) => (
              <MatchCard key={match.id} match={match} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Polls Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              TRENDING POLLS
            </h2>
            <p className="text-muted-foreground mt-2">Have your say, see what fans think</p>
          </div>
          <Link to="/polls" className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1 text-sm font-medium">
            All Polls <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {trendingPolls.map((poll, idx) => (
            <PollCard key={poll.id} poll={poll} index={idx} />
          ))}
        </div>
      </section>

      {/* Community Highlights & Leaderboard */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Community Highlights */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                COMMUNITY HIGHLIGHTS
              </h2>
            </div>

            <div className="space-y-4">
              {trendingComments.map((comment, idx) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card p-4 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={comment.avatar}
                      alt={comment.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white text-sm">{comment.username}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-white/80 text-sm">{comment.message}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {comment.reactions.slice(0, 3).map((r, i) => (
                          <span key={i} className="text-xs bg-white/10 px-2 py-0.5 rounded-full">
                            {r.emoji} {r.count}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Leaderboard Preview */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                <Trophy className="w-6 h-6 text-cricket-gold" />
                TOP FANS
              </h2>
              <Link to="/leaderboard" className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1 text-sm font-medium">
                Full Leaderboard <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {topUsers.map((user, idx) => (
                <LeaderboardRow key={user.id} user={user} index={idx} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;