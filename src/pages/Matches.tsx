import { useState } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/layouts/MainLayout';
import { MatchCard } from '@/components/MatchCard';
import { matches } from '@/data/matches';

type FilterType = 'all' | 'live' | 'upcoming' | 'completed';

const filters: { key: FilterType; label: string; color: string }[] = [
  { key: 'all', label: 'All Matches', color: 'bg-white/10 text-white' },
  { key: 'live', label: 'Live', color: 'bg-red-500/20 text-red-400' },
  { key: 'upcoming', label: 'Upcoming', color: 'bg-blue-500/20 text-blue-400' },
  { key: 'completed', label: 'Completed', color: 'bg-green-500/20 text-green-400' },
];

const Matches = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredMatches = matches.filter((match) => {
    if (activeFilter === 'all') return true;
    return match.status === activeFilter;
  });

  return (
    <MainLayout>
      {/* Header */}
      <section className="pt-12 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            WC 2026 <span className="text-gradient-primary">MATCHES</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Follow every match, join live discussions, and never miss a moment
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {filters.map((filter) => (
            <motion.button
              key={filter.key}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                activeFilter === filter.key
                  ? `${filter.color} ring-2 ring-white/20`
                  : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white'
              }`}
            >
              {filter.key === 'live' && activeFilter === filter.key && (
                <span className="relative inline-flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
              {filter.label}
            </motion.button>
          ))}
        </div>
      </section>

      {/* Matches Grid */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {filteredMatches.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-muted-foreground text-lg">No matches found</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map((match, idx) => (
              <MatchCard key={match.id} match={match} index={idx} />
            ))}
          </div>
        )}
      </section>
    </MainLayout>
  );
};

export default Matches;