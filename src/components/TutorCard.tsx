import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Tilt from 'react-parallax-tilt';
import { Clock, MapPin, Star, BookOpen, Layers, DollarSign, Calendar } from 'lucide-react';
import type { Tutor } from '../data/mockData';

interface TutorCardProps {
  tutor: Tutor;
  index?: number;
}

const TutorCard: React.FC<TutorCardProps> = ({ tutor, index = 0 }) => {
  const navigate = useNavigate();

  const modeColors = {
    Online: { bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)', text: '#22c55e' },
    Offline: { bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.3)', text: '#fbbf24' },
    Both: { bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.3)', text: '#a855f7' },
  };
  const mode = modeColors[tutor.teachingMode] || modeColors.Online;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
    >
      <Tilt
        tiltMaxAngleX={6}
        tiltMaxAngleY={6}
        glareEnable={true}
        glareMaxOpacity={0.06}
        glareColor="#a855f7"
        glarePosition="all"
        scale={1.01}
        transitionSpeed={400}
        style={{ height: '100%' }}
      >
        <div className="tutor-card h-full flex flex-col" style={{ minHeight: '440px' }}>
          {/* Image Section */}
          <div className="relative overflow-hidden" style={{ height: '200px' }}>
            <img
              src={tutor.tutorImage}
              alt={tutor.tutorName}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.tutorName)}&background=a855f7&color=fff&size=400`;
              }}
            />
            {/* Overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)',
            }} />
            
            {/* Mode Badge */}
            <div className="absolute top-3 right-3">
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: mode.bg, border: `1px solid ${mode.border}`, color: mode.text }}
              >
                {tutor.teachingMode}
              </span>
            </div>

            {/* Rating */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1">
              <Star size={12} fill="#fbbf24" color="#fbbf24" />
              <span className="text-xs font-bold text-white">
                {(tutor.rating ?? 4.5).toFixed(1)}
              </span>
            </div>

            {/* Slots */}
            <div className="absolute bottom-3 right-3">
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: tutor.totalSlot > 0 ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                  border: `1px solid ${tutor.totalSlot > 0 ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`,
                  color: tutor.totalSlot > 0 ? '#22c55e' : '#ef4444',
                }}
              >
                {tutor.totalSlot > 0 ? `${tutor.totalSlot} slots` : 'Full'}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 p-5 gap-3">
            <div>
              <h3
                className="font-bold text-lg leading-tight mb-1"
                style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {tutor.tutorName}
              </h3>
              <p className="text-sm font-medium" style={{ color: '#a855f7' }}>
                {tutor.institution}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <div className="flex items-center gap-1.5">
                <BookOpen size={11} style={{ color: '#a855f7' }} />
                <span className="truncate">{tutor.subject}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers size={11} style={{ color: '#3b82f6' }} />
                <span>{tutor.experience}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={11} style={{ color: '#06b6d4' }} />
                <span className="truncate">{tutor.availableTime}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={11} style={{ color: '#f59e0b' }} />
                <span className="truncate">{tutor.location}</span>
              </div>
              <div className="flex items-center gap-1.5 col-span-2">
                <Calendar size={11} style={{ color: '#ec4899' }} />
                <span>Session: {tutor.sessionDate}</span>
              </div>
            </div>

            {/* Fee & CTA */}
            <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: '1px solid var(--glass-border)' }}>
              <div className="flex items-center gap-1">
                <DollarSign size={16} style={{ color: '#a855f7' }} />
                <span
                  className="text-xl font-bold"
                  style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {tutor.fee}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>/hr</span>
              </div>
              <motion.button
                onClick={() => navigate(`/tutors/${tutor._id}`)}
                className="btn-neon py-2 px-4 text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Book Session</span>
              </motion.button>
            </div>
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
};

export default TutorCard;
