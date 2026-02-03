export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  matchId?: string;
  status: 'active' | 'closed';
  createdAt: string;
  endsAt: string;
  category: 'match' | 'player' | 'prediction' | 'fun';
}

export const polls: Poll[] = [
  {
    id: '1',
    question: 'Who will win the India vs Australia match?',
    options: [
      { id: '1a', text: 'India 🇮🇳', votes: 4521 },
      { id: '1b', text: 'Australia 🇦🇺', votes: 2134 },
      { id: '1c', text: 'Draw/No Result', votes: 345 },
    ],
    totalVotes: 7000,
    matchId: '1',
    status: 'active',
    createdAt: '2026-02-03T08:00:00Z',
    endsAt: '2026-02-03T18:00:00Z',
    category: 'match',
  },
  {
    id: '2',
    question: 'Who will be Player of the Match?',
    options: [
      { id: '2a', text: 'Virat Kohli', votes: 3245 },
      { id: '2b', text: 'Jasprit Bumrah', votes: 2890 },
      { id: '2c', text: 'Pat Cummins', votes: 1567 },
      { id: '2d', text: 'Steve Smith', votes: 1298 },
    ],
    totalVotes: 9000,
    matchId: '1',
    status: 'active',
    createdAt: '2026-02-03T08:00:00Z',
    endsAt: '2026-02-03T18:00:00Z',
    category: 'player',
  },
  {
    id: '3',
    question: 'How many runs in the next over?',
    options: [
      { id: '3a', text: '0-5 runs', votes: 1234 },
      { id: '3b', text: '6-10 runs', votes: 2567 },
      { id: '3c', text: '11-15 runs', votes: 890 },
      { id: '3d', text: '16+ runs', votes: 309 },
    ],
    totalVotes: 5000,
    matchId: '1',
    status: 'active',
    createdAt: '2026-02-03T12:00:00Z',
    endsAt: '2026-02-03T12:10:00Z',
    category: 'prediction',
  },
  {
    id: '4',
    question: 'Best cricket celebration of all time?',
    options: [
      { id: '4a', text: 'Shoaib Akhtar Run', votes: 4567 },
      { id: '4b', text: 'Chris Gayle Dance', votes: 3456 },
      { id: '4c', text: 'Kohli Aggression', votes: 5678 },
      { id: '4d', text: 'Dhoni Helicopter', votes: 6789 },
    ],
    totalVotes: 20490,
    status: 'active',
    createdAt: '2026-02-01T00:00:00Z',
    endsAt: '2026-02-28T23:59:59Z',
    category: 'fun',
  },
  {
    id: '5',
    question: 'Which team will lift the WC 2026 trophy?',
    options: [
      { id: '5a', text: 'India 🇮🇳', votes: 15234 },
      { id: '5b', text: 'Australia 🇦🇺', votes: 8567 },
      { id: '5c', text: 'England 🏴󠁧󠁢󠁥󠁮󠁧󠁿', votes: 7890 },
      { id: '5d', text: 'Other', votes: 4309 },
    ],
    totalVotes: 36000,
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
    endsAt: '2026-03-15T23:59:59Z',
    category: 'prediction',
  },
  {
    id: '6',
    question: 'England vs SA - Final Score?',
    options: [
      { id: '6a', text: 'ENG wins by 50+ runs', votes: 2345 },
      { id: '6b', text: 'ENG wins by < 50 runs', votes: 1890 },
      { id: '6c', text: 'SA wins', votes: 3456 },
    ],
    totalVotes: 7691,
    matchId: '2',
    status: 'active',
    createdAt: '2026-02-03T08:00:00Z',
    endsAt: '2026-02-03T20:00:00Z',
    category: 'match',
  },
  {
    id: '7',
    question: 'Who will score the most runs today?',
    options: [
      { id: '7a', text: 'Virat Kohli', votes: 5234 },
      { id: '7b', text: 'Rohit Sharma', votes: 4123 },
      { id: '7c', text: 'Steve Smith', votes: 3456 },
      { id: '7d', text: 'David Warner', votes: 2987 },
    ],
    totalVotes: 15800,
    matchId: '1',
    status: 'active',
    createdAt: '2026-02-03T09:00:00Z',
    endsAt: '2026-02-03T18:00:00Z',
    category: 'player',
  },
  {
    id: '8',
    question: 'Will there be a century in this match?',
    options: [
      { id: '8a', text: 'Yes', votes: 6789 },
      { id: '8b', text: 'No', votes: 3210 },
    ],
    totalVotes: 9999,
    matchId: '1',
    status: 'active',
    createdAt: '2026-02-03T08:30:00Z',
    endsAt: '2026-02-03T18:00:00Z',
    category: 'prediction',
  },
  {
    id: '9',
    question: 'Best bowling performance of WC 2026 so far?',
    options: [
      { id: '9a', text: 'Bumrah 5/28', votes: 4567 },
      { id: '9b', text: 'Rabada 4/32', votes: 3456 },
      { id: '9c', text: 'Starc 4/45', votes: 2345 },
      { id: '9d', text: 'Shaheen 3/19', votes: 1890 },
    ],
    totalVotes: 12258,
    status: 'active',
    createdAt: '2026-02-02T00:00:00Z',
    endsAt: '2026-03-15T23:59:59Z',
    category: 'fun',
  },
  {
    id: '10',
    question: 'Which team will top Group A?',
    options: [
      { id: '10a', text: 'India', votes: 12345 },
      { id: '10b', text: 'Australia', votes: 8765 },
      { id: '10c', text: 'Pakistan', votes: 5432 },
      { id: '10d', text: 'New Zealand', votes: 4321 },
    ],
    totalVotes: 30863,
    status: 'active',
    createdAt: '2026-01-15T00:00:00Z',
    endsAt: '2026-02-20T23:59:59Z',
    category: 'prediction',
  },
];

export const getPollsByMatchId = (matchId: string): Poll[] => {
  return polls.filter(poll => poll.matchId === matchId);
};

export const getActivePolls = (): Poll[] => {
  return polls.filter(poll => poll.status === 'active');
};

export const getTrendingPolls = (): Poll[] => {
  return [...polls].sort((a, b) => b.totalVotes - a.totalVotes).slice(0, 5);
};