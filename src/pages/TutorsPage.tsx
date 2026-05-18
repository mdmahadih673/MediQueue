import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, GraduationCap } from 'lucide-react';
import TutorCard from '../components/TutorCard';
import { searchTutors, subjects } from '../data/mockData';
import type { Tutor } from '../data/mockData';
import api from '../utils/api';
import SkeletonCard from '../components/SkeletonCard';

const TutorsPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedMode, setSelectedMode] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'MediQueue – Browse Tutors';
  }, []);

  useEffect(() => {
    const fetchFilteredTutors = async () => {
      setLoading(true);
      try {
        const response = await api.get('/tutors', {
          params: {
            searchText: query,
            subject: selectedSubject,
            teachingMode: selectedMode,
            startDate,
            endDate,
          }
        });
        setTutors(response.data);
      } catch (error) {
        console.warn('Using local tutors because API is unavailable:', error);
        setTutors(searchTutors(query, selectedSubject, startDate, endDate)
          .filter(tutor => selectedMode === 'All' || tutor.teachingMode === selectedMode));
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchFilteredTutors();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, selectedSubject, selectedMode, startDate, endDate]);

  const clearFilters = () => {
    setQuery('');
    setSelectedSubject('All');
    setSelectedMode('All');
    setStartDate('');
    setEndDate('');
  };

  const hasFilters = query || selectedSubject !== 'All' || selectedMode !== 'All' || startDate || endDate;

  const modes = ['All', 'Online', 'Offline', 'Both'];

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingTop: '80px' }}>
      {/* Background Glow */}
      <div className="neon-circle" style={{
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, #a855f7, transparent)',
        top: '-100px', right: '-150px',
        opacity: '0.08',
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4"
            style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)', color: '#a855f7' }}>
            <GraduationCap size={14} />
            {tutors.length} Expert Tutors Available
          </div>
          <h1 className="section-title mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-primary)' }}>
            Find Your Perfect <span className="gradient-text">Tutor</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Search and filter from our verified experts to find the perfect match for your learning needs.
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          className="glass-card p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="input pl-11"
                placeholder="Search tutors by name, subject, or institution..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
              style={{
                background: showFilters ? 'rgba(168,85,247,0.15)' : 'var(--glass)',
                border: `1px solid ${showFilters ? 'rgba(168,85,247,0.4)' : 'var(--glass-border)'}`,
                color: showFilters ? '#a855f7' : 'var(--text-secondary)',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <SlidersHorizontal size={16} />
              Filters
              {hasFilters && (
                <span className="w-2 h-2 rounded-full bg-purple-500" />
              )}
            </motion.button>
            {hasFilters && (
              <motion.button
                onClick={clearFilters}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium"
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  color: '#ef4444',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <X size={14} />
                Clear
              </motion.button>
            )}
          </div>

          {/* Teaching Mode Quick Filter */}
          <div className="glass-radio-group mb-0">
            {modes.map(mode => (
              <label key={mode} className="radio-option">
                <input
                  type="radio"
                  name="mode"
                  value={mode}
                  checked={selectedMode === mode}
                  onChange={() => setSelectedMode(mode)}
                />
                <span className="radio-label">{mode}</span>
              </label>
            ))}
          </div>

          {/* Extended Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4" style={{ borderTop: '1px solid var(--glass-border)' }}>
                  <div>
                    <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Subject</label>
                    <select
                      className="input text-sm"
                      value={selectedSubject}
                      onChange={e => setSelectedSubject(e.target.value)}
                    >
                      <option value="All">All Subjects</option>
                      {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Session From</label>
                    <input
                      type="date"
                      className="input text-sm"
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Session Until</label>
                    <input
                      type="date"
                      className="input text-sm"
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Subject Tags */}
        <motion.div
          className="flex flex-wrap gap-2 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {['All', ...subjects.slice(0, 8)].map(sub => (
            <motion.button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                background: selectedSubject === sub ? 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(59,130,246,0.2))' : 'var(--glass)',
                border: `1px solid ${selectedSubject === sub ? 'rgba(168,85,247,0.4)' : 'var(--glass-border)'}`,
                color: selectedSubject === sub ? '#a855f7' : 'var(--text-muted)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {sub}
            </motion.button>
          ))}
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </motion.div>
          ) : tutors.length > 0 ? (
            <motion.div
              key="results"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {tutors.map((tutor, i) => (
                <TutorCard key={tutor._id} tutor={tutor} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              className="empty-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
                <Search size={36} style={{ color: '#a855f7' }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                No Tutors Found
              </h3>
              <p className="text-sm max-w-sm" style={{ color: 'var(--text-muted)' }}>
                Try adjusting your search or filters to find the perfect tutor for you.
              </p>
              <motion.button
                onClick={clearFilters}
                className="btn-neon mt-6 px-6 py-2.5 text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Clear All Filters</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TutorsPage;
