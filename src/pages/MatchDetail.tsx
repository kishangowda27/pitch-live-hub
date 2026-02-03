import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, TrendingUp, Users, Clock, MapPin, Trophy } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MainLayout } from '@/layouts/MainLayout';
import { ChatMessage } from '@/components/ChatMessage';
import { PollCard } from '@/components/PollCard';
import { ReactionBar } from '@/components/ReactionBar';
import { LiveChat } from '@/components/chat/LiveChat';
import type { Comment } from '@/data/comments';
import type { Poll } from '@/data/polls';
import { getPollsByMatchId } from '@/data/polls';
import { getCommentsByMatchId } from '@/data/comments';
import { getMatchById, matches as dummyMatches } from '@/data/matches';
import { fetchLiveMatches } from '@/services/api';
import { insforge } from '@/lib/insforgeClient';
import { useAuth } from '@/context/AuthContext';

const MatchDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: allMatches = [], isLoading } = useQuery({
    queryKey: ['matches'],
    queryFn: async () => {
      try {
        const matches = await fetchLiveMatches();
        if (matches.length > 0) return matches;
      } catch (error) {
        console.error('Failed to fetch matches from API', error);
      }
      // Always fallback to dummy data if API fails or returns empty
      return dummyMatches;
    },
    refetchInterval: 60_000,
  });

  // Try to find match in allMatches, if not found, try dummy data
  let match = allMatches.find((m) => m.id === (id ?? ''));
  
  // If match not found, try loading from dummy data
  if (!match && id) {
    match = getMatchById(id);
  }

  interface DbMessage {
    id: string;
    match_id: string | null;
    user_id: string | null;
    username: string | null;
    avatar_url: string | null;
    content: string;
    created_at: string;
  }

  const { data: dbMessages = [] } = useQuery({
    queryKey: ['messages', id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await insforge.database
        .from('messages')
        .select('*')
        .eq('match_id', id)
        .order('created_at', { ascending: true });
      if (error) {
        console.error('Failed to load messages', error);
        // Fallback to dummy data
        return getCommentsByMatchId(id).map((c) => ({
          id: c.id,
          match_id: id,
          user_id: c.userId,
          username: c.username,
          avatar_url: c.avatar,
          content: c.message,
          created_at: c.timestamp,
        }));
      }
      // If no messages, use dummy data
      if (!data || data.length === 0) {
        return getCommentsByMatchId(id).map((c) => ({
          id: c.id,
          match_id: id,
          user_id: c.userId,
          username: c.username,
          avatar_url: c.avatar,
          content: c.message,
          created_at: c.timestamp,
        }));
      }
      return data as DbMessage[];
    },
    enabled: !!id,
    refetchInterval: 10000,
  });

  const mappedComments: Comment[] = dbMessages.map((m) => ({
    id: m.id,
    userId: m.user_id ?? 'anon',
    username: m.username ?? 'Cricket Fan',
    avatar:
      m.avatar_url ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
        m.username || 'fan',
      )}`,
    message: m.content,
    timestamp: m.created_at,
    reactions: [],
    matchId: m.match_id ?? undefined,
  }));

  // Get match polls - with dummy data fallback
  const matchPolls: Poll[] = id ? getPollsByMatchId(id) : [];
  
  const [message, setMessage] = useState('');
  const [localComments, setLocalComments] = useState<Comment[]>(mappedComments);
  const [prediction, setPrediction] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const renderFlag = (flag?: string) => {
    if (!flag) return null;
    if (flag.startsWith('http')) {
      return (
        <img
          src={flag}
          alt="team flag"
          className="w-10 h-10 rounded-full object-cover border border-white/10"
        />
      );
    }
    return <span className="text-5xl">{flag}</span>;
  };

  useEffect(() => {
    setLocalComments(mappedComments);
  }, [dbMessages.length]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localComments]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-muted-foreground text-lg">Loading match details...</p>
        </div>
      </MainLayout>
    );
  }

  if (!match) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Match Not Found</h1>
            <Link to="/matches" className="text-primary hover:underline">
              Back to Matches
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    const username =
      user?.name || user?.email?.split('@')[0] || 'Cricket Fan';
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      username,
    )}`;

    const optimistic: Comment = {
      id: `local-${Date.now()}`,
      userId: user?.id ?? 'anon',
      username,
      avatar: avatarUrl,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      reactions: [],
      matchId: id,
    };

    setLocalComments((prev) => [...prev, optimistic]);
    setMessage('');

    if (!id) return;

    const { error } = await insforge.database.from('messages').insert([
      {
        match_id: id,
        user_id: user?.id ?? null,
        username,
        avatar_url: avatarUrl,
        content: optimistic.message,
      },
    ]);

    if (error) {
      console.error('Failed to send message', error);
    } else {
      queryClient.invalidateQueries({ queryKey: ['messages', id] });
    }
  };

  const handlePrediction = () => {
    if (!prediction.trim()) return;
    // Just clear for demo
    setPrediction('');
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/matches"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Matches
        </Link>

        {/* Main Grid - 3 Columns on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Live Chat */}
          <div className="lg:col-span-4 order-2 lg:order-1">
            <div className="glass-card sticky top-24">
              <div className="p-4 border-b border-white/10">
                <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                  💬 LIVE CHAT
                  <span className="text-xs font-normal text-muted-foreground">
                    {localComments.length} messages
                  </span>
                </h3>
              </div>

              {/* Chat Messages */}
              <div className="h-[500px] overflow-y-auto scrollbar-hide p-2">
                {localComments.map((comment, idx) => (
                  <ChatMessage key={comment.id} comment={comment} index={idx} />
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="input-field flex-1"
                  />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSendMessage}
                    className="btn-primary px-4"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Center Column - Match Info */}
          <div className="lg:col-span-4 order-1 lg:order-2 space-y-6">
            {/* Scoreboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 relative overflow-hidden"
            >
              {/* Live Badge */}
              {match.status === 'live' && (
                <div className="absolute top-4 right-4">
                  <div className="badge-live">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    LIVE
                  </div>
                </div>
              )}

              {/* Match Type */}
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
                {match.matchType} • WC 2026
              </p>

              {/* Teams & Scores */}
              <div className="space-y-6">
                {/* Team 1 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {renderFlag(match.team1.flag)}
                    <div>
                      <p className="font-display text-2xl font-bold text-white">{match.team1.name}</p>
                      <p className="text-sm text-muted-foreground">{match.team1.shortName}</p>
                    </div>
                  </div>
                  {match.team1.score && (
                    <div className="text-right">
                      <p className="font-display text-3xl font-bold text-white">{match.team1.score}</p>
                      <p className="text-sm text-muted-foreground">{match.team1.overs} overs</p>
                    </div>
                  )}
                </div>

                {/* VS */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-white/10"></div>
                  <span className="font-display text-lg font-bold text-muted-foreground">VS</span>
                  <div className="flex-1 h-px bg-white/10"></div>
                </div>

                {/* Team 2 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {renderFlag(match.team2.flag)}
                    <div>
                      <p className="font-display text-2xl font-bold text-white">{match.team2.name}</p>
                      <p className="text-sm text-muted-foreground">{match.team2.shortName}</p>
                    </div>
                  </div>
                  {match.team2.score && (
                    <div className="text-right">
                      <p className="font-display text-3xl font-bold text-white">{match.team2.score}</p>
                      <p className="text-sm text-muted-foreground">{match.team2.overs} overs</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Match Info */}
              <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{match.venue}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{match.date} • {match.time}</span>
                </div>
                {match.runRate && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span>Run Rate: {match.runRate}</span>
                  </div>
                )}
                {match.toss && (
                  <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                    <Trophy className="w-4 h-4" />
                    <span className="truncate">{match.toss}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Reaction Bar */}
            <ReactionBar matchId={id} />

            {/* Quick Stats */}
            <div className="glass-card p-4">
              <h4 className="font-semibold text-white mb-4">Quick Stats</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-white">{match.team1.score?.split('/')[0] || '0'}</p>
                  <p className="text-xs text-muted-foreground">Total Runs</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-white">{match.team1.score?.split('/')[1] || '0'}</p>
                  <p className="text-xs text-muted-foreground">Wickets</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-white">{match.runRate || 'N/A'}</p>
                  <p className="text-xs text-muted-foreground">Run Rate</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-white">{match.team1.overs || 'N/A'}</p>
                  <p className="text-xs text-muted-foreground">Overs</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Polls & Predictions */}
          <div className="lg:col-span-4 order-3 space-y-6">
            {/* Match Polls */}
            <div className="glass-card p-4">
              <h3 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
                📊 MATCH POLLS
              </h3>
              <div className="space-y-4">
                {matchPolls.length > 0 ? (
                  matchPolls.map((poll, idx) => (
                    <PollCard key={poll.id} poll={poll} index={idx} compact />
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No polls for this match yet</p>
                )}
              </div>
            </div>

            {/* Score Prediction */}
            <div className="glass-card p-4">
              <h3 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
                🎯 PREDICT THE SCORE
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Guess the final score and win points!
              </p>
              <div className="space-y-4">
                <input
                  type="text"
                  value={prediction}
                  onChange={(e) => setPrediction(e.target.value)}
                  placeholder="e.g., 320/6"
                  className="input-field w-full"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrediction}
                  className="btn-primary w-full"
                >
                  Submit Prediction
                </motion.button>
              </div>

              {/* Win Probability */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-sm text-muted-foreground mb-3">Win Probability</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white">{match.team1.shortName}</span>
                    <span className="font-bold text-cricket-green">68%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '68%' }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-cricket-green to-green-400 rounded-full"
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white">{match.team2.shortName}</span>
                    <span className="font-bold text-red-400">32%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '32%' }}
                      transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Active Viewers */}
            <div className="glass-card p-4">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <img
                      key={i}
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`}
                      alt=""
                      className="w-8 h-8 rounded-full border-2 border-background"
                    />
                  ))}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">12,456 watching</p>
                  <p className="text-xs text-muted-foreground">Join the conversation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Chat Component */}
      {id && <LiveChat matchId={id} />}
    </MainLayout>
  );
};

export default MatchDetail;