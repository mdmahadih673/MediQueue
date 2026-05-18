import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  GraduationCap, Pencil, Trash2, X, Check, Plus,
  DollarSign, Hash, Monitor, MapPin, Clock, Calendar, BookOpen, Layers
} from 'lucide-react';
import { subjects } from '../data/mockData';
import type { Tutor } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import api from '../utils/api';

const MyTutorsPage: React.FC = () => {
  useEffect(() => { document.title = 'MediQueue – My Tutors'; }, []);

  const { user } = useAuth();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [editTutor, setEditTutor] = useState<Tutor | null>(null);
  const [editForm, setEditForm] = useState<Partial<Tutor>>({});

  const refresh = async () => {
    if (user?.email) {
      try {
        const response = await api.get('/tutors', {
          params: { email: user.email }
        });
        setTutors(response.data);
      } catch (err) {
        console.error('Failed to fetch user tutors:', err);
      }
    }
  };

  useEffect(() => { refresh(); }, [user]);

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

  const handleUpdate = async () => {
    if (!editTutor) return;
    try {
      await api.put(`/tutors/${editTutor._id}`, editForm);
      toast.success('Tutor updated successfully!');
      setEditTutor(null);
      refresh();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update tutor. Please try again.');
    }
  };

  const handleDelete = async (tutor: Tutor) => {
    const result = await Swal.fire({
      title: 'Delete Tutor?',
      text: `Are you sure you want to remove ${tutor.tutorName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      background: '#0f172a',
      color: '#f1f5f9',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/tutors/${tutor._id}`);
        toast.success('Tutor removed successfully.');
        refresh();
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to delete tutor.');
      }
    }
  };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingTop: '80px' }}>
      <div className="neon-circle" style={{ width: '400px', height: '400px', background: 'radial-gradient(circle, #a855f7, transparent)', top: '-100px', right: '-100px' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-2"
              style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)', color: '#a855f7' }}>
              <GraduationCap size={12} />
              {tutors.length} Tutors
            </div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
              My <span className="gradient-text">Tutors</span>
            </h1>
          </div>
          <Link to="/add-tutor">
            <motion.button
              className="btn-neon px-5 py-2.5 text-sm flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={16} />
              <span>Add Tutor</span>
            </motion.button>
          </Link>
        </motion.div>

        {tutors.length === 0 ? (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
              style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
              <GraduationCap size={36} style={{ color: '#a855f7' }} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
              No Tutors Yet
            </h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              You haven't added any tutors. Start by adding your first tutor!
            </p>
            <Link to="/add-tutor">
              <motion.button className="btn-neon px-6 py-2.5 text-sm" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <span>Add Your First Tutor</span>
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block glass-card overflow-hidden">
              <table className="data-table">
                <thead>
                  <tr>
                    {['Tutor', 'Subject', 'Fee', 'Slots', 'Date', 'Mode', 'Actions'].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {tutors.map((t, i) => (
                      <motion.tr
                        key={t._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <td>
                          <div className="flex items-center gap-3">
                            <img
                              src={t.tutorImage}
                              alt={t.tutorName}
                              className="w-10 h-10 rounded-xl object-cover"
                              style={{ border: '1px solid rgba(168,85,247,0.3)' }}
                              onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.tutorName)}&background=a855f7&color=fff&size=100`; }}
                            />
                            <div>
                              <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{t.tutorName}</p>
                              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.institution}</p>
                            </div>
                          </div>
                        </td>
                        <td><span className="badge-neon">{t.subject}</span></td>
                        <td><span className="font-bold" style={{ color: '#a855f7' }}>${t.fee}</span></td>
                        <td>
                          <span style={{
                            color: t.totalSlot > 0 ? '#22c55e' : '#ef4444',
                            fontWeight: '600', fontSize: '0.85rem',
                          }}>
                            {t.totalSlot}
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{t.sessionDate}</td>
                        <td>
                          <span className="text-xs px-2 py-1 rounded-full font-medium" style={{
                            background: t.teachingMode === 'Online' ? 'rgba(34,197,94,0.1)' : t.teachingMode === 'Offline' ? 'rgba(251,191,36,0.1)' : 'rgba(168,85,247,0.1)',
                            color: t.teachingMode === 'Online' ? '#22c55e' : t.teachingMode === 'Offline' ? '#fbbf24' : '#a855f7',
                          }}>
                            {t.teachingMode}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <motion.button
                              onClick={() => openEdit(t)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#3b82f6' }}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Pencil size={14} />
                            </motion.button>
                            <motion.button
                              onClick={() => handleDelete(t)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 size={14} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col gap-4">
              {tutors.map((t, i) => (
                <motion.div
                  key={t._id}
                  className="glass-card p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <img src={t.tutorImage} alt={t.tutorName} className="w-14 h-14 rounded-xl object-cover" onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.tutorName)}&background=a855f7&color=fff&size=100`; }} />
                    <div className="flex-1">
                      <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{t.tutorName}</h3>
                      <p className="text-xs" style={{ color: '#a855f7' }}>{t.subject}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs font-bold" style={{ color: '#a855f7' }}>${t.fee}/hr</span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>·</span>
                        <span className="text-xs" style={{ color: t.totalSlot > 0 ? '#22c55e' : '#ef4444' }}>{t.totalSlot} slots</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <motion.button onClick={() => openEdit(t)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)' }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Pencil size={14} />
                      </motion.button>
                      <motion.button onClick={() => handleDelete(t)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Trash2 size={14} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
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
                  <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                    Edit {editTutor.tutorName}
                  </h3>
                  <motion.button
                    onClick={() => setEditTutor(null)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={16} />
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Tutor Name', field: 'tutorName', type: 'text', icon: <GraduationCap size={14} /> },
                    { label: 'Fee ($)', field: 'fee', type: 'number', icon: <DollarSign size={14} /> },
                    { label: 'Total Slots', field: 'totalSlot', type: 'number', icon: <Hash size={14} /> },
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
                          className="input pl-8 text-sm py-2.5"
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
                        className="input pl-8 text-sm py-2.5"
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
                        <span className="radio-label">
                          <Monitor size={11} />
                          {mode}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <motion.button
                    onClick={handleUpdate}
                    className="btn-neon flex-1 py-3 text-sm flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Check size={16} />
                    <span>Save Changes</span>
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

export default MyTutorsPage;
