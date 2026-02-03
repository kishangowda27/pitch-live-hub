import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  BarChart3, 
  Target, 
  Calendar, 
  Award,
  TrendingUp,
  Settings,
  LogOut
} from 'lucide-react';
import { MainLayout } from '@/layouts/MainLayout';
import { currentUser, badges } from '@/data/users';

const Profile = () => {
  const accuracyPercent = Math.round(
    (currentUser.predictionsCorrect / currentUser.predictionsTotal) * 100
  );

  const stats = [
    { 
      label: 'Total Points', 
      value: currentUser.points.toLocaleString(), 
      icon: TrendingUp,
      color: 'text-cricket-gold'
    },
    { 
      label: 'Rank', 
      value: `#${currentUser.rank}`, 
      icon: Award,
      color: 'text-primary'
    },
    { 
      label: 'Comments', 
      value: currentUser.commentsCount, 
      icon: MessageCircle,
      color: 'text-cricket-blue'
    },
    { 
      label: 'Votes', 
      value: currentUser.votesCount, 
      icon: BarChart3,
      color: 'text-cricket-green'
    },
    { 
      label: 'Predictions', 
      value: `${currentUser.predictionsCorrect}/${currentUser.predictionsTotal}`, 
      icon: Target,
      color: 'text-purple-400'
    },
    { 
      label: 'Accuracy', 
      value: `${accuracyPercent}%`, 
      icon: Target,
      color: 'text-cricket-green'
    },
  ];

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 sm:p-8 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full ring-4 ring-primary/30"
              />
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="font-bold text-white text-sm">#{currentUser.rank}</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">
                {currentUser.username}
              </h1>
              <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-2">
                <Calendar className="w-4 h-4" />
                Joined {new Date(currentUser.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4">
                {currentUser.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20"
                    title={badge.description}
                  >
                    <span>{badge.icon}</span>
                    <span className="text-xs font-medium text-white">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <Settings className="w-5 h-5 text-muted-foreground" />
              </button>
              <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <LogOut className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8"
        >
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
                className="glass-card p-5 text-center hover:bg-white/10 transition-all"
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <p className="font-display text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Prediction Accuracy Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 mb-8"
        >
          <h3 className="font-semibold text-white mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Prediction Performance
          </h3>

          <div className="flex items-center gap-8">
            {/* Circle Progress */}
            <div className="relative w-32 h-32 flex-shrink-0">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-white/10"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: '0 352' }}
                  animate={{ strokeDasharray: `${(accuracyPercent / 100) * 352} 352` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(142 71% 45%)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-3xl font-bold text-white">{accuracyPercent}%</span>
              </div>
            </div>

            {/* Stats Breakdown */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Correct Predictions</span>
                  <span className="text-cricket-green font-medium">{currentUser.predictionsCorrect}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${accuracyPercent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-cricket-green rounded-full"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Incorrect Predictions</span>
                  <span className="text-red-400 font-medium">{currentUser.predictionsTotal - currentUser.predictionsCorrect}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${100 - accuracyPercent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                    className="h-full bg-red-500 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* All Available Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h3 className="font-semibold text-white mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-cricket-gold" />
            Badges Collection
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {badges.map((badge) => {
              const isEarned = currentUser.badges.some((b) => b.id === badge.id);
              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-xl text-center transition-all ${
                    isEarned
                      ? 'bg-white/10 border border-white/20'
                      : 'bg-white/5 opacity-40 grayscale'
                  }`}
                >
                  <span className="text-3xl block mb-2">{badge.icon}</span>
                  <p className="font-medium text-white text-sm">{badge.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                  {isEarned && (
                    <span className="inline-flex items-center gap-1 text-xs text-cricket-green mt-2">
                      ✓ Earned
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Profile;