import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '@/layouts/MainLayout';
import { fetchPlayers } from '@/services/api';
import { motion } from 'framer-motion';
import { Search, UserCircle2, Globe2 } from 'lucide-react';

// Dummy players data
const getDummyPlayers = (offset: number) => {
  const allPlayers = [
    { id: '1', name: 'Virat Kohli', country: 'India' },
    { id: '2', name: 'Rohit Sharma', country: 'India' },
    { id: '3', name: 'Jasprit Bumrah', country: 'India' },
    { id: '4', name: 'Pat Cummins', country: 'Australia' },
    { id: '5', name: 'Steve Smith', country: 'Australia' },
    { id: '6', name: 'David Warner', country: 'Australia' },
    { id: '7', name: 'Ben Stokes', country: 'England' },
    { id: '8', name: 'Joe Root', country: 'England' },
    { id: '9', name: 'Jos Buttler', country: 'England' },
    { id: '10', name: 'Babar Azam', country: 'Pakistan' },
    { id: '11', name: 'Shaheen Afridi', country: 'Pakistan' },
    { id: '12', name: 'Mohammad Rizwan', country: 'Pakistan' },
    { id: '13', name: 'Kane Williamson', country: 'New Zealand' },
    { id: '14', name: 'Trent Boult', country: 'New Zealand' },
    { id: '15', name: 'Glenn Phillips', country: 'New Zealand' },
    { id: '16', name: 'Quinton de Kock', country: 'South Africa' },
    { id: '17', name: 'Kagiso Rabada', country: 'South Africa' },
    { id: '18', name: 'Aiden Markram', country: 'South Africa' },
    { id: '19', name: 'Shakib Al Hasan', country: 'Bangladesh' },
    { id: '20', name: 'Mushfiqur Rahim', country: 'Bangladesh' },
    { id: '21', name: 'Rashid Khan', country: 'Afghanistan' },
    { id: '22', name: 'Mohammad Nabi', country: 'Afghanistan' },
    { id: '23', name: 'Kusal Mendis', country: 'Sri Lanka' },
    { id: '24', name: 'Wanindu Hasaranga', country: 'Sri Lanka' },
    { id: '25', name: 'Nicholas Pooran', country: 'West Indies' },
    { id: '26', name: 'Andre Russell', country: 'West Indies' },
  ];
  return allPlayers.slice(offset, offset + 50);
};

const Players = () => {
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState('');

  const { data: players = [], isLoading } = useQuery({
    queryKey: ['players', offset],
    queryFn: async () => {
      try {
        const data = await fetchPlayers(offset);
        if (data.length > 0) return data;
        // Fallback to dummy data
        return getDummyPlayers(offset);
      } catch (error) {
        console.error('Failed to fetch players, using dummy data', error);
        return getDummyPlayers(offset);
      }
    },
    keepPreviousData: true,
  });

  const filtered = players.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <MainLayout>
      <section className="pt-12 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-2">
              All <span className="text-gradient-primary">Players</span>
            </h1>
            <p className="text-muted-foreground max-w-xl">
              Explore the global player pool. Data powered by CricAPI&apos;s players list.
            </p>
          </div>

          <div className="w-full sm:w-80">
            <div className="relative">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search player..."
                className="input-field w-full pl-9"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">Loading players...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No players found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.02 }}
                className="glass-card p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <UserCircle2 className="w-6 h-6 text-cricket-blue" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Globe2 className="w-3 h-3" />
                    <span className="truncate">{p.country}</span>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section className="pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <button
            disabled={offset === 0}
            onClick={() => setOffset((prev) => Math.max(0, prev - 50))}
            className="btn-secondary text-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <p className="text-xs text-muted-foreground">
            Offset: <span className="text-white font-medium">{offset}</span>
          </p>
          <button
            onClick={() => setOffset((prev) => prev + 50)}
            className="btn-primary text-xs"
          >
            Load More
          </button>
        </div>
      </section>
    </MainLayout>
  );
};

export default Players;

