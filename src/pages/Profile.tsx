import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  BarChart3,
  Target,
  Calendar,
  Award,
  TrendingUp,
  Settings,
  LogOut,
  X,
  User,
  Image as ImageIcon,
  Bell,
  Shield,
  Palette,
  Save,
  RefreshCw,
} from "lucide-react";
import { MainLayout } from "@/layouts/MainLayout";
import { currentUser as defaultUser, badges } from "@/data/users";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { insforge } from "@/lib/insforgeClient";
import type { User } from "@/data/users";

interface DbUserProfile {
  id: string;
  user_id: string;
  username: string;
  avatar: string;
  points: number;
  rank: number;
  comments_count: number;
  votes_count: number;
  predictions_correct: number;
  predictions_total: number;
  joined_at: string;
  badges: string[]; // Array of badge IDs
  created_at: string;
  updated_at: string;
}

interface DbUserSettings {
  id: string;
  user_id: string;
  notifications: boolean;
  email_notifications: boolean;
  show_email: boolean;
  theme: string;
  created_at: string;
  updated_at: string;
}

const Profile = () => {
  const { signOut, user: authUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userId = authUser?.id || 'current';

  // Load user profile from Insforge database
  const { data: dbProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!authUser?.id) {
        // If not logged in, try localStorage
        const saved = localStorage.getItem('userProfile');
        if (saved) {
          try {
            return JSON.parse(saved);
          } catch {
            return null;
          }
        }
        return null;
      }

      try {
        const { data, error } = await insforge.database
          .from('user_profiles')
          .select('*')
          .eq('user_id', authUser.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          // PGRST116 = no rows returned, which is fine for new users
          console.error('Failed to load profile from database', error);
        }

        if (data) {
          // Convert database format to User format
          const userBadges = data.badges
            ? badges.filter((b) => data.badges.includes(b.id))
            : [];

          return {
            id: data.id,
            username: data.username,
            avatar: data.avatar,
            points: data.points || 0,
            rank: data.rank || 999,
            badges: userBadges,
            commentsCount: data.comments_count || 0,
            votesCount: data.votes_count || 0,
            predictionsCorrect: data.predictions_correct || 0,
            predictionsTotal: data.predictions_total || 0,
            joinedAt: data.joined_at || new Date().toISOString(),
          } as User;
        }

        return null;
      } catch (error) {
        console.error('Error loading profile', error);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Load user settings from Insforge database
  const { data: dbSettings } = useQuery({
    queryKey: ['userSettings', userId],
    queryFn: async () => {
      if (!authUser?.id) {
        const saved = localStorage.getItem('userSettings');
        if (saved) {
          try {
            return JSON.parse(saved);
          } catch {
            return null;
          }
        }
        return null;
      }

      try {
        const { data, error } = await insforge.database
          .from('user_settings')
          .select('*')
          .eq('user_id', authUser.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Failed to load settings from database', error);
        }

        return data as DbUserSettings | null;
      } catch (error) {
        console.error('Error loading settings', error);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  // Initialize profile user state
  const [profileUser, setProfileUser] = useState<User>(defaultUser);

  // Update profile when database data loads
  useEffect(() => {
    if (dbProfile) {
      setProfileUser(dbProfile);
      setTempUsername(dbProfile.username);
      // Also save to localStorage as backup
      localStorage.setItem('userProfile', JSON.stringify(dbProfile));
    } else if (!authUser?.id) {
      // Fallback to localStorage if not logged in
      const saved = localStorage.getItem('userProfile');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setProfileUser(parsed);
          setTempUsername(parsed.username);
        } catch {
          setProfileUser(defaultUser);
          setTempUsername(defaultUser.username);
        }
      }
    }
  }, [dbProfile, authUser?.id]);

  const [showSettings, setShowSettings] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempUsername, setTempUsername] = useState(profileUser.username);
  
  // Initialize settings form from database or defaults
  const [settingsForm, setSettingsForm] = useState(() => {
    const avatarSeed = profileUser.avatar.split('seed=')[1]?.split('&')[0] || 'Felix';
    return {
      username: profileUser.username,
      avatarSeed,
      notifications: dbSettings?.notifications ?? true,
      emailNotifications: dbSettings?.email_notifications ?? false,
      showEmail: dbSettings?.show_email ?? false,
      theme: dbSettings?.theme || 'dark',
    };
  });

  // Update settings form when database settings load
  useEffect(() => {
    if (dbSettings) {
      setSettingsForm({
        username: profileUser.username,
        avatarSeed: profileUser.avatar.split('seed=')[1]?.split('&')[0] || 'Felix',
        notifications: dbSettings.notifications ?? true,
        emailNotifications: dbSettings.email_notifications ?? false,
        showEmail: dbSettings.show_email ?? false,
        theme: dbSettings.theme || 'dark',
      });
      // Also save to localStorage as backup
      localStorage.setItem('userSettings', JSON.stringify(dbSettings));
    }
  }, [dbSettings, profileUser.avatar]);

  const accuracyPercent = Math.round(
    (profileUser.predictionsCorrect / profileUser.predictionsTotal) * 100
  );

  const stats = [
    {
      label: "Total Points",
      value: profileUser.points.toLocaleString(),
      icon: TrendingUp,
      color: "text-cricket-gold",
    },
    {
      label: "Rank",
      value: `#${profileUser.rank}`,
      icon: Award,
      color: "text-primary",
    },
    {
      label: "Comments",
      value: profileUser.commentsCount,
      icon: MessageCircle,
      color: "text-cricket-blue",
    },
    {
      label: "Votes",
      value: profileUser.votesCount,
      icon: BarChart3,
      color: "text-cricket-green",
    },
    {
      label: "Predictions",
      value: `${profileUser.predictionsCorrect}/${profileUser.predictionsTotal}`,
      icon: Target,
      color: "text-purple-400",
    },
    {
      label: "Accuracy",
      value: `${accuracyPercent}%`,
      icon: Target,
      color: "text-cricket-green",
    },
  ];

  const handleSaveSettings = async () => {
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(settingsForm.avatarSeed)}`;
    const updatedProfile = {
      ...profileUser,
      username: settingsForm.username,
      avatar: newAvatar,
    };
    
    setProfileUser(updatedProfile);
    
    // Save to localStorage as backup
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    localStorage.setItem('userSettings', JSON.stringify({
      notifications: settingsForm.notifications,
      emailNotifications: settingsForm.emailNotifications,
      showEmail: settingsForm.showEmail,
      theme: settingsForm.theme,
    }));

    // Save to Insforge database if user is logged in
    if (authUser?.id) {
      try {
        // Upsert user profile
        const profileData = {
          user_id: authUser.id,
          username: settingsForm.username,
          avatar: newAvatar,
          points: profileUser.points,
          rank: profileUser.rank,
          comments_count: profileUser.commentsCount,
          votes_count: profileUser.votesCount,
          predictions_correct: profileUser.predictionsCorrect,
          predictions_total: profileUser.predictionsTotal,
          joined_at: profileUser.joinedAt,
          badges: profileUser.badges.map((b) => b.id),
          updated_at: new Date().toISOString(),
        };

        const { error: profileError } = await insforge.database
          .from('user_profiles')
          .upsert(profileData, {
            onConflict: 'user_id',
          });

        if (profileError) {
          console.error('Failed to save profile to database', profileError);
        }

        // Upsert user settings
        const settingsData = {
          user_id: authUser.id,
          notifications: settingsForm.notifications,
          email_notifications: settingsForm.emailNotifications,
          show_email: settingsForm.showEmail,
          theme: settingsForm.theme,
          updated_at: new Date().toISOString(),
        };

        const { error: settingsError } = await insforge.database
          .from('user_settings')
          .upsert(settingsData, {
            onConflict: 'user_id',
          });

        if (settingsError) {
          console.error('Failed to save settings to database', settingsError);
        }

        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
        queryClient.invalidateQueries({ queryKey: ['userSettings', userId] });
      } catch (error) {
        console.error('Error saving to database', error);
      }
    }

    setShowSettings(false);
  };

  const generateRandomAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    setSettingsForm({ ...settingsForm, avatarSeed: randomSeed });
  };

  const handleSignOutClick = async () => {
    await signOut();
    navigate("/");
  };

  const handleNameEdit = () => {
    setIsEditingName(true);
    setTempUsername(profileUser.username);
  };

  const handleNameSave = async () => {
    if (tempUsername.trim() && tempUsername !== profileUser.username) {
      const updatedProfile = {
        ...profileUser,
        username: tempUsername.trim(),
      };
      
      setProfileUser(updatedProfile);
      
      // Save to localStorage as backup
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));

      // Save to Insforge database if user is logged in
      if (authUser?.id) {
        try {
          const profileData = {
            user_id: authUser.id,
            username: tempUsername.trim(),
            avatar: profileUser.avatar,
            points: profileUser.points,
            rank: profileUser.rank,
            comments_count: profileUser.commentsCount,
            votes_count: profileUser.votesCount,
            predictions_correct: profileUser.predictionsCorrect,
            predictions_total: profileUser.predictionsTotal,
            joined_at: profileUser.joinedAt,
            badges: profileUser.badges.map((b) => b.id),
            updated_at: new Date().toISOString(),
          };

          const { error: profileError } = await insforge.database
            .from('user_profiles')
            .upsert(profileData, {
              onConflict: 'user_id',
            });

          if (profileError) {
            console.error('Failed to save profile to database', profileError);
          } else {
            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
          }
        } catch (error) {
          console.error('Error saving to database', error);
        }
      }
    }
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setTempUsername(profileUser.username);
    setIsEditingName(false);
  };

  const handleNameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      handleNameCancel();
    }
  };

  if (profileLoading) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-muted-foreground text-lg">Loading profile...</p>
        </div>
      </MainLayout>
    );
  }

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
                src={profileUser.avatar}
                alt={profileUser.username}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full ring-4 ring-primary/30"
              />
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="font-bold text-white text-sm">
                  #{profileUser.rank}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              {isEditingName ? (
                <div className="mb-2">
                  <input
                    type="text"
                    value={tempUsername}
                    onChange={(e) => setTempUsername(e.target.value)}
                    onKeyDown={handleNameKeyPress}
                    onBlur={handleNameSave}
                    className="font-display text-3xl sm:text-4xl font-bold text-white bg-transparent border-b-2 border-primary focus:outline-none focus:border-primary-light text-center sm:text-left"
                    autoFocus
                    maxLength={20}
                  />
                </div>
              ) : (
                <h1 
                  className="font-display text-3xl sm:text-4xl font-bold text-white mb-2 cursor-pointer hover:text-primary transition-colors"
                  onClick={handleNameEdit}
                  title="Click to edit name"
                >
                  {profileUser.username}
                </h1>
              )}
              <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-2">
                <Calendar className="w-4 h-4" />
                Joined{" "}
                {new Date(profileUser.joinedAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4">
                {profileUser.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20"
                    title={badge.description}
                  >
                    <span>{badge.icon}</span>
                    <span className="text-xs font-medium text-white">
                      {badge.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleSignOutClick}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
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
                <p className="font-display text-2xl font-bold text-white">
                  {stat.value}
                </p>
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
                  initial={{ strokeDasharray: "0 352" }}
                  animate={{
                    strokeDasharray: `${(accuracyPercent / 100) * 352} 352`,
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(142 71% 45%)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-3xl font-bold text-white">
                  {accuracyPercent}%
                </span>
              </div>
            </div>

            {/* Stats Breakdown */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">
                    Correct Predictions
                  </span>
                  <span className="text-cricket-green font-medium">
                    {profileUser.predictionsCorrect}
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${accuracyPercent}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-cricket-green rounded-full"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">
                    Incorrect Predictions
                  </span>
                  <span className="text-red-400 font-medium">
                    {profileUser.predictionsTotal -
                      profileUser.predictionsCorrect}
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${100 - accuracyPercent}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
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
              const isEarned = profileUser.badges.some(
                (b) => b.id === badge.id
              );
              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-xl text-center transition-all ${
                    isEarned
                      ? "bg-white/10 border border-white/20"
                      : "bg-white/5 opacity-40 grayscale"
                  }`}
                >
                  <span className="text-3xl block mb-2">{badge.icon}</span>
                  <p className="font-medium text-white text-sm">{badge.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {badge.description}
                  </p>
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

      {/* Settings Modal */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowSettings(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
                <Settings className="w-6 h-6" />
                Settings
              </h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Profile Section */}
              <div>
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Profile Information
                </h3>
                <div className="space-y-4">
                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={settingsForm.username}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, username: e.target.value })
                      }
                      className="input-field w-full"
                      placeholder="Enter your username"
                    />
                  </div>

                  {/* Avatar */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Avatar
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(settingsForm.avatarSeed)}`}
                          alt="Avatar preview"
                          className="w-20 h-20 rounded-full ring-2 ring-primary/50"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={settingsForm.avatarSeed}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, avatarSeed: e.target.value })
                          }
                          className="input-field w-full mb-2"
                          placeholder="Avatar seed (e.g., Felix, John, etc.)"
                        />
                        <button
                          onClick={generateRandomAvatar}
                          className="btn-secondary text-xs flex items-center gap-2"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Random Avatar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notifications Section */}
              <div>
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Notifications
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <div>
                      <p className="text-white text-sm font-medium">Push Notifications</p>
                      <p className="text-xs text-muted-foreground">
                        Get notified about match updates
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settingsForm.notifications}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, notifications: e.target.checked })
                      }
                      className="w-5 h-5 rounded border-white/20 bg-white/5 text-primary focus:ring-primary"
                    />
                  </label>
                  <label className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <div>
                      <p className="text-white text-sm font-medium">Email Notifications</p>
                      <p className="text-xs text-muted-foreground">
                        Receive updates via email
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settingsForm.emailNotifications}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, emailNotifications: e.target.checked })
                      }
                      className="w-5 h-5 rounded border-white/20 bg-white/5 text-primary focus:ring-primary"
                    />
                  </label>
                </div>
              </div>

              {/* Privacy Section */}
              <div>
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Privacy
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <div>
                      <p className="text-white text-sm font-medium">Show Email</p>
                      <p className="text-xs text-muted-foreground">
                        Display your email on profile
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settingsForm.showEmail}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, showEmail: e.target.checked })
                      }
                      className="w-5 h-5 rounded border-white/20 bg-white/5 text-primary focus:ring-primary"
                    />
                  </label>
                </div>
              </div>

              {/* Theme Section */}
              <div>
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" />
                  Appearance
                </h3>
                <div className="space-y-2">
                  <label className="block text-sm text-muted-foreground mb-2">
                    Theme
                  </label>
                  <select
                    value={settingsForm.theme}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, theme: e.target.value })
                    }
                    className="input-field w-full"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
              </div>

              {/* Account Info */}
              {authUser && (
                <div>
                  <h3 className="font-semibold text-white mb-4">Account Information</h3>
                  <div className="space-y-2 p-3 rounded-lg bg-white/5">
                    <p className="text-sm text-muted-foreground">
                      <span className="text-white">Email:</span> {authUser.email || 'Not set'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="text-white">User ID:</span> {authUser.id}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-white/10">
              <button
                onClick={() => setShowSettings(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </MainLayout>
  );
};

export default Profile;
