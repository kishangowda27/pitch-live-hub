import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '@/layouts/MainLayout';
import { MatchCard } from '@/components/MatchCard';
import { LeaderboardRow } from '@/components/LeaderboardRow';
import { getTopUsers } from '@/data/users';
import { fetchPlayers, fetchSeriesInfo, findT20WorldCupSeries } from '@/services/api';
import { motion } from 'framer-motion';
import { CalendarDays, Users, Globe2, ArrowRight } from 'lucide-react';

// Dummy series info
const getDummySeriesInfo = () => ({
  info: {
    id: '1',
    name: 'ICC Men\'s T20 World Cup 2026',
    startdate: '2026-02-01',
    enddate: '2026-03-15',
    odi: 0,
    t20: 48,
    test: 0,
    squads: 20,
    matches: 48,
  },
  matchList: [
    {
      id: 'wc1',
      name: 'India vs Australia',
      matchType: 'T20',
      status: 'Match not started',
      venue: 'Melbourne Cricket Ground',
      date: '2026-02-05',
      dateTimeGMT: '2026-02-05T08:00:00Z',
      teams: ['India', 'Australia'],
      fantasyEnabled: true,
    },
    {
      id: 'wc2',
      name: 'England vs South Africa',
      matchType: 'T20',
      status: 'Match not started',
      venue: 'Lords Cricket Ground',
      date: '2026-02-06',
      dateTimeGMT: '2026-02-06T08:00:00Z',
      teams: ['England', 'South Africa'],
      fantasyEnabled: true,
    },
    {
      id: 'wc3',
      name: 'Pakistan vs New Zealand',
      matchType: 'T20',
      status: 'Match not started',
      venue: 'Eden Gardens',
      date: '2026-02-07',
      dateTimeGMT: '2026-02-07T08:00:00Z',
      teams: ['Pakistan', 'New Zealand'],
      fantasyEnabled: true,
    },
    {
      id: 'wc4',
      name: 'West Indies vs Sri Lanka',
      matchType: 'T20',
      status: 'Match not started',
      venue: 'Wankhede Stadium',
      date: '2026-02-08',
      dateTimeGMT: '2026-02-08T08:00:00Z',
      teams: ['West Indies', 'Sri Lanka'],
      fantasyEnabled: true,
    },
  ],
});

// Dummy team players
const getDummyTeamPlayers = (team: string) => {
  const teamPlayers: Record<string, Array<{ id: string; name: string; country: string }>> = {
    'India': [
      { id: 'p1', name: 'Virat Kohli', country: 'India' },
      { id: 'p2', name: 'Rohit Sharma', country: 'India' },
      { id: 'p3', name: 'Jasprit Bumrah', country: 'India' },
      { id: 'p4', name: 'Rishabh Pant', country: 'India' },
      { id: 'p5', name: 'Hardik Pandya', country: 'India' },
    ],
    'Australia': [
      { id: 'p6', name: 'Pat Cummins', country: 'Australia' },
      { id: 'p7', name: 'Steve Smith', country: 'Australia' },
      { id: 'p8', name: 'David Warner', country: 'Australia' },
      { id: 'p9', name: 'Glenn Maxwell', country: 'Australia' },
      { id: 'p10', name: 'Mitchell Starc', country: 'Australia' },
    ],
    'England': [
      { id: 'p11', name: 'Ben Stokes', country: 'England' },
      { id: 'p12', name: 'Joe Root', country: 'England' },
      { id: 'p13', name: 'Jos Buttler', country: 'England' },
      { id: 'p14', name: 'Jofra Archer', country: 'England' },
      { id: 'p15', name: 'Jonny Bairstow', country: 'England' },
    ],
    'South Africa': [
      { id: 'p16', name: 'Quinton de Kock', country: 'South Africa' },
      { id: 'p17', name: 'Kagiso Rabada', country: 'South Africa' },
      { id: 'p18', name: 'Aiden Markram', country: 'South Africa' },
      { id: 'p19', name: 'David Miller', country: 'South Africa' },
      { id: 'p20', name: 'Anrich Nortje', country: 'South Africa' },
    ],
  };
  return teamPlayers[team] || [];
};

const T20WorldCup = () => {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const topUsers = getTopUsers(5);

  const { data: series, isLoading: seriesLoading, isError: seriesError } = useQuery({
    queryKey: ['t20wcSeries'],
    queryFn: async () => {
      try {
        const data = await findT20WorldCupSeries();
        if (data) return data;
        // Fallback to dummy series
        return {
          id: '1',
          name: 'ICC Men\'s T20 World Cup 2026',
          startDate: '2026-02-01',
          endDate: '2026-03-15',
          odi: 0,
          t20: 48,
          test: 0,
          squads: 20,
          matches: 48,
        };
      } catch (error) {
        console.error('Failed to fetch T20 WC series, using dummy data', error);
        return {
          id: '1',
          name: 'ICC Men\'s T20 World Cup 2026',
          startDate: '2026-02-01',
          endDate: '2026-03-15',
          odi: 0,
          t20: 48,
          test: 0,
          squads: 20,
          matches: 48,
        };
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const seriesId = series?.id;

  const { data: seriesInfo, isLoading: infoLoading, isError: infoError } = useQuery({
    queryKey: ['t20wcSeriesInfo', seriesId],
    queryFn: async () => {
      try {
        const data = await fetchSeriesInfo(seriesId!);
        if (data) return data;
        // Fallback to dummy series info
        return getDummySeriesInfo();
      } catch (error) {
        console.error('Failed to fetch series info, using dummy data', error);
        return getDummySeriesInfo();
      }
    },
    enabled: !!seriesId,
    staleTime: 5 * 60 * 1000,
  });

  const teams = useMemo(() => {
    if (!seriesInfo) return [];
    const set = new Set<string>();
    seriesInfo.matchList.forEach((m) => {
      m.teams.forEach((t) => set.add(t));
    });
    return Array.from(set).sort();
  }, [seriesInfo]);

  const { data: selectedTeamPlayers = [], isLoading: playersLoading } = useQuery({
    queryKey: ['t20wcPlayers', selectedTeam],
    queryFn: async () => {
      try {
        const data = await fetchPlayers(0, selectedTeam || undefined);
        if (data.length > 0) return data;
        // Fallback to dummy players for selected team
        return getDummyTeamPlayers(selectedTeam!);
      } catch (error) {
        console.error('Failed to fetch players, using dummy data', error);
        return getDummyTeamPlayers(selectedTeam!);
      }
    },
    enabled: !!selectedTeam,
  });

  const loading = seriesLoading || infoLoading;
  const hasError = seriesError || infoError;

  return (
    <MainLayout>
      <section className="pt-12 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-2">
              T20 <span className="text-gradient-primary">World Cup Hub</span>
            </h1>
            {series && (
              <p className="text-muted-foreground flex items-center gap-2 text-sm">
                <CalendarDays className="w-4 h-4" />
                <span>
                  {series.name} • {series.startDate} – {series.endDate}
                </span>
              </p>
            )}
            <p className="text-muted-foreground mt-2 max-w-xl">
              See participating teams, their squads, fixtures, and jump into live scorecards.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">Loading T20 World Cup details...</p>
          </div>
        ) : hasError ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              Unable to load T20 World Cup data from CricAPI right now. Please try again in a bit.
            </p>
          </div>
        ) : !series ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              No World Cup series found in the API. Configure a T20 World Cup series first.
            </p>
          </div>
        ) : !seriesInfo ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              World Cup series found, but detailed fixtures are not available yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Fixtures */}
            <div className="xl:col-span-7 space-y-4">
              <h2 className="font-display text-2xl font-bold text-white mb-2">
                Fixtures &amp; Matchups
              </h2>
              <p className="text-xs text-muted-foreground mb-3">
                All fixtures are T20 matches. Click a card to view full scoreboard and commentary.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {seriesInfo.matchList.map((m, idx) => (
                  <MatchCard
                    key={m.id}
                    match={{
                      id: m.id,
                      team1: {
                        name: m.teams[0] || 'Team 1',
                        shortName: (m.teams[0] || 'T1').slice(0, 3).toUpperCase(),
                        flag: '',
                      },
                      team2: {
                        name: m.teams[1] || 'Team 2',
                        shortName: (m.teams[1] || 'T2').slice(0, 3).toUpperCase(),
                        flag: '',
                      },
                      status:
                        m.status === 'Match not started'
                          ? 'upcoming'
                          : m.status.toLowerCase().includes('won') ||
                            m.status.toLowerCase().includes('tie') ||
                            m.status.toLowerCase().includes('no result')
                          ? 'completed'
                          : 'live',
                      venue: m.venue,
                      date: m.date,
                      time: '',
                      matchType: m.matchType.toUpperCase(),
                      result:
                        m.status === 'Match not started' ? undefined : m.status,
                    }}
                    index={idx}
                  />
                ))}
              </div>
            </div>

            {/* Teams & Players */}
            <div className="xl:col-span-5 space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-display text-2xl font-bold text-white">
                  Teams &amp; Squads
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {teams.map((team) => (
                  <button
                    key={team}
                    onClick={() => setSelectedTeam(team)}
                    className={`glass-card p-3 text-left text-xs sm:text-sm flex items-center justify-between gap-2 border transition-all ${
                      selectedTeam === team
                        ? 'border-primary/60 bg-primary/10'
                        : 'border-white/5 hover:border-primary/40 hover:bg-white/5'
                    }`}
                  >
                    <span className="truncate">{team}</span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                  </button>
                ))}
              </div>

              <div className="glass-card p-4 h-[320px] flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-cricket-blue" />
                    <h3 className="font-semibold text-white text-sm">
                      {selectedTeam ? `${selectedTeam} Squad` : 'Select a team'}
                    </h3>
                  </div>
                  {selectedTeam && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Globe2 className="w-3 h-3" />
                      <span>From CricAPI players list</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-hide">
                  {!selectedTeam ? (
                    <p className="text-xs text-muted-foreground">
                      Tap on a team card above to see its players.
                    </p>
                  ) : playersLoading ? (
                    <p className="text-xs text-muted-foreground">Loading players...</p>
                  ) : selectedTeamPlayers.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      No players found for this team yet.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {selectedTeamPlayers.map((p) => (
                        <li
                          key={p.id}
                          className="flex items-center justify-between text-xs text-muted-foreground bg-white/5 rounded-lg px-3 py-2"
                        >
                          <span className="truncate text-white">{p.name}</span>
                          <span className="ml-2 opacity-70">{p.country}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* World Cup Leaderboard (reusing global leaderboard data for now) */}
              <div className="glass-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display text-lg font-bold text-white">
                    T20 WC Leaderboard
                  </h3>
                  <span className="text-[11px] text-muted-foreground uppercase tracking-wide">
                    Top Early Supporters
                  </span>
                </div>
                <div className="space-y-2">
                  {topUsers.map((user, idx) => (
                    <LeaderboardRow key={user.id} user={user} index={idx} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </MainLayout>
  );
};

export default T20WorldCup;

