export interface Team {
  name: string;
  shortName: string;
  flag: string;
  score?: string;
  overs?: string;
}

export interface Match {
  id: string;
  team1: Team;
  team2: Team;
  status: 'live' | 'upcoming' | 'completed';
  venue: string;
  date: string;
  time: string;
  matchType: string;
  result?: string;
  toss?: string;
  runRate?: string;
}

export const matches: Match[] = [
  {
    id: '1',
    team1: { name: 'India', shortName: 'IND', flag: '🇮🇳', score: '287/4', overs: '42.3' },
    team2: { name: 'Australia', shortName: 'AUS', flag: '🇦🇺', score: '156/10', overs: '38.2' },
    status: 'live',
    venue: 'Melbourne Cricket Ground',
    date: '2026-02-03',
    time: '14:00',
    matchType: 'Group A',
    toss: 'India won the toss and elected to bat',
    runRate: '6.75',
  },
  {
    id: '2',
    team1: { name: 'England', shortName: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', score: '312/6', overs: '50.0' },
    team2: { name: 'South Africa', shortName: 'SA', flag: '🇿🇦', score: '198/5', overs: '32.4' },
    status: 'live',
    venue: 'Lords Cricket Ground',
    date: '2026-02-03',
    time: '10:00',
    matchType: 'Group B',
    toss: 'South Africa won the toss and elected to field',
    runRate: '6.07',
  },
  {
    id: '3',
    team1: { name: 'Pakistan', shortName: 'PAK', flag: '🇵🇰' },
    team2: { name: 'New Zealand', shortName: 'NZ', flag: '🇳🇿' },
    status: 'upcoming',
    venue: 'Eden Gardens, Kolkata',
    date: '2026-02-04',
    time: '09:30',
    matchType: 'Group A',
  },
  {
    id: '4',
    team1: { name: 'West Indies', shortName: 'WI', flag: '🏝️' },
    team2: { name: 'Sri Lanka', shortName: 'SL', flag: '🇱🇰' },
    status: 'upcoming',
    venue: 'Wankhede Stadium, Mumbai',
    date: '2026-02-04',
    time: '14:00',
    matchType: 'Group B',
  },
  {
    id: '5',
    team1: { name: 'Bangladesh', shortName: 'BAN', flag: '🇧🇩', score: '245/10', overs: '48.3' },
    team2: { name: 'Afghanistan', shortName: 'AFG', flag: '🇦🇫', score: '248/7', overs: '47.1' },
    status: 'completed',
    venue: 'Dubai International Stadium',
    date: '2026-02-02',
    time: '14:00',
    matchType: 'Group C',
    result: 'Afghanistan won by 3 wickets',
  },
  {
    id: '6',
    team1: { name: 'Netherlands', shortName: 'NED', flag: '🇳🇱', score: '189/10', overs: '44.2' },
    team2: { name: 'Zimbabwe', shortName: 'ZIM', flag: '🇿🇼', score: '190/4', overs: '36.5' },
    status: 'completed',
    venue: 'Harare Sports Club',
    date: '2026-02-01',
    time: '10:00',
    matchType: 'Qualifier',
    result: 'Zimbabwe won by 6 wickets',
  },
  {
    id: '7',
    team1: { name: 'India', shortName: 'IND', flag: '🇮🇳' },
    team2: { name: 'England', shortName: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    status: 'upcoming',
    venue: 'Wankhede Stadium, Mumbai',
    date: '2026-02-05',
    time: '19:30',
    matchType: 'Group A',
  },
  {
    id: '8',
    team1: { name: 'Australia', shortName: 'AUS', flag: '🇦🇺' },
    team2: { name: 'New Zealand', shortName: 'NZ', flag: '🇳🇿' },
    status: 'upcoming',
    venue: 'Sydney Cricket Ground',
    date: '2026-02-06',
    time: '14:00',
    matchType: 'Group B',
  },
  {
    id: '9',
    team1: { name: 'Pakistan', shortName: 'PAK', flag: '🇵🇰', score: '245/8', overs: '50.0' },
    team2: { name: 'Bangladesh', shortName: 'BAN', flag: '🇧🇩', score: '198/10', overs: '45.3' },
    status: 'completed',
    venue: 'Gaddafi Stadium, Lahore',
    date: '2026-02-01',
    time: '14:00',
    matchType: 'Group C',
    result: 'Pakistan won by 47 runs',
  },
  {
    id: '10',
    team1: { name: 'South Africa', shortName: 'SA', flag: '🇿🇦', score: '312/6', overs: '50.0' },
    team2: { name: 'West Indies', shortName: 'WI', flag: '🏝️', score: '289/9', overs: '50.0' },
    status: 'completed',
    venue: 'Newlands, Cape Town',
    date: '2026-01-31',
    time: '13:00',
    matchType: 'Group B',
    result: 'South Africa won by 23 runs',
  },
  {
    id: '11',
    team1: { name: 'Sri Lanka', shortName: 'SL', flag: '🇱🇰', score: '156/3', overs: '28.4' },
    team2: { name: 'Afghanistan', shortName: 'AFG', flag: '🇦🇫', score: '152/10', overs: '42.1' },
    status: 'live',
    venue: 'R. Premadasa Stadium, Colombo',
    date: '2026-02-03',
    time: '10:00',
    matchType: 'Group D',
    toss: 'Afghanistan won the toss and elected to bat',
    runRate: '5.48',
  },
  {
    id: '12',
    team1: { name: 'Ireland', shortName: 'IRE', flag: '🇮🇪' },
    team2: { name: 'Scotland', shortName: 'SCO', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
    status: 'upcoming',
    venue: 'Malahide Cricket Club, Dublin',
    date: '2026-02-07',
    time: '11:00',
    matchType: 'Qualifier',
  },
];

export const getMatchById = (id: string): Match | undefined => {
  return matches.find(match => match.id === id);
};

export const getLiveMatches = (): Match[] => {
  return matches.filter(match => match.status === 'live');
};

export const getUpcomingMatches = (): Match[] => {
  return matches.filter(match => match.status === 'upcoming');
};

export const getCompletedMatches = (): Match[] => {
  return matches.filter(match => match.status === 'completed');
};