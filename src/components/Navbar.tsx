import { useState, useEffect, useRef } from "react";
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
  LogIn,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchCurrentMatches } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

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
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
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
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center glow-primary">
              <span className="text-lg">🏏</span>
            </div>
            <span className="font-display text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
              PITCHLIVE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.slice(0, 6).map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              // Handle Profile with dropdown
              if (item.path === "/profile" && user) {
                return (
                  <div key={item.path} className="relative" ref={profileRef}>
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className={`relative px-2 py-1.5 rounded-lg flex items-center gap-1.5 transition-all duration-300 text-xs font-medium ${
                        isActive
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden xl:inline">{user.name || "Profile"}</span>
                      <ChevronDown className="w-3 h-3" />
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
                    </button>
                    
                    {/* Profile Dropdown */}
                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 top-full mt-2 w-48 bg-background/95 backdrop-blur-xl border border-border rounded-lg shadow-lg z-50"
                        >
                          <div className="p-2">
                            <div className="px-3 py-2 text-xs text-muted-foreground border-b border-border">
                              {user.email}
                            </div>
                            <Link
                              to="/profile"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-lg transition-colors"
                            >
                              <User className="w-4 h-4" />
                              View Profile
                            </Link>
                            <button
                              onClick={() => {
                                signOut();
                                setIsProfileOpen(false);
                              }}
                              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-lg transition-colors w-full text-left"
                            >
                              <LogOut className="w-4 h-4" />
                              Sign Out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-2 py-1.5 rounded-lg flex items-center gap-1.5 transition-all duration-300 text-xs font-medium ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">{item.label}</span>
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

          {/* Right Side - Live Badge & Auth */}
          <div className="flex items-center gap-2">
            {/* Live Badge */}
            <div className="badge-live text-xs px-2 py-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
              </span>
              <span className="hidden sm:inline">{liveCount} LIVE</span>
              <span className="sm:hidden">{liveCount}</span>
            </div>
            
            {/* Auth Buttons - Only show if not logged in */}
            {!user && (
              <div className="hidden md:flex items-center gap-1">
                <Link
                  to="/login"
                  className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all"
                >
                  <LogIn className="w-3 h-3" />
                  <span className="hidden lg:inline">Sign In</span>
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-all"
                >
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-1.5 rounded-lg hover:bg-accent transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/30"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Footer */}
              <div className="pt-3 border-t border-border space-y-2">
                {/* Live Badge */}
                <div className="badge-live w-fit">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  {liveCount} LIVE MATCHES
                </div>
                
                {/* Mobile Auth */}
                {user ? (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground px-3">
                      Hi, {user.name || user.email}
                    </div>
                    <button
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-all w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
                    >
                      <LogIn className="w-4 h-4" />
                      <span className="font-medium">Sign In</span>
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                    >
                      <User className="w-4 h-4" />
                      <span className="font-medium">Sign Up</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
