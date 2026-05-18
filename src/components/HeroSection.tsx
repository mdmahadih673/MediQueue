import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Users, BookOpen, Award, Zap, ArrowRight } from 'lucide-react';

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  size: Math.random() * 4 + 2,
  left: Math.random() * 100,
  delay: Math.random() * 8,
  duration: Math.random() * 10 + 8,
  opacity: Math.random() * 0.6 + 0.2,
}));

const HeroSection: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: 'easeOut' as const },
  });

  return (
    <section
      className="hero-section hero-bg-gradient grid-overlay"
      style={{ paddingTop: '80px' }}
    >
      {/* Animated Background Blobs */}
      <div className="neon-circle animate-aurora" style={{
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, #a855f7, #3b82f6, transparent)',
        top: '-100px', left: '-200px',
      }} />
      <div className="neon-circle animate-aurora" style={{
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, #3b82f6, #06b6d4, transparent)',
        bottom: '-100px', right: '-100px',
        animationDelay: '3s',
      }} />
      <div className="neon-circle" style={{
        width: '300px', height: '300px',
        background: 'radial-gradient(circle, #ec4899, transparent)',
        top: '40%', left: '40%',
        animation: 'aurora 15s ease-in-out infinite 6s',
      }} />

      {/* Particles */}
      {PARTICLES.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            bottom: '-10px',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-16 lg:py-24">
          {/* LEFT SIDE */}
          <div className="flex flex-col gap-6 lg:gap-8">
            {/* Badge */}
            <motion.div {...fadeUp(0)}>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                style={{
                  background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(59,130,246,0.15))',
                  border: '1px solid rgba(168,85,247,0.3)',
                  color: '#a855f7',
                }}
              >
                <Zap size={14} fill="#a855f7" />
                #1 Futuristic Tutor Booking Platform
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              </div>
            </motion.div>

            {/* Heading */}
            <motion.div {...fadeUp(0.15)}>
              <h1
                className="section-title leading-none"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                <span style={{ color: 'var(--text-primary)' }}>Learn From</span>
                <br />
                <span className="text-gradient">World-Class</span>
                <br />
                <span style={{ color: 'var(--text-primary)' }}>Tutors</span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              {...fadeUp(0.3)}
              className="text-lg leading-relaxed max-w-lg"
              style={{ color: 'var(--text-secondary)' }}
            >
              Connect with verified expert tutors, book flexible sessions, and accelerate your learning journey with AI-powered matching technology.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div {...fadeUp(0.45)} className="flex flex-wrap gap-4">
              <Link to="/tutors">
                <motion.button
                  className="btn-neon text-base px-8 py-3.5 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setIsHovered(true)}
                  onHoverEnd={() => setIsHovered(false)}
                >
                  <span>Explore Tutors</span>
                  <motion.div animate={{ x: isHovered ? 4 : 0 }}>
                    <ArrowRight size={18} />
                  </motion.div>
                </motion.button>
              </Link>
              <Link to="/register">
                <motion.button
                  className="px-8 py-3.5 rounded-xl text-base font-semibold flex items-center gap-2"
                  style={{
                    background: 'var(--glass)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--text-primary)',
                  }}
                  whileHover={{ scale: 1.03, borderColor: 'rgba(168,85,247,0.5)' }}
                  whileTap={{ scale: 0.97 }}
                >
                  Get Started Free
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div {...fadeUp(0.6)} className="flex flex-wrap gap-6 pt-2">
              {[
                { icon: <Users size={18} />, value: '10K+', label: 'Students' },
                { icon: <BookOpen size={18} />, value: '500+', label: 'Tutors' },
                { icon: <Star size={18} fill="#fbbf24" color="#fbbf24" />, value: '4.9', label: 'Avg Rating' },
                { icon: <Award size={18} />, value: '98%', label: 'Satisfaction' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <span style={{ color: '#a855f7' }}>{stat.icon}</span>
                  <div>
                    <div className="text-lg font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                      {stat.value}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT SIDE – Animated Dashboard */}
          <motion.div
            className="relative hidden lg:flex items-center justify-center"
            style={{ height: '500px' }}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
          >
            {/* Orbit rings */}
            <div style={{
              position: 'absolute',
              width: '320px', height: '320px',
              borderRadius: '50%',
              border: '1px dashed rgba(168,85,247,0.2)',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
            }} />
            <div style={{
              position: 'absolute',
              width: '440px', height: '440px',
              borderRadius: '50%',
              border: '1px dashed rgba(59,130,246,0.15)',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
            }} />

            {/* Center card – Main Dashboard */}
            <motion.div
              className="glass-card p-6 z-20"
              style={{ width: '260px', position: 'relative' }}
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden" style={{ border: '2px solid #a855f7' }}>
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face" alt="Tutor" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Dr. Sarah Mitchell</p>
                  <p className="text-xs" style={{ color: '#a855f7' }}>Mathematics Expert</p>
                </div>
              </div>
              <div className="flex justify-between text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                <span>Next Session</span>
                <span style={{ color: '#22c55e' }}>● Live</span>
              </div>
              <div className="rounded-lg p-3 mb-3" style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}>
                <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>Advanced Calculus</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Today, 9:00 AM – 11:00 AM</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex" style={{ gap: '-8px' }}>
                  {['A&background=a855f7', 'B&background=3b82f6', 'C&background=06b6d4'].map((q, i) => (
                    <div key={i} className="w-6 h-6 rounded-full overflow-hidden" style={{ border: '2px solid var(--bg-secondary)', marginLeft: i > 0 ? '-8px' : '0' }}>
                      <img src={`https://ui-avatars.com/api/?name=${q}&color=fff&size=50`} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <span className="text-xs font-bold" style={{ color: '#a855f7' }}>$85/hr</span>
              </div>
            </motion.div>

            {/* Floating Mini Cards */}
            {[
              {
                delay: 0.2, top: '20px', right: '-20px', left: 'auto', bottom: 'auto', width: '160px',
                icon: <Star size={14} fill="#22c55e" color="#22c55e" />,
                iconBg: 'rgba(34,197,94,0.15)', title: '4.9/5.0', subtitle: 'Avg Rating',
              },
              {
                delay: 0.6, bottom: '60px', right: '0px', top: 'auto', left: 'auto', width: '180px',
                icon: <Users size={14} style={{ color: '#a855f7' }} />,
                iconBg: 'rgba(168,85,247,0.15)', title: '10,000+ Students', subtitle: 'Actively Learning',
              },
              {
                delay: 1.0, top: '80px', left: '-30px', right: 'auto', bottom: 'auto', width: '160px',
                icon: <BookOpen size={14} style={{ color: '#3b82f6' }} />,
                iconBg: 'rgba(59,130,246,0.15)', title: '500+ Tutors', subtitle: 'Verified Experts',
              },
              {
                delay: 1.4, bottom: '20px', left: '-10px', top: 'auto', right: 'auto', width: '170px',
                icon: <Award size={14} style={{ color: '#fbbf24' }} />,
                iconBg: 'rgba(251,191,36,0.15)', title: '98% Success', subtitle: 'Satisfaction',
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                className="glass-card p-3"
                style={{ position: 'absolute', width: card.width, top: card.top, right: card.right, bottom: card.bottom, left: card.left }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: [0, -10, 0] }}
                transition={{ opacity: { duration: 0.6, delay: card.delay }, y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: card.delay } }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: card.iconBg }}>
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{card.title}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{card.subtitle}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Orbit dots */}
            <motion.div
              style={{
                position: 'absolute',
                width: '12px', height: '12px',
                borderRadius: '50%',
                background: '#a855f7',
                boxShadow: '0 0 15px #a855f7',
                top: '50%', left: '50%',
                marginTop: '-6px', marginLeft: '-6px',
              }}
              animate={{ x: [0, 160, 0, -160, 0], y: [0, -80, -160, -80, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Scroll to explore</p>
        <div className="w-5 h-8 rounded-full flex items-start justify-center pt-2" style={{ border: '1.5px solid var(--glass-border)' }}>
          <motion.div
            className="w-1.5 h-2 rounded-full"
            style={{ background: '#a855f7' }}
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
