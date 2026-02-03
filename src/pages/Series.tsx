import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/layouts/MainLayout";
import { fetchSeriesList, fetchLiveMatches } from "@/services/api";
import { motion } from "framer-motion";
import { CalendarDays, Search, Layers } from "lucide-react";

// Dummy series data
const getDummySeries = () => [
  {
    id: '1',
    name: 'ICC Men\'s T20 World Cup 2026',
    startDate: '2026-02-01',
    endDate: '2026-03-15',
    odi: 0,
    t20: 48,
    test: 0,
    squads: 20,
    matches: 48,
  },
  {
    id: '2',
    name: 'India vs Australia T20 Series 2026',
    startDate: '2026-01-15',
    endDate: '2026-01-30',
    odi: 0,
    t20: 5,
    test: 0,
    squads: 2,
    matches: 5,
  },
  {
    id: '3',
    name: 'England vs South Africa ODI Series',
    startDate: '2026-02-10',
    endDate: '2026-02-25',
    odi: 3,
    t20: 0,
    test: 0,
    squads: 2,
    matches: 3,
  },
  {
    id: '4',
    name: 'Pakistan Super League 2026',
    startDate: '2026-03-01',
    endDate: '2026-03-20',
    odi: 0,
    t20: 34,
    test: 0,
    squads: 6,
    matches: 34,
  },
  {
    id: '5',
    name: 'Big Bash League 2026',
    startDate: '2026-01-01',
    endDate: '2026-02-15',
    odi: 0,
    t20: 61,
    test: 0,
    squads: 8,
    matches: 61,
  },
  {
    id: '6',
    name: 'Caribbean Premier League 2026',
    startDate: '2026-08-01',
    endDate: '2026-09-15',
    odi: 0,
    t20: 33,
    test: 0,
    squads: 6,
    matches: 33,
  },
];

const Series = () => {
  const [search, setSearch] = useState("");
  const [syncing, setSyncing] = useState(false);

  const { data: series = [], isLoading } = useQuery({
    queryKey: ["series", search],
    queryFn: async () => {
      try {
        const data = await fetchSeriesList(0, search || undefined);
        if (data.length > 0) return data;
        // Fallback to dummy data
        return getDummySeries();
      } catch (error) {
        console.error('Failed to fetch series, using dummy data', error);
        return getDummySeries();
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const handleSyncNow = async () => {
    try {
      setSyncing(true);
      await fetchLiveMatches(); // this will also sync into Insforge
    } finally {
      setSyncing(false);
    }
  };

  return (
    <MainLayout>
      <section className="pt-12 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-2">
              Cricket <span className="text-gradient-primary">Series</span>
            </h1>
            <p className="text-muted-foreground max-w-xl">
              Descending list of cricket series covered by CricAPI. Some series
              or matches may have partial coverage.
            </p>
          </div>

          <div className="w-full sm:w-80 flex flex-col gap-3 items-stretch">
            <div className="relative">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search series (e.g. IPL)..."
                className="input-field w-full pl-9"
              />
            </div>
            <button
              onClick={handleSyncNow}
              className="text-xs text-primary hover:text-primary/80 self-end"
            >
              {syncing
                ? "Syncing matches from CricketData…"
                : "Sync now from CricketData"}
            </button>
          </div>
        </div>
      </section>

      <section className="pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">Loading series...</p>
          </div>
        ) : series.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No series found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {series.map((s, idx) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.03 }}
                className="glass-card p-5 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-white leading-snug">
                      {s.name}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      {s.startDate} – {s.endDate}
                    </p>
                  </div>
                  <Layers className="w-5 h-5 text-cricket-blue" />
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mb-3">
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <p className="text-[10px] uppercase tracking-wide">ODI</p>
                    <p className="text-white font-semibold text-sm">{s.odi}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <p className="text-[10px] uppercase tracking-wide">T20</p>
                    <p className="text-white font-semibold text-sm">{s.t20}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <p className="text-[10px] uppercase tracking-wide">TEST</p>
                    <p className="text-white font-semibold text-sm">{s.test}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                  <span>
                    Squads:{" "}
                    <span className="text-white font-medium">{s.squads}</span>
                  </span>
                  {typeof s.matches === "number" && (
                    <span>
                      Matches:{" "}
                      <span className="text-white font-medium">
                        {s.matches}
                      </span>
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </MainLayout>
  );
};

export default Series;
