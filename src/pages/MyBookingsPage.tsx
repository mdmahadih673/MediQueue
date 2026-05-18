import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, Mail, X, BookOpen, CheckCircle, Clock } from 'lucide-react';
import type { Booking } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import api from '../utils/api';

const MyBookingsPage: React.FC = () => {
  useEffect(() => { document.title = 'MediQueue – My Booked Sessions'; }, []);

  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);

  const refresh = async () => {
    if (user?.email) {
      try {
        const response = await api.get('/bookings/my-bookings');
        setBookings(response.data);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
      }
    }
  };

  useEffect(() => { refresh(); }, [user]);

  const handleCancel = async (booking: Booking) => {
    const result = await Swal.fire({
      title: 'Cancel Booking?',
      text: `Cancel your session with ${booking.tutorName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it',
      cancelButtonText: 'Keep it',
      background: '#0f172a',
      color: '#f1f5f9',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
    });

    if (result.isConfirmed) {
      try {
        await api.patch(`/bookings/${booking._id}/cancel`);
        toast.success('Booking cancelled successfully.');
        refresh();
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to cancel booking.');
      }
    }
  };

  const statusMap = {
    confirmed: { label: 'Confirmed', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)', icon: <CheckCircle size={12} /> },
    pending: { label: 'Pending', color: '#eab308', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.3)', icon: <Clock size={12} /> },
    cancelled: { label: 'Cancelled', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', icon: <X size={12} /> },
  };

  const active = bookings.filter(b => b.bookingStatus !== 'cancelled');
  const cancelled = bookings.filter(b => b.bookingStatus === 'cancelled');

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingTop: '80px' }}>
      <div className="neon-circle" style={{ width: '400px', height: '400px', background: 'radial-gradient(circle, #a855f7, transparent)', top: '-100px', right: '-100px' }} />
      <div className="neon-circle" style={{ width: '300px', height: '300px', background: 'radial-gradient(circle, #3b82f6, transparent)', bottom: '-50px', left: '-50px' }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-2"
            style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)', color: '#a855f7' }}>
            <BookOpen size={12} />
            {active.length} Active Session{active.length !== 1 ? 's' : ''}
          </div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
            My Booked <span className="gradient-text">Sessions</span>
          </h1>
        </motion.div>

        {bookings.length === 0 ? (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
              style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
              <Calendar size={36} style={{ color: '#a855f7' }} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
              No Bookings Yet
            </h3>
            <p className="text-sm max-w-sm" style={{ color: 'var(--text-muted)' }}>
              You haven't booked any sessions. Explore our tutors to find the perfect match.
            </p>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Active Bookings */}
            {active.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Active Sessions
                </h2>
                <AnimatePresence>
                  {active.map((booking, i) => {
                    const status = statusMap[booking.bookingStatus];
                    return (
                      <motion.div
                        key={booking._id}
                        className="glass-card p-5 mb-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: i * 0.08 }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <div className="flex items-start gap-2">
                              <BookOpen size={14} style={{ color: '#a855f7', marginTop: '2px' }} />
                              <div>
                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Tutor</p>
                                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{booking.tutorName}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <User size={14} style={{ color: '#3b82f6', marginTop: '2px' }} />
                              <div>
                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Student</p>
                                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{booking.studentName}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Mail size={14} style={{ color: '#06b6d4', marginTop: '2px' }} />
                              <div>
                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Email</p>
                                <p className="text-sm truncate max-w-32" style={{ color: 'var(--text-primary)' }}>{booking.studentEmail}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Calendar size={14} style={{ color: '#f59e0b', marginTop: '2px' }} />
                              <div>
                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Booked On</p>
                                <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                                  {new Date(booking.bookingDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                              style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}` }}
                            >
                              {status.icon}
                              {status.label}
                            </span>
                            <motion.button
                              onClick={() => handleCancel(booking)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <X size={12} />
                              Cancel
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

            {/* Cancelled Bookings */}
            {cancelled.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold mb-3 mt-4" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Cancelled Sessions
                </h2>
                {cancelled.map((booking, i) => (
                  <motion.div
                    key={booking._id}
                    className="glass-card p-5 mb-3 opacity-60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{booking.tutorName}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{booking.studentEmail}</p>
                      </div>
                      <span
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold w-fit"
                        style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}
                      >
                        <X size={12} />
                        Cancelled
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
