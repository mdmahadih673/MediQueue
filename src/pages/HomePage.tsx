import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import HeroSection from '../components/HeroSection';
import TutorCard from '../components/TutorCard';
import { testimonials } from '../data/mockData';
import type { Tutor } from '../data/mockData';
import api from '../utils/api';
import SkeletonCard from '../components/SkeletonCard';
import {
  Shield, Clock, DollarSign, Monitor,
  Star, CheckCircle, ArrowRight, Zap, Globe, Lock, TrendingUp
} from 'lucide-react';
const ScrollReveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children, delay = 0, className = ''
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.7, delay, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="stars">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={14}
        className={i < rating ? 'star-filled' : 'star-empty'}
        fill={i < rating ? '#fbbf24' : 'none'}
      />
    ))}
  </div>
);

const HomePage: React.FC = () => {
  const [tutors, setTutors] = React.useState<Tutor[]>([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    document.title = 'MediQueue – Home | Futuristic Tutor Booking';
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/tutors/featured');
        setTutors(res.data);
      } catch (err) {
        console.error('Failed to fetch featured tutors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const whyChooseUs = [
    {
      icon: <Shield size={28} />,
      title: 'Verified Tutors',
      description: 'Every tutor on MediQueue goes through a rigorous verification process to ensure quality education.',
      color: '#a855f7',
      bg: 'rgba(168,85,247,0.1)',
      stat: '500+ Verified',
    },
    {
      icon: <Clock size={28} />,
      title: 'Flexible Scheduling',
      description: 'Book sessions that fit your busy schedule. Choose from online, offline, or hybrid learning modes.',
      color: '#3b82f6',
      bg: 'rgba(59,130,246,0.1)',
      stat: '24/7 Available',
    },
    {
      icon: <DollarSign size={28} />,
      title: 'Affordable Pricing',
      description: 'Transparent pricing with no hidden fees. Find expert tutors at rates that suit your budget.',
      color: '#22c55e',
      bg: 'rgba(34,197,94,0.1)',
      stat: 'From $60/hr',
    },
    {
      icon: <Monitor size={28} />,
      title: 'Online Learning Support',
      description: 'Full support for virtual classrooms, digital tools, and interactive online learning sessions.',
      color: '#06b6d4',
      bg: 'rgba(6,182,212,0.1)',
      stat: '100% Online Ready',
    },
  ];

  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      {/* HERO */}
      <HeroSection />

      {/* ==================== AVAILABLE TUTORS ==================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="neon-circle" style={{
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, #a855f7, transparent)',
          top: '-100px', right: '-100px',
        }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4"
              style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)', color: '#a855f7' }}>
              <Star size={14} fill="#a855f7" />
              Featured Tutors
            </div>
            <h2 className="section-title mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-primary)' }}>
              Meet Our <span className="gradient-text">Expert Tutors</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Discover world-class educators ready to help you achieve your academic goals with personalized sessions.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            ) : tutors.length > 0 ? (
              tutors.map((tutor, i) => (
                <TutorCard key={tutor._id} tutor={tutor} index={i} />
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-sm text-gray-400">
                No tutors available at the moment.
              </div>
            )}
          </div>

          <ScrollReveal delay={0.4} className="text-center mt-12">
            <Link to="/tutors">
              <motion.button
                className="btn-neon px-8 py-3.5 text-base flex items-center gap-2 mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>View All Tutors</span>
                <ArrowRight size={18} />
              </motion.button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ==================== WHY CHOOSE US ==================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative" style={{ background: 'var(--bg-secondary)' }}>
        <div className="neon-circle" style={{
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, #3b82f6, transparent)',
          bottom: '-200px', left: '-150px',
        }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4"
              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', color: '#3b82f6' }}>
              <CheckCircle size={14} />
              Why MediQueue
            </div>
            <h2 className="section-title mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-primary)' }}>
              The <span className="gradient-text">Smarter Way</span> to Learn
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              We've reimagined the tutoring experience from the ground up for the modern learner.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.1}>
                <motion.div
                  className="glass-card p-6 h-full flex flex-col"
                  whileHover={{ y: -8, borderColor: item.color + '60' }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: item.bg, color: item.color }}
                  >
                    {item.icon}
                  </div>
                  <div
                    className="text-sm font-bold mb-2"
                    style={{
                      background: item.bg,
                      color: item.color,
                      display: 'inline-block',
                      padding: '2px 10px',
                      borderRadius: '50px',
                      border: `1px solid ${item.color}40`,
                      marginBottom: '12px',
                    }}
                  >
                    {item.stat}
                  </div>
                  <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {item.description}
                  </p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>

          {/* Stats Row */}
          <ScrollReveal delay={0.4} className="mt-16">
            <div
              className="glass-card p-8 grid grid-cols-2 lg:grid-cols-4 gap-8"
              style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.05), rgba(59,130,246,0.05))' }}
            >
              {[
                { value: '10,000+', label: 'Happy Students', color: '#a855f7' },
                { value: '500+', label: 'Expert Tutors', color: '#3b82f6' },
                { value: '15+', label: 'Subjects Available', color: '#22c55e' },
                { value: '98%', label: 'Success Rate', color: '#f59e0b' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="text-3xl lg:text-4xl font-bold mb-2" style={{ color: stat.color, fontFamily: 'Space Grotesk, sans-serif' }}>
                    {stat.value}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="neon-circle" style={{
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, #ec4899, transparent)',
          top: '-100px', right: '-100px',
        }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4"
              style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', color: '#fbbf24' }}>
              <Star size={14} fill="#fbbf24" />
              Student Reviews
            </div>
            <h2 className="section-title mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-primary)' }}>
              What Our <span className="gradient-text">Students Say</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Join thousands of students who have transformed their learning experience with MediQueue.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <Swiper
              modules={[Pagination, Autoplay]}
              slidesPerView={1}
              spaceBetween={24}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="pb-12"
            >
              {testimonials.map((t) => (
                <SwiperSlide key={t.id}>
                  <motion.div
                    className="glass-card p-6 h-full"
                    whileHover={{ y: -6, borderColor: 'rgba(168,85,247,0.4)' }}
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <img
                        src={t.image}
                        alt={t.name}
                        className="w-12 h-12 rounded-full object-cover"
                        style={{ border: '2px solid rgba(168,85,247,0.4)' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=a855f7&color=fff&size=100`;
                        }}
                      />
                      <div>
                        <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                        <p className="text-xs" style={{ color: '#a855f7' }}>{t.role}</p>
                        <StarRating rating={t.rating} />
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      "{t.review}"
                    </p>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </ScrollReveal>
        </div>
      </section>

      {/* ==================== CTA BANNER ==================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <motion.div
              className="glass-card p-10 lg:p-16 text-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(59,130,246,0.1))',
                border: '1px solid rgba(168,85,247,0.3)',
              }}
            >
              <div className="neon-circle" style={{
                width: '300px', height: '300px',
                background: 'radial-gradient(circle, #a855f7, transparent)',
                top: '-100px', left: '-50px',
              }} />
              <div className="neon-circle" style={{
                width: '300px', height: '300px',
                background: 'radial-gradient(circle, #3b82f6, transparent)',
                bottom: '-100px', right: '-50px',
              }} />

              <div className="relative z-10">
                <h2 className="section-title mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-primary)' }}>
                  Ready to Start Your <span className="gradient-text">Learning Journey?</span>
                </h2>
                <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                  Join 10,000+ students already learning with top tutors on MediQueue. Your first session is just a click away.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link to="/register">
                    <motion.button
                      className="btn-neon px-10 py-4 text-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>Start Learning Today</span>
                    </motion.button>
                  </Link>
                  <Link to="/tutors">
                    <motion.button
                      className="px-10 py-4 rounded-xl text-lg font-semibold"
                      style={{
                        background: 'var(--glass)',
                        border: '1px solid var(--glass-border)',
                        color: 'var(--text-primary)',
                      }}
                      whileHover={{ scale: 1.03, borderColor: 'rgba(168,85,247,0.4)' }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Browse Tutors
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>

      {/* ==================== FEATURES SECTION ==================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal className="text-center mb-14">
            <h2 className="section-title mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-primary)' }}>
              Everything You Need to <span className="gradient-text">Succeed</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              MediQueue is packed with features designed to give you the best learning experience possible.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: <Zap size={24} />,
                title: 'Instant Booking',
                desc: 'Book a session in under 60 seconds. No lengthy forms, no waiting. Just select, confirm, and start learning.',
                color: '#a855f7',
                bg: 'rgba(168,85,247,0.08)',
                border: 'rgba(168,85,247,0.2)',
              },
              {
                icon: <Globe size={24} />,
                title: 'Global Tutors',
                desc: 'Access educators from the world\'s top universities including MIT, Stanford, Harvard, Oxford, and more.',
                color: '#3b82f6',
                bg: 'rgba(59,130,246,0.08)',
                border: 'rgba(59,130,246,0.2)',
              },
              {
                icon: <Lock size={24} />,
                title: 'Secure & Private',
                desc: 'Your learning data is encrypted and secure. We use JWT authentication and industry-standard security protocols.',
                color: '#22c55e',
                bg: 'rgba(34,197,94,0.08)',
                border: 'rgba(34,197,94,0.2)',
              },
              {
                icon: <TrendingUp size={24} />,
                title: 'Track Progress',
                desc: 'Monitor your learning journey with session history, booking analytics, and personalized performance insights.',
                color: '#f59e0b',
                bg: 'rgba(245,158,11,0.08)',
                border: 'rgba(245,158,11,0.2)',
              },
            ].map((feature, i) => (
              <ScrollReveal key={feature.title} delay={i * 0.1}>
                <motion.div
                  className="glass-card p-6 flex items-start gap-5"
                  whileHover={{ y: -4, borderColor: feature.border }}
                  style={{ border: '1px solid var(--glass-border)' }}
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: feature.bg, color: feature.color }}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
