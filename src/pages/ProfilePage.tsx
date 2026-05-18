import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Calendar, Star, Mail, Edit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserTutors, getUserBookings } from '../data/mockData';

const ProfilePage: React.FC = () => {
  useEffect(() => { document.title = 'MediQueue – Profile'; }, []);

  const { user } = useAuth();
  const myTutors = getUserTutors(user?.email || '');
  const myBookings = getUserBookings(user?.email || '');
  const activeBookings = myBookings.filter(b => b.bookingStatus !== 'cancelled');

  const stats = [
    { label: 'Tutors Added', value: myTutors.length, icon: <GraduationCap size={20} />, color: '#a855f7', bg: 'rgba(168,85,247,0.1)' },
    { label: 'Active Bookings', value: activeBookings.length, icon: <BookOpen size={20} />, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { label: 'Total Sessions', value: myBookings.length, icon: <Calendar size={20} />, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
    { label: 'Avg Rating', value: '4.9', icon: <Star size={20} />, color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
  ];

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingTop: '80px' }}>
      <div className="neon-circle" style={{ width: '500px', height: '500px', background: 'radial-gradient(circle, #a855f7, transparent)', top: '-100px', right: '-150px' }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <motion.div
          className="glass-card p-8 mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
            >
              <div
                className="w-24 h-24 rounded-2xl overflow-hidden"
                style={{ border: '2px solid transparent', background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #a855f7, #3b82f6) border-box' }}
              >
                <img
                  src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'U')}&background=a855f7&color=fff&size=200`}
                  alt={user?.displayName || 'User'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2"
                style={{ background: '#22c55e', borderColor: 'var(--bg-secondary)' }}
              />
            </motion.div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                {user?.displayName || 'Student'}
              </h1>
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-3">
                <Mail size={14} style={{ color: 'var(--text-muted)' }} />
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)', color: '#a855f7' }}>
                <Star size={11} fill="#a855f7" />
                Premium Member
              </div>
            </div>

            <Link to={user?.role === 'admin' ? "/add-tutor" : "/tutors"}>
              <motion.button
                className="btn-neon px-4 py-2 text-sm flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {user?.role === 'admin' ? (
                  <>
                    <Edit size={14} />
                    <span>Add Tutor</span>
                  </>
                ) : (
                  <>
                    <GraduationCap size={14} />
                    <span>Book a Tutor</span>
                  </>
                )}
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass-card p-5 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: stat.bg, color: stat.color }}>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold mb-1" style={{ color: stat.color, fontFamily: 'Space Grotesk, sans-serif' }}>
                {stat.value}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Links */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Browse Tutors', to: '/tutors', icon: <GraduationCap size={16} />, color: '#a855f7' },
              ...(user?.role === 'admin' ? [
                { label: 'My Tutors', to: '/my-tutors', icon: <BookOpen size={16} />, color: '#3b82f6' }
              ] : []),
              { label: 'My Bookings', to: '/my-bookings', icon: <Calendar size={16} />, color: '#22c55e' },
            ].map(action => (
              <Link key={action.label} to={action.to}>
                <motion.div
                  className="glass-card p-4 flex items-center gap-3 cursor-pointer"
                  whileHover={{ x: 4, borderColor: action.color + '60' }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: action.color + '15', color: action.color }}>
                    {action.icon}
                  </div>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{action.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
