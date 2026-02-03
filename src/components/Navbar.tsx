import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Trophy,
  MessageCircle,
  BarChart3,
  User,
  Home,
  Calendar,
  List,
  Users,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchCurrentMatches } from "@/services/api";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/matches", label: "Matches", icon: Calendar },
  { path: "/t20-world-cup", label: "T20 WC", icon: MessageCircle },
  { path: "/series", label: "Series", icon: List },
  { path: "/players", label: "Players", icon: Users },
  { path: "/polls", label: "Polls", icon: BarChart3 },
  { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { path: "/profile", label: "Profile", icon: User },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { data: liveMatches = [] } = useQuery({
    queryKey: ["currentMatches"],
    queryFn: async () => {
      try {
        // Try to fetch from API first
        const matches = await fetchCurrentMatches();
        if (matches && matches.length > 0) {
          // Filter only live matches from API response
          const liveOnly = matches.filter(match => match.status === 'live');
          console.log('Live matches from API:', liveOnly.length);
          return liveOnly;
        }
      } catch (error) {
        console.error('Failed to fetch current matches from API:', error);
      }
      
      // Fallback to dummy data - get only live matches
      const { getLiveMatches } = await import('@/data/matches');
      const dummyLive = getLiveMatches();
      console.log('Live matches from dummy data:', dummyLive.length);
      return dummyLive;
    },
    refetchInterval: 30000,
  });
  const liveCount = liveMatches.length;
  console.log('Total live count in navbar:', liveCount);
  const navigate = useNavigate();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Force full reload to reset all state
    if (window.location.pathname === "/") {
      window.location.reload();
    } else {
      navigate("/");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-primary">
              <span className="text-xl">🏏</span>
            </div>
            <span className="font-display text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              PITCHLIVE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-3 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 text-sm font-medium ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-primary/10 border border-primary/30 rounded-lg -z-10"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Live Badge */}
          <div className="hidden md:flex items-center gap-4">
            <div className="badge-live">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              {liveCount} LIVE
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/30"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-border flex items-center justify-between">
                <div className="badge-live w-fit">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  {liveCount} LIVE MATCHES
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
