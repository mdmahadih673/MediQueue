import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield, Users, GraduationCap, Calendar, Clock, MapPin, DollarSign,
  Layers, Search, SlidersHorizontal, Trash2, Pencil, X, Check, BookOpen, AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { subjects } from '../data/mockData';
import type { Tutor, Booking } from '../data/mockData';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import api from '../utils/api';

interface AdminUser {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  createdAt?: string;
}

const AdminDashboard: React.FC = () => {
  useEffect(() => {
    document.title = 'MediQueue – Admin Command Center';
  }, []);

  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      toast.error('Unauthorized access. Admin role required.');
      navigate('/');
    }
  }, [user, navigate]);

  const [activeTab, setActiveTab] = useState<'tutors' | 'bookings' | 'users'>('tutors');
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Search/Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');

  // Edit Tutor state
  const [editTutor, setEditTutor] = useState<Tutor | null>(null);
  const [editForm, setEditForm] = useState<Partial<Tutor>>({});

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Tutors
      const tutorsRes = await api.get('/tutors');
      setTutors(tutorsRes.data);

      // Fetch Bookings
      const bookingsRes = await api.get('/bookings');
      setBookings(bookingsRes.data);

      // Fetch Users
      const usersRes = await api.get('/auth/users');
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      toast.error('Failed to load administrative data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchData();
    }
  }, [user]);

  // Tutor handlers
  const openEdit = (tutor: Tutor) => {
    setEditTutor(tutor);
    setEditForm({
      tutorName: tutor.tutorName,
      subject: tutor.subject,
      fee: tutor.fee,
      totalSlot: tutor.totalSlot,
      availableTime: tutor.availableTime,
      location: tutor.location,
      experience: tutor.experience,
      teachingMode: tutor.teachingMode,
      sessionDate: tutor.sessionDate,
    });
  };

  const handleUpdateTutor = async () => {
    if (!editTutor) return;
    try {
      await api.put(`/tutors/${editTutor._id}`, editForm);
      toast.success(`Successfully updated tutor ${editTutor.tutorName}!`);
      setEditTutor(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update tutor profile.');
    }
  };

  const handleDeleteTutor = async (tutor: Tutor) => {
    const result = await Swal.fire({
      title: 'Remove Tutor Profile?',
      text: `Are you sure you want to completely delete the profile of ${tutor.tutorName}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete Profile',
      cancelButtonText: 'Cancel',
      background: '#0f172a',
      color: '#f1f5f9',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/tutors/${tutor._id}`);
        toast.success(`Successfully removed tutor ${tutor.tutorName}.`);
        fetchData();
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to remove tutor.');
      }
    }
  };

  // Booking handlers
  const handleCancelBooking = async (booking: Booking) => {
    const result = await Swal.fire({
      title: 'Cancel Student Booking?',
      text: `Are you sure you want to cancel the booking for ${booking.studentName} with tutor ${booking.tutorName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Cancel Session',
      cancelButtonText: 'No, Keep Active',
      background: '#0f172a',
      color: '#f1f5f9',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
    });

    if (result.isConfirmed) {
      try {
        await api.patch(`/bookings/${booking._id}/cancel`);
        toast.success('Student booking cancelled successfully.');
        fetchData();
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to cancel booking.');
      }
    }
  };

  // Filtering lists
  const filteredTutors = tutors.filter(t => {
    const queryMatch = t.tutorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       t.institution.toLowerCase().includes(searchQuery.toLowerCase());
    const subjectMatch = selectedSubject === 'All' || t.subject === selectedSubject;
    return queryMatch && subjectMatch;
  });

  const filteredBookings = bookings.filter(b => {
    return b.tutorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           b.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           b.studentEmail.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredUsers = users.filter(u => {
    return u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           u.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (!user || user.role !== 'admin') return null;

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingTop: '80px' }}>
      {/* Background Glows */}
      <div className="neon-circle" style={{ width: '450px', height: '450px', background: 'radial-gradient(circle, #a855f7, transparent)', top: '-100px', right: '-100px' }} />
      <div className="neon-circle" style={{ width: '450px', height: '450px', background: 'radial-gradient(circle, #3b82f6, transparent)', bottom: '-100px', left: '-100px' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* Header Title */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-2"
              style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.3)', color: '#a855f7' }}>
              <Shield size={12} />
              SYSTEM LEVEL PRIVILEGES ENABLED
            </div>
            <h1 className="text-3xl font-extrabold" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
              Admin <span className="gradient-text">Command Center</span>
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Manage all platform tutor slots, inspect registered user directories, and audit active sessions.
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-emerald-400">Database Engine Live</span>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {[
            { label: 'Total Tutors', value: tutors.length, icon: <GraduationCap size={24} style={{ color: '#a855f7' }} />, color: '#a855f7' },
            { label: 'Total Bookings', value: bookings.length, icon: <Calendar size={24} style={{ color: '#3b82f6' }} />, color: '#3b82f6' },
            { label: 'Registered Users', value: users.length, icon: <Users size={24} style={{ color: '#06b6d4' }} />, color: '#06b6d4' },
          ].map(stat => (
            <div key={stat.label} className="glass-card p-6 flex items-center justify-between relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-24 h-24 rounded-full opacity-10 group-hover:scale-125 transition-transform duration-500" 
                style={{ background: stat.color, filter: 'blur(15px)', transform: 'translate(20px, -20px)' }} />
              <div>
                <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                {loading ? (
                  <div className="h-8 w-12 rounded bg-slate-800 animate-pulse mt-1" />
                ) : (
                  <h3 className="text-3xl font-extrabold" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>{stat.value}</h3>
                )}
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid var(--glass-border)' }}>
                {stat.icon}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Controls Bar */}
        <div className="glass-card p-4 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex bg-slate-900/50 p-1.5 rounded-xl border border-slate-800/80 w-full md:w-fit overflow-x-auto scrollbar-hide">
            {[
              { id: 'tutors', label: 'Tutors', icon: <GraduationCap size={14} /> },
              { id: 'bookings', label: 'Bookings', icon: <Calendar size={14} /> },
              { id: 'users', label: 'Users Directory', icon: <Users size={14} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setSearchQuery(''); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'text-white' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                style={activeTab === tab.id ? {
                  background: 'linear-gradient(135deg, #a855f7, #3b82f6)',
                  boxShadow: '0 4px 12px rgba(168,85,247,0.2)'
                } : {}}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center flex-1 max-w-md w-full ml-auto">
            <div className="relative flex-1">
              <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="input pl-9 text-xs py-2"
                placeholder={
                  activeTab === 'tutors' 
                    ? "Search tutors..." 
                    : activeTab === 'bookings'
                    ? "Search student bookings..."
                    : "Search registered users..."
                }
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            {activeTab === 'tutors' && (
              <select
                className="input text-xs py-2 sm:max-w-36"
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value)}
              >
                <option value="All">All Subjects</option>
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            )}
          </div>
        </div>

        {/* Dynamic Panels */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="glass-card p-12 flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-transparent border-t-purple-500 border-r-blue-500 animate-spin" />
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Synching platform database logs...</p>
            </div>
          ) : activeTab === 'tutors' ? (
            <motion.div
              key="tutors-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              {filteredTutors.length === 0 ? (
                <div className="glass-card p-12 text-center">
                  <GraduationCap size={36} className="mx-auto mb-3 opacity-40 text-purple-400" />
                  <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>No matching tutor profiles</h4>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Try adjusting your search filters above.</p>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block glass-card overflow-hidden">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Tutor</th>
                          <th>Subject</th>
                          <th>Institution</th>
                          <th>Fee</th>
                          <th>Slots Left</th>
                          <th>Mode</th>
                          <th>Creator</th>
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTutors.map(t => (
                          <tr key={t._id}>
                            <td>
                              <div className="flex items-center gap-3">
                                <img src={t.tutorImage} className="w-9 h-9 rounded-xl object-cover" 
                                  onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.tutorName)}&background=a855f7&color=fff`; }} />
                                <div>
                                  <Link to={`/tutors/${t._id}`} className="font-bold text-sm hover:text-purple-400 transition-colors" style={{ color: 'var(--text-primary)' }}>{t.tutorName}</Link>
                                  <p className="text-xxs" style={{ color: 'var(--text-muted)' }}>ID: {t._id}</p>
                                </div>
                              </div>
                            </td>
                            <td><span className="badge-neon text-xxs">{t.subject}</span></td>
                            <td className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t.institution}</td>
                            <td><span className="font-bold" style={{ color: '#a855f7' }}>${t.fee}</span></td>
                            <td className="text-xs font-semibold" style={{ color: t.totalSlot > 0 ? '#22c55e' : '#ef4444' }}>{t.totalSlot}</td>
                            <td>
                              <span className="text-xxs px-2 py-0.5 rounded-full font-medium" style={{
                                background: t.teachingMode === 'Online' ? 'rgba(34,197,94,0.1)' : t.teachingMode === 'Offline' ? 'rgba(251,191,36,0.1)' : 'rgba(168,85,247,0.1)',
                                color: t.teachingMode === 'Online' ? '#22c55e' : t.teachingMode === 'Offline' ? '#fbbf24' : '#a855f7'
                              }}>{t.teachingMode}</span>
                            </td>
                            <td className="text-xs truncate max-w-28" style={{ color: 'var(--text-muted)' }}>{t.createdByEmail}</td>
                            <td>
                              <div className="flex items-center justify-end gap-2">
                                <motion.button onClick={() => openEdit(t)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', color: '#3b82f6' }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <Pencil size={12} />
                                </motion.button>
                                <motion.button onClick={() => handleDeleteTutor(t)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <Trash2 size={12} />
                                </motion.button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards View */}
                  <div className="md:hidden flex flex-col gap-4">
                    {filteredTutors.map(t => (
                      <div key={t._id} className="glass-card p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex gap-3">
                            <img src={t.tutorImage} className="w-12 h-12 rounded-xl object-cover" 
                              onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.tutorName)}&background=a855f7&color=fff`; }} />
                            <div>
                              <Link to={`/tutors/${t._id}`} className="font-bold text-sm hover:text-purple-400 transition-colors" style={{ color: 'var(--text-primary)' }}>{t.tutorName}</Link>
                              <p className="text-xxs mt-0.5" style={{ color: '#a855f7' }}>{t.subject} · {t.institution}</p>
                              <p className="text-xs font-bold mt-1" style={{ color: 'var(--text-secondary)' }}>${t.fee}/hr · {t.totalSlot} slots left</p>
                              <p className="text-xxs mt-1" style={{ color: 'var(--text-muted)' }}>Created by: {t.createdByEmail}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <motion.button onClick={() => openEdit(t)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.08)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)' }}>
                              <Pencil size={12} />
                            </motion.button>
                            <motion.button onClick={() => handleDeleteTutor(t)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                              <Trash2 size={12} />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          ) : activeTab === 'bookings' ? (
            <motion.div
              key="bookings-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              {filteredBookings.length === 0 ? (
                <div className="glass-card p-12 text-center">
                  <Calendar size={36} className="mx-auto mb-3 opacity-40 text-purple-400" />
                  <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>No student bookings found</h4>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Try adjusting your search queries.</p>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block glass-card overflow-hidden">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Tutor Name</th>
                          <th>Student Name</th>
                          <th>Student Email</th>
                          <th>Student Phone</th>
                          <th>Booked Date</th>
                          <th>Status</th>
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBookings.map(b => (
                          <tr key={b._id} style={{ opacity: b.bookingStatus === 'cancelled' ? 0.65 : 1 }}>
                            <td className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{b.tutorName}</td>
                            <td className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{b.studentName}</td>
                            <td className="text-xs" style={{ color: 'var(--text-secondary)' }}>{b.studentEmail}</td>
                            <td className="text-xs" style={{ color: 'var(--text-secondary)' }}>{b.studentPhone}</td>
                            <td className="text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(b.bookingDate).toLocaleDateString()}</td>
                            <td>
                              <span className="text-xxs px-2 py-0.5 rounded-full font-medium" style={{
                                background: b.bookingStatus === 'confirmed' ? 'rgba(34,197,94,0.1)' : b.bookingStatus === 'cancelled' ? 'rgba(239,68,68,0.1)' : 'rgba(234,179,8,0.1)',
                                color: b.bookingStatus === 'confirmed' ? '#22c55e' : b.bookingStatus === 'cancelled' ? '#ef4444' : '#eab308'
                              }}>{b.bookingStatus}</span>
                            </td>
                            <td>
                              <div className="flex items-center justify-end">
                                {b.bookingStatus !== 'cancelled' ? (
                                  <motion.button 
                                    onClick={() => handleCancelBooking(b)} 
                                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xxs font-semibold" 
                                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }} 
                                    whileHover={{ scale: 1.05 }} 
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <X size={10} />
                                    Cancel Booking
                                  </motion.button>
                                ) : (
                                  <span className="text-xxs font-semibold text-slate-500 px-2.5 py-1.5">No Actions</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards View */}
                  <div className="md:hidden flex flex-col gap-4">
                    {filteredBookings.map(b => (
                      <div key={b._id} className="glass-card p-4" style={{ opacity: b.bookingStatus === 'cancelled' ? 0.65 : 1 }}>
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Tutor: {b.tutorName}</h4>
                              <p className="text-xs font-semibold mt-0.5" style={{ color: '#a855f7' }}>Student: {b.studentName}</p>
                            </div>
                            <span className="text-xxs px-2 py-0.5 rounded-full font-medium" style={{
                              background: b.bookingStatus === 'confirmed' ? 'rgba(34,197,94,0.1)' : b.bookingStatus === 'cancelled' ? 'rgba(239,68,68,0.1)' : 'rgba(234,179,8,0.1)',
                              color: b.bookingStatus === 'confirmed' ? '#22c55e' : b.bookingStatus === 'cancelled' ? '#ef4444' : '#eab308'
                            }}>{b.bookingStatus}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5 pt-2 text-xxs" style={{ borderTop: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                            <span>Email: {b.studentEmail}</span>
                            <span>Phone: {b.studentPhone}</span>
                            <span className="col-span-2">Booked On: {new Date(b.bookingDate).toLocaleDateString()}</span>
                          </div>
                          {b.bookingStatus !== 'cancelled' && (
                            <motion.button 
                              onClick={() => handleCancelBooking(b)} 
                              className="w-full mt-2 py-2 flex items-center justify-center gap-1.5 rounded-lg text-xxs font-semibold" 
                              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}
                            >
                              <X size={10} />
                              Cancel Booking
                            </motion.button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="users-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              {filteredUsers.length === 0 ? (
                <div className="glass-card p-12 text-center">
                  <Users size={36} className="mx-auto mb-3 opacity-40 text-purple-400" />
                  <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>No registered users found</h4>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Try adjusting your search query.</p>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block glass-card overflow-hidden">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Email</th>
                          <th>Firebase UID</th>
                          <th>Registration Date</th>
                          <th>Default Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map(u => (
                          <tr key={u.uid}>
                            <td>
                              <div className="flex items-center gap-3">
                                <img src={u.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=3b82f6&color=fff`} className="w-8 h-8 rounded-full object-cover" />
                                <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{u.name}</span>
                              </div>
                            </td>
                            <td className="text-xs" style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                            <td className="text-xs" style={{ color: 'var(--text-muted)' }}><code>{u.uid}</code></td>
                            <td className="text-xs" style={{ color: 'var(--text-secondary)' }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</td>
                            <td>
                              <span className="text-xxs px-2.5 py-0.5 rounded-full font-semibold" style={{
                                background: u.email === 'mdmahadih673@gmail.com' ? 'rgba(168,85,247,0.12)' : 'rgba(71,85,105,0.12)',
                                color: u.email === 'mdmahadih673@gmail.com' ? '#a855f7' : '#94a3b8',
                                border: `1px solid ${u.email === 'mdmahadih673@gmail.com' ? 'rgba(168,85,247,0.25)' : 'rgba(71,85,105,0.25)'}`
                              }}>{u.email === 'mdmahadih673@gmail.com' ? 'Global Admin' : 'Student/Tutor'}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards View */}
                  <div className="md:hidden flex flex-col gap-4">
                    {filteredUsers.map(u => (
                      <div key={u.uid} className="glass-card p-4">
                        <div className="flex items-center gap-3">
                          <img src={u.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=3b82f6&color=fff`} className="w-10 h-10 rounded-full object-cover" />
                          <div>
                            <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{u.name}</h4>
                            <p className="text-xxs" style={{ color: 'var(--text-muted)' }}>{u.email}</p>
                            <p className="text-xxs mt-0.5" style={{ color: 'var(--text-muted)' }}>Registered: {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</p>
                            <span className="inline-block mt-1 text-xxs px-2 py-0.5 rounded-full font-semibold" style={{
                              background: u.email === 'mdmahadih673@gmail.com' ? 'rgba(168,85,247,0.12)' : 'rgba(71,85,105,0.12)',
                              color: u.email === 'mdmahadih673@gmail.com' ? '#a855f7' : '#94a3b8'
                            }}>{u.email === 'mdmahadih673@gmail.com' ? 'Global Admin' : 'Student/Tutor'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Edit Modal (Copied and scaled from MyTutorsPage with Admin privileges) */}
      <AnimatePresence>
        {editTutor && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) setEditTutor(null); }}
          >
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                      Edit {editTutor.tutorName}
                    </h3>
                    <p className="text-xxs" style={{ color: '#a855f7' }}>Global Admin Overrides Enabled</p>
                  </div>
                  <motion.button
                    onClick={() => setEditTutor(null)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}
                    whileHover={{ scale: 1.1, color: '#ef4444' }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={16} />
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Tutor Name', field: 'tutorName', type: 'text', icon: <GraduationCap size={14} /> },
                    { label: 'Fee ($)', field: 'fee', type: 'number', icon: <DollarSign size={14} /> },
                    { label: 'Total Slots', field: 'totalSlot', type: 'number', icon: <Layers size={14} /> },
                    { label: 'Available Time', field: 'availableTime', type: 'text', icon: <Clock size={14} /> },
                    { label: 'Session Date', field: 'sessionDate', type: 'date', icon: <Calendar size={14} /> },
                    { label: 'Location', field: 'location', type: 'text', icon: <MapPin size={14} /> },
                    { label: 'Experience', field: 'experience', type: 'text', icon: <Layers size={14} /> },
                  ].map(f => (
                    <div key={f.field}>
                      <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>{f.label}</label>
                      <div className="relative">
                        <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>{f.icon}</span>
                        <input
                          type={f.type}
                          className="input pl-8 text-sm py-2"
                          value={editForm[f.field as keyof typeof editForm] as string ?? ''}
                          onChange={e => setEditForm(prev => ({ ...prev, [f.field]: f.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value }))}
                        />
                      </div>
                    </div>
                  ))}

                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Subject</label>
                    <div className="relative">
                      <BookOpen size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <select
                        className="input pl-8 text-sm py-2"
                        value={editForm.subject || ''}
                        onChange={e => setEditForm(prev => ({ ...prev, subject: e.target.value }))}
                      >
                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Teaching Mode</label>
                  <div className="glass-radio-group">
                    {(['Online', 'Offline', 'Both'] as const).map(mode => (
                      <label key={mode} className="radio-option">
                        <input
                          type="radio"
                          name="editMode"
                          value={mode}
                          checked={editForm.teachingMode === mode}
                          onChange={() => setEditForm(prev => ({ ...prev, teachingMode: mode }))}
                        />
                        <span className="radio-label">{mode}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <motion.button
                    onClick={handleUpdateTutor}
                    className="btn-neon flex-1 py-3 text-sm flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Check size={16} />
                    <span>Save Platform Overrides</span>
                  </motion.button>
                  <motion.button
                    onClick={() => setEditTutor(null)}
                    className="flex-1 py-3 rounded-xl text-sm font-medium"
                    style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
