import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 48,
  message = 'Loading...',
  fullScreen = false,
}) => {
  const content = (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2px solid transparent',
            borderTopColor: '#a855f7',
            borderRightColor: '#3b82f6',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          style={{
            position: 'absolute',
            inset: '4px',
            borderRadius: '50%',
            border: '2px solid transparent',
            borderBottomColor: '#06b6d4',
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
        <div style={{
          position: 'absolute',
          inset: '8px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(59,130,246,0.3))',
          animation: 'pulse-glow 2s ease-in-out infinite',
        }} />
      </div>
      {message && (
        <motion.p
          className="text-sm font-medium gradient-text"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--bg-primary)' }}
      >
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-16">
      {content}
    </div>
  );
};

export default LoadingSpinner;
