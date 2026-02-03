export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  points: number;
  rank: number;
  badges: Badge[];
  commentsCount: number;
  votesCount: number;
  predictionsCorrect: number;
  predictionsTotal: number;
  joinedAt: string;
}

export const badges: Badge[] = [
  { id: 'b1', name: 'Cricket Legend', icon: '🏆', description: 'Top 10 in leaderboard' },
  { id: 'b2', name: 'Prediction Master', icon: '🎯', description: '10+ correct predictions' },
  { id: 'b3', name: 'Social Star', icon: '⭐', description: '100+ comments' },
  { id: 'b4', name: 'Early Bird', icon: '🐦', description: 'Joined during launch week' },
  { id: 'b5', name: 'Poll Warrior', icon: '📊', description: '50+ poll votes' },
  { id: 'b6', name: 'Superfan', icon: '❤️', description: 'Active for 7 consecutive days' },
];

export const users: User[] = [
  {
    id: 'u1',
    username: 'CricketKing',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=King',
    points: 15420,
    rank: 1,
    badges: [badges[0], badges[1], badges[2], badges[5]],
    commentsCount: 342,
    votesCount: 189,
    predictionsCorrect: 24,
    predictionsTotal: 31,
    joinedAt: '2026-01-15',
  },
  {
    id: 'u2',
    username: 'BleedBlue2026',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Blue',
    points: 12890,
    rank: 2,
    badges: [badges[0], badges[2], badges[4]],
    commentsCount: 287,
    votesCount: 156,
    predictionsCorrect: 18,
    predictionsTotal: 28,
    joinedAt: '2026-01-16',
  },
  {
    id: 'u3',
    username: 'AussieMatey',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aussie',
    points: 11245,
    rank: 3,
    badges: [badges[0], badges[1], badges[3]],
    commentsCount: 198,
    votesCount: 234,
    predictionsCorrect: 21,
    predictionsTotal: 29,
    joinedAt: '2026-01-14',
  },
  {
    id: 'u4',
    username: 'SixerMaster',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sixer',
    points: 9876,
    rank: 4,
    badges: [badges[1], badges[4], badges[5]],
    commentsCount: 156,
    votesCount: 278,
    predictionsCorrect: 19,
    predictionsTotal: 25,
    joinedAt: '2026-01-18',
  },
  {
    id: 'u5',
    username: 'BoundaryBoss',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Boundary',
    points: 8654,
    rank: 5,
    badges: [badges[2], badges[3]],
    commentsCount: 234,
    votesCount: 145,
    predictionsCorrect: 12,
    predictionsTotal: 22,
    joinedAt: '2026-01-14',
  },
  {
    id: 'u6',
    username: 'WicketWizard',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wizard',
    points: 7432,
    rank: 6,
    badges: [badges[4], badges[5]],
    commentsCount: 123,
    votesCount: 198,
    predictionsCorrect: 15,
    predictionsTotal: 24,
    joinedAt: '2026-01-20',
  },
  {
    id: 'u7',
    username: 'PitchPro',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pitch',
    points: 6789,
    rank: 7,
    badges: [badges[1], badges[3]],
    commentsCount: 98,
    votesCount: 167,
    predictionsCorrect: 16,
    predictionsTotal: 21,
    joinedAt: '2026-01-14',
  },
  {
    id: 'u8',
    username: 'CricketNerd',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nerd',
    points: 5987,
    rank: 8,
    badges: [badges[2]],
    commentsCount: 178,
    votesCount: 89,
    predictionsCorrect: 9,
    predictionsTotal: 18,
    joinedAt: '2026-01-22',
  },
  {
    id: 'u9',
    username: 'SpinKing',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Spin',
    points: 5234,
    rank: 9,
    badges: [badges[4]],
    commentsCount: 67,
    votesCount: 189,
    predictionsCorrect: 11,
    predictionsTotal: 19,
    joinedAt: '2026-01-25',
  },
  {
    id: 'u10',
    username: 'PacerFan',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pacer',
    points: 4876,
    rank: 10,
    badges: [badges[5]],
    commentsCount: 89,
    votesCount: 123,
    predictionsCorrect: 8,
    predictionsTotal: 16,
    joinedAt: '2026-01-26',
  },
];

export const currentUser: User = {
  id: 'current',
  username: 'CricketFan99',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  points: 3420,
  rank: 24,
  badges: [badges[3], badges[5]],
  commentsCount: 45,
  votesCount: 78,
  predictionsCorrect: 6,
  predictionsTotal: 12,
  joinedAt: '2026-01-28',
};

export const getTopUsers = (limit: number = 10): User[] => {
  return [...users].sort((a, b) => b.points - a.points).slice(0, limit);
};

export const getUserById = (id: string): User | undefined => {
  if (id === 'current') return currentUser;
  return users.find(user => user.id === id);
};