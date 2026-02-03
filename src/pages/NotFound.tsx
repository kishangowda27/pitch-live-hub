import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="text-8xl mb-6">🏏</div>
        <h1 className="font-display text-6xl sm:text-8xl font-bold text-white mb-4">
          4<span className="text-primary">0</span>4
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Oops! Looks like that ball went out of the stadium.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </motion.button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
