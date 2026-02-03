export interface Reaction {
  emoji: string;
  count: number;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  message: string;
  timestamp: string;
  reactions: Reaction[];
  matchId?: string;
}

export const comments: Comment[] = [
  {
    id: '1',
    userId: 'u1',
    username: 'CricketFan99',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    message: 'What a shot by Kohli! 🔥 This is world-class batting!',
    timestamp: '2026-02-03T14:32:00Z',
    reactions: [
      { emoji: '🔥', count: 45 },
      { emoji: '👏', count: 32 },
      { emoji: '❤️', count: 18 },
    ],
    matchId: '1',
  },
  {
    id: '2',
    userId: 'u2',
    username: 'AussieSupporter',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dusty',
    message: 'Cummins needs to step up here. Come on boys! 🇦🇺',
    timestamp: '2026-02-03T14:30:00Z',
    reactions: [
      { emoji: '💪', count: 28 },
      { emoji: '🇦🇺', count: 15 },
    ],
    matchId: '1',
  },
  {
    id: '3',
    userId: 'u3',
    username: 'SportsAnalyst',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    message: 'Run rate is climbing! India looking comfortable at 6.75 RPO',
    timestamp: '2026-02-03T14:28:00Z',
    reactions: [
      { emoji: '📊', count: 22 },
      { emoji: '🧠', count: 11 },
    ],
    matchId: '1',
  },
  {
    id: '4',
    userId: 'u4',
    username: 'BleedBlue',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Whiskers',
    message: 'Bumrah is just unstoppable! 5 wickets already! 🎯',
    timestamp: '2026-02-03T14:25:00Z',
    reactions: [
      { emoji: '🎯', count: 67 },
      { emoji: '🔥', count: 54 },
      { emoji: '👑', count: 41 },
    ],
    matchId: '1',
  },
  {
    id: '5',
    userId: 'u5',
    username: 'CricketPundit',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky',
    message: 'This pitch is offering something for everyone. Great contest!',
    timestamp: '2026-02-03T14:22:00Z',
    reactions: [
      { emoji: '🏏', count: 19 },
      { emoji: '👀', count: 8 },
    ],
    matchId: '1',
  },
  {
    id: '6',
    userId: 'u6',
    username: 'TeamIndia',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pepper',
    message: 'India dominating this match! Semi-finals here we come! 🇮🇳🏆',
    timestamp: '2026-02-03T14:20:00Z',
    reactions: [
      { emoji: '🇮🇳', count: 89 },
      { emoji: '🏆', count: 45 },
      { emoji: '❤️', count: 32 },
    ],
    matchId: '1',
  },
  {
    id: '7',
    userId: 'u7',
    username: 'NeutralFan',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sammy',
    message: 'Best match of the tournament so far! Great entertainment 🎉',
    timestamp: '2026-02-03T14:18:00Z',
    reactions: [
      { emoji: '🎉', count: 56 },
      { emoji: '💯', count: 23 },
    ],
    matchId: '1',
  },
  {
    id: '8',
    userId: 'u8',
    username: 'MCGFan',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oscar',
    message: 'The atmosphere at MCG is ELECTRIC right now! ⚡',
    timestamp: '2026-02-03T14:15:00Z',
    reactions: [
      { emoji: '⚡', count: 78 },
      { emoji: '🏟️', count: 34 },
    ],
    matchId: '1',
  },
  {
    id: '9',
    userId: 'u9',
    username: 'CricketLover',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lover',
    message: 'This is going to be a close finish! Both teams playing brilliantly! 🎯',
    timestamp: '2026-02-03T14:10:00Z',
    reactions: [
      { emoji: '🎯', count: 42 },
      { emoji: '👏', count: 28 },
    ],
    matchId: '1',
  },
  {
    id: '10',
    userId: 'u10',
    username: 'MatchWatcher',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Watcher',
    message: 'Can\'t believe that catch! Absolutely stunning! 🤯',
    timestamp: '2026-02-03T14:05:00Z',
    reactions: [
      { emoji: '🤯', count: 89 },
      { emoji: '🔥', count: 56 },
    ],
    matchId: '1',
  },
  {
    id: '11',
    userId: 'u11',
    username: 'EngSupporter',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eng',
    message: 'England looking strong! Root is in great form! 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    timestamp: '2026-02-03T13:55:00Z',
    reactions: [
      { emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', count: 34 },
      { emoji: '💪', count: 22 },
    ],
    matchId: '2',
  },
  {
    id: '12',
    userId: 'u12',
    username: 'SACricketFan',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SA',
    message: 'Rabada on fire! What a spell! 🔥🇿🇦',
    timestamp: '2026-02-03T13:50:00Z',
    reactions: [
      { emoji: '🔥', count: 67 },
      { emoji: '🇿🇦', count: 45 },
    ],
    matchId: '2',
  },
];

export const getCommentsByMatchId = (matchId: string): Comment[] => {
  return comments.filter(comment => comment.matchId === matchId);
};

export const getTrendingComments = (): Comment[] => {
  return [...comments]
    .sort((a, b) => {
      const aTotal = a.reactions.reduce((sum, r) => sum + r.count, 0);
      const bTotal = b.reactions.reduce((sum, r) => sum + r.count, 0);
      return bTotal - aTotal;
    })
    .slice(0, 5);
};