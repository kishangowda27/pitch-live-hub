import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { MainLayout } from '@/layouts/MainLayout';
import { PollCard } from '@/components/PollCard';
import { polls, getActivePolls, getTrendingPolls } from '@/data/polls';

type FilterType = 'all' | 'active' | 'trending' | 'completed';

const Polls = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPollQuestion, setNewPollQuestion] = useState('');
  const [newPollOptions, setNewPollOptions] = useState(['', '', '']);

  const getFilteredPolls = () => {
    switch (activeFilter) {
      case 'active':
        return getActivePolls();
      case 'trending':
        return getTrendingPolls();
      case 'completed':
        return polls.filter((p) => p.status === 'closed');
      default:
        return polls;
    }
  };

  const filteredPolls = getFilteredPolls();

  const handleCreatePoll = () => {
    // Just reset for demo
    setNewPollQuestion('');
    setNewPollOptions(['', '', '']);
    setShowCreateModal(false);
  };

  const filters: { key: FilterType; label: string; icon: any }[] = [
    { key: 'all', label: 'All Polls', icon: null },
    { key: 'active', label: 'Active', icon: Clock },
    { key: 'trending', label: 'Trending', icon: TrendingUp },
    { key: 'completed', label: 'Completed', icon: CheckCircle },
  ];

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
            FAN <span className="text-gradient-primary">POLLS</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Vote on match outcomes, player performances, and more
          </p>
        </motion.div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {filters.map((filter) => {
              const Icon = filter.icon;
              return (
                <motion.button
                  key={filter.key}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                    activeFilter === filter.key
                      ? 'bg-primary/20 text-primary ring-2 ring-primary/30'
                      : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {filter.label}
                </motion.button>
              );
            })}
          </div>

          {/* Create Poll Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Poll
          </motion.button>
        </div>
      </section>

      {/* Polls Grid */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {filteredPolls.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-muted-foreground text-lg">No polls found</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPolls.map((poll, idx) => (
              <PollCard key={poll.id} poll={poll} index={idx} />
            ))}
          </div>
        )}
      </section>

      {/* Create Poll Modal */}
      {showCreateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowCreateModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-6 w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-2xl font-bold text-white mb-6">Create a Poll</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Question
                </label>
                <input
                  type="text"
                  value={newPollQuestion}
                  onChange={(e) => setNewPollQuestion(e.target.value)}
                  placeholder="What do you want to ask?"
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Options
                </label>
                <div className="space-y-2">
                  {newPollOptions.map((option, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const updated = [...newPollOptions];
                        updated[idx] = e.target.value;
                        setNewPollOptions(updated);
                      }}
                      placeholder={`Option ${idx + 1}`}
                      className="input-field w-full"
                    />
                  ))}
                </div>
                <button
                  onClick={() => setNewPollOptions([...newPollOptions, ''])}
                  className="mt-2 text-sm text-primary hover:underline"
                >
                  + Add Option
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePoll}
                className="btn-primary flex-1"
              >
                Create Poll
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </MainLayout>
  );
};

export default Polls;