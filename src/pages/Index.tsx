import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, TrendingUp, MessageCircle, Users, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { MatchCard } from '@/components/MatchCard';
import { PollCard } from '@/components/PollCard';
import { LeaderboardRow } from '@/components/LeaderboardRow';
import { getTrendingPolls } from '@/data/polls';
import { getTrendingComments } from '@/data/comments';
import { getTopUsers } from '@/data/users';
import HeroAnimation from '@/components/HeroAnimation';
import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchLiveMatches, fetchCurrentMatches } from '@/services/api';

const Index = () => {
  // All matches (for upcoming/completed section)
  const { data: allMatches = [] } = useQuery({
    queryKey: ['matches'],
    queryFn: async () => {
      try {
        const matches = await fetchLiveMatches();
        if (matches.length > 0) return matches;
        // Fallback to dummy data
        const { matches: dummyMatches } = await import('@/data/matches');
        return dummyMatches;
      } catch (error) {
        console.error('Failed to fetch matches, using dummy data', error);
        const { matches } = await import('@/data/matches');
        return matches;
      }
    },
    refetchInterval: 60000, 
  });

  // Current live matches (uses dedicated endpoint)
  const { data: liveMatches = [] } = useQuery({
    queryKey: ['currentMatches'],
    queryFn: async () => {
      try {
        const matches = await fetchCurrentMatches();
        if (matches.length > 0) return matches;
        // Fallback to dummy live matches
        const { getLiveMatches } = await import('@/data/matches');
        return getLiveMatches();
      } catch (error) {
        console.error('Failed to fetch current matches, using dummy data', error);
        const { getLiveMatches } = await import('@/data/matches');
        return getLiveMatches();
      }
    },
    refetchInterval: 30000,
  });

  // All upcoming matches from the API (no date restriction here)
  const upcomingMatches = allMatches.filter((m) => m.status === 'upcoming');

  const trendingPolls = getTrendingPolls().slice(0, 3);
  const trendingComments = getTrendingComments().slice(0, 4);
  const topUsers = getTopUsers(5);

  const containerRef = useRef<HTMLElement>(null);
  
  // We use this to fade out the hero content as we scroll deep into the animation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0.8, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0.8, 1], [1, 0.95]);

  return (
    <MainLayout>
      {/* 
        SCROLLYTELLING HERO SECTION 
        Height is huge (1200vh) to allow long scroll for animation.
        Content is Sticky.
      */}
      <section ref={containerRef} className="relative h-[800vh] md:h-[1200vh]">
        
        {/* Fixed Background Animation - Plays as we scroll down the entire page basically, 
            but logically coupled to this intro section */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <HeroAnimation />
          
          {/* Hero Content - Centered & Sticky */}
          <motion.div 
            style={{ opacity: heroOpacity, scale: heroScale }}
            className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center"
          >
             <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              

              {/* Title */}
              <h1 className="font-display text-5xl sm:text-7xl lg:text-9xl font-bold text-white mb-6 tracking-tighter drop-shadow-2xl">
                WC 2026
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mt-2">SOCIAL HUB</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl sm:text-3xl text-gray-200 mb-10 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-lg">
                Join our growing cricket community. <br className="hidden sm:block" />
                Comment. Vote. React. <span className="text-emerald-400 font-semibold">Together.</span>
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/matches">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group bg-white text-black px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all"
                  >
                    <span className="relative flex h-2 w-2">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                    </span>
                    Join Live Match
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
                <Link to="/polls">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-full font-medium text-lg text-white border border-white/30 hover:bg-white/10 backdrop-blur-sm transition-all"
                  >
                    Explore Polls
                  </motion.button>
                </Link>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mt-20 max-w-4xl mx-auto">
                {[
                  { icon: Users, label: 'Growing Community', value: '500+' },
                  { icon: MessageCircle, label: 'Daily Chats', value: '150+' },
                  { icon: TrendingUp, label: 'Active Polls', value: '12' },
                  { icon: Trophy, label: 'New Predictions', value: '200+' },
                ].map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="p-4 rounded-2xl bg-black/20 backdrop-blur-md border border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <stat.icon className="w-6 h-6 text-emerald-400 mx-auto mb-3" />
                    <p className="font-display text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

             {/* Scroll Hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
              <span className="text-[10px] uppercase tracking-widest text-white/50">Scroll to Explore</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="w-5 h-8 rounded-full border-2 border-white/20 flex justify-center p-1"
              >
                <div className="w-1 h-2 bg-white/60 rounded-full" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 
        REGULAR CONTENT FOLLOWS 
        This content will appear naturally after the user scrolls past the 1200vh hero spacer.
        The background here needs to be solid (or gradient) to cover the fixed hero animation 
        if we want it to "scroll away", OR we can keep the animation fixed and overlay a background.
        Let's add a solid background to this section so it covers the Hero as it slides up.
      */}
      <div className="relative z-20 bg-background rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] border-t border-border -mt-20 pt-10 pb-0">
        
        {/* Live Matches Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground flex items-center gap-3">
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
            <h3 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
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
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                TRENDING POLLS
              </h2>
              <p className="text-muted-foreground mt-2">Join our growing cricket community</p>
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
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                  GROWING COMMUNITY
                </h2>
              </div>

              <div className="space-y-4">
                {trendingComments.map((comment, idx) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
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
                          <span className="font-semibold text-foreground text-sm">{comment.username}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm">{comment.message}</p>
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
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-cricket-gold" />
                  EARLY SUPPORTERS
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
      </div>
    </MainLayout>
  );
};

export default Index;