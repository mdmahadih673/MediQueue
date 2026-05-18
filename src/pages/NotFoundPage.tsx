import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  useEffect(() => { document.title = 'MediQueue – Page Not Found'; }, []);

  return (
    <div
      className="min-h-screen hero-bg-gradient grid-overlay flex items-center justify-center px-4"
      style={{ paddingTop: '80px' }}
    >
      <div className="neon-circle" style={{ width: '500px', height: '500px', background: 'radial-gradient(circle, #a855f7, transparent)', top: '-100px', left: '-100px' }} />
      <div className="neon-circle" style={{ width: '400px', height: '400px', background: 'radial-gradient(circle, #3b82f6, transparent)', bottom: '-100px', right: '-100px' }} />

      <motion.div
        className="text-center relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="text-9xl font-black mb-6 gradient-text"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          404
        </motion.div>
        <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
          Page Not Found
        </h1>
        <p className="text-lg mb-8 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
          The page you're looking for doesn't exist or has been moved to another dimension.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/">
            <motion.button
              className="btn-neon px-8 py-3.5 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home size={18} />
              <span>Go Home</span>
            </motion.button>
          </Link>
          <Link to="/tutors">
            <motion.button
              className="px-8 py-3.5 rounded-xl font-semibold flex items-center gap-2"
              style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
              whileHover={{ scale: 1.03, borderColor: 'rgba(168,85,247,0.4)' }}
              whileTap={{ scale: 0.97 }}
            >
              <Search size={18} />
              Browse Tutors
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
