import { motion } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { MainLayout } from '@/layouts/MainLayout';
import { LeaderboardRow } from '@/components/LeaderboardRow';
import { users, currentUser } from '@/data/users';

const Leaderboard = () => {
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);

  return (
    <MainLayout>
      {/* Header */}
      <section className="pt-12 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cricket-gold/20 mb-4">
            <Trophy className="w-8 h-8 text-cricket-gold" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            <span className="text-gradient-primary">LEADERBOARD</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Earn points by commenting, voting, and making predictions
          </p>
        </motion.div>

        {/* Points System */}
        <div className="glass-card p-6 mb-12">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            How to Earn Points
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { action: 'Post a Comment', points: '+10', icon: '💬' },
              { action: 'Vote in Poll', points: '+5', icon: '📊' },
              { action: 'Correct Prediction', points: '+20', icon: '🎯' },
              { action: 'Daily Login', points: '+3', icon: '📅' },
            ].map((item) => (
              <div
                key={item.action}
                className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-colors"
              >
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <p className="text-sm text-white font-medium">{item.action}</p>
                <p className="text-lg font-bold text-cricket-green">{item.points}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Your Position */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h3 className="font-semibold text-white mb-4">Your Position</h3>
          <LeaderboardRow user={currentUser} isCurrentUser />
        </motion.div>
      </section>

      {/* Top 3 Podium */}
      <section className="pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-center gap-4 mb-12">
          {/* 2nd Place */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <img
              src={sortedUsers[1].avatar}
              alt={sortedUsers[1].username}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full ring-4 ring-gray-400 mb-3"
            />
            <p className="font-semibold text-white text-sm sm:text-base">{sortedUsers[1].username}</p>
            <p className="text-xs text-muted-foreground">{sortedUsers[1].points.toLocaleString()} pts</p>
            <div className="mt-3 w-20 sm:w-28 h-24 bg-gradient-to-t from-gray-600 to-gray-400 rounded-t-lg flex items-center justify-center">
              <Medal className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          {/* 1st Place */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center -mt-8"
          >
            <div className="relative">
              <img
                src={sortedUsers[0].avatar}
                alt={sortedUsers[0].username}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full ring-4 ring-yellow-400 mb-3"
              />
              <span className="absolute -top-2 -right-2 text-2xl">👑</span>
            </div>
            <p className="font-semibold text-white text-sm sm:text-base">{sortedUsers[0].username}</p>
            <p className="text-xs text-muted-foreground">{sortedUsers[0].points.toLocaleString()} pts</p>
            <div className="mt-3 w-24 sm:w-32 h-32 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t-lg flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          {/* 3rd Place */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center"
          >
            <img
              src={sortedUsers[2].avatar}
              alt={sortedUsers[2].username}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full ring-4 ring-amber-600 mb-3"
            />
            <p className="font-semibold text-white text-sm sm:text-base">{sortedUsers[2].username}</p>
            <p className="text-xs text-muted-foreground">{sortedUsers[2].points.toLocaleString()} pts</p>
            <div className="mt-3 w-20 sm:w-28 h-20 bg-gradient-to-t from-amber-700 to-amber-600 rounded-t-lg flex items-center justify-center">
              <Award className="w-8 h-8 text-white" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Full Leaderboard */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h3 className="font-display text-xl font-bold text-white mb-6">All Rankings</h3>
        <div className="space-y-3">
          {sortedUsers.map((user, idx) => (
            <LeaderboardRow key={user.id} user={user} index={idx} />
          ))}
        </div>
      </section>
    </MainLayout>
  );
};

export default Leaderboard;