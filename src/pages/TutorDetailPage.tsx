import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, MapPin, Star, BookOpen, Layers, DollarSign,
  Calendar, Monitor, Users, X, Phone, CheckCircle, AlertCircle, Shield, Pencil, Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Tilt from 'react-parallax-tilt';
import api from '../utils/api';
import type { Tutor } from '../data/mockData';
import { subjects } from '../data/mockData';
import LoadingSpinner from '../components/LoadingSpinner';
import Swal from 'sweetalert2';

const TutorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket'>('bKash');
  const [transactionId, setTransactionId] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState('');
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setUrl: (url: string) => void, setLoadingState: (b: boolean) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file.');
      return;
    }
    setLoadingState(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await api.post('/upload', {
          base64Data: reader.result,
          fileName: file.name
        });
        const serverUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : window.location.origin;
        setUrl(`${serverUrl}${res.data.fileUrl}`);
        toast.success('Screenshot uploaded successfully! 📸');
      } catch (err: any) {
        toast.error('Failed to upload image locally.');
        console.error(err);
      } finally {
        setLoadingState(false);
      }
    };
    reader.readAsDataURL(file);
  };
  const [pageLoading, setPageLoading] = useState(true);
  const [alreadyBooked, setAlreadyBooked] = useState(false);
  const [editTutor, setEditTutor] = useState<Tutor | null>(null);
  const [editForm, setEditForm] = useState<Partial<Tutor>>({});

  const openEdit = (t: Tutor) => {
    setEditTutor(t);
    setEditForm({
      tutorName: t.tutorName,
      subject: t.subject,
      fee: t.fee,
      totalSlot: t.totalSlot,
      availableTime: t.availableTime,
      location: t.location,
      experience: t.experience,
      teachingMode: t.teachingMode,
      sessionDate: t.sessionDate,
    });
  };

  const handleUpdate = async () => {
    if (!editTutor) return;
    try {
      await api.put(`/tutors/${editTutor._id}`, editForm);
      toast.success('Tutor updated successfully!');
      setEditTutor(null);
      fetchTutorDetails();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update tutor. Please try again.');
    }
  };

  const handleDelete = async (t: Tutor) => {
    const result = await Swal.fire({
      title: 'Delete Tutor?',
      text: `Are you sure you want to completely remove ${t.tutorName}?`,
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
        await api.delete(`/tutors/${t._id}`);
        toast.success('Tutor removed successfully.');
        navigate('/tutors');
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to delete tutor.');
      }
    }
  };

  const fetchTutorDetails = async () => {
    try {
      const res = await api.get(`/tutors/${id}`);
      setTutor(res.data);
      document.title = `MediQueue – ${res.data.tutorName}`;
      
      // If user is logged in, check if already booked this tutor
      if (user?.email) {
        const bookingsRes = await api.get('/bookings/my-bookings');
        const hasBooking = bookingsRes.data.some(
          (b: any) => b.tutorId === id && b.bookingStatus !== 'cancelled'
        );
        setAlreadyBooked(hasBooking);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load tutor details.');
      navigate('/tutors');
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchTutorDetails();
  }, [id, user]);

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (!tutor) return null;

  const today = new Date().toISOString().split('T')[0];
  const sessionDatePassed = tutor.sessionDate <= today;
  const hasSlots = tutor.totalSlot > 0;
  const canBook = hasSlots && sessionDatePassed;

  const getBlockMessage = () => {
    if (!hasSlots) return 'This session is fully booked. You can\'t join at the moment.';
    if (!sessionDatePassed) return `Booking is not available yet for this tutor. Session starts ${tutor.sessionDate}.`;
    return null;
  };

  const handleBook = async () => {
    if (!user) { navigate('/login'); return; }
    if (!phone.trim()) { toast.error('Please enter your phone number.'); return; }
    if (!transactionId.trim()) { toast.error('Please enter the payment Transaction ID.'); return; }

    setLoading(true);
    try {
      await api.post('/bookings', {
        tutorId: tutor._id,
        studentPhone: phone,
        paymentMethod,
        transactionId,
        paymentScreenshot,
      });
      toast.success('🎉 Session booked successfully!');
      setShowModal(false);
      setPhone('');
      setTransactionId('');
      setPaymentScreenshot('');
      fetchTutorDetails();
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Booking failed. Please try again.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const blockMessage = getBlockMessage();
  const modeColor = { Online: '#22c55e', Offline: '#fbbf24', Both: '#a855f7' }[tutor.teachingMode];

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingTop: '80px' }}>
      <div className="neon-circle" style={{
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, #a855f7, transparent)',
        top: '-100px', right: '-150px',
      }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="grid lg:grid-cols-5 gap-8"
        >
          {/* LEFT – Image & Quick Info */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} scale={1.02} transitionSpeed={400}>
              <div className="relative rounded-2xl overflow-hidden" style={{ height: '380px' }}>
                <img
                  src={tutor.tutorImage}
                  alt={tutor.tutorName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.tutorName)}&background=a855f7&color=fff&size=600`;
                  }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {tutor.tutorName}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span style={{ background: modeColor + '25', color: modeColor, border: `1px solid ${modeColor}60` }}
                      className="text-xs font-semibold px-2.5 py-1 rounded-full">
                      {tutor.teachingMode}
                    </span>
                    <span className="flex items-center gap-1 text-white text-sm">
                      <Star size={12} fill="#fbbf24" color="#fbbf24" />
                      {(tutor.rating ?? 4.5).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </Tilt>

            {/* Quick Stats */}
            <div className="glass-card p-5 grid grid-cols-2 gap-4">
              {[
                { icon: <DollarSign size={16} style={{ color: '#a855f7' }} />, label: 'Fee', value: `$${tutor.fee}/hr` },
                { icon: <Users size={16} style={{ color: '#22c55e' }} />, label: 'Slots', value: tutor.totalSlot > 0 ? `${tutor.totalSlot} left` : 'Full' },
                { icon: <Layers size={16} style={{ color: '#3b82f6' }} />, label: 'Experience', value: tutor.experience },
                { icon: <Monitor size={16} style={{ color: '#f59e0b' }} />, label: 'Mode', value: tutor.teachingMode },
              ].map(item => (
                <div key={item.label} className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">{item.icon}<span className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.label}</span></div>
                  <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT – Details */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            <div className="glass-card p-6">
              <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                {tutor.tutorName}
              </h1>
              <p className="text-lg mb-1" style={{ color: '#a855f7' }}>{tutor.institution}</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {tutor.description || 'Dedicated educator with extensive experience helping students excel in their academic journey.'}
              </p>
            </div>

            {/* Details Grid */}
            <div className="glass-card p-6">
              <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>Session Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: <BookOpen size={16} />, label: 'Subject', value: tutor.subject, color: '#a855f7' },
                  { icon: <Clock size={16} />, label: 'Available Time', value: tutor.availableTime, color: '#3b82f6' },
                  { icon: <Calendar size={16} />, label: 'Session Date', value: tutor.sessionDate, color: '#22c55e' },
                  { icon: <MapPin size={16} />, label: 'Location', value: tutor.location, color: '#f59e0b' },
                  { icon: <Users size={16} />, label: 'Available Days', value: tutor.availableDays || 'Flexible', color: '#ec4899' },
                  { icon: <DollarSign size={16} />, label: 'Hourly Rate', value: `$${tutor.fee}`, color: '#06b6d4' },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--glass)' }}>
                    <span style={{ color: item.color, marginTop: '2px' }}>{item.icon}</span>
                    <div>
                      <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>{item.label}</p>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Status */}
            {blockMessage && (
              <motion.div
                className="glass-card p-4 flex items-start gap-3"
                style={{ border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <AlertCircle size={20} style={{ color: '#ef4444', flexShrink: 0, marginTop: '1px' }} />
                <p className="text-sm" style={{ color: '#ef4444' }}>{blockMessage}</p>
              </motion.div>
            )}

            {alreadyBooked && (
              <motion.div
                className="glass-card p-4 flex items-start gap-3"
                style={{ border: '1px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.05)' }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <CheckCircle size={20} style={{ color: '#22c55e', flexShrink: 0 }} />
                <p className="text-sm" style={{ color: '#22c55e' }}>You have already booked this session.</p>
              </motion.div>
            )}

            {/* CTA */}
            <div className="flex gap-4">
              {!user ? (
                <motion.button
                  onClick={() => navigate('/login')}
                  className="btn-neon flex-1 py-4 text-base"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Login to Book Session</span>
                </motion.button>
              ) : (
                <motion.button
                  onClick={() => setShowModal(true)}
                  className="btn-neon flex-1 py-4 text-base"
                  disabled={!canBook || alreadyBooked}
                  style={{ opacity: (!canBook || alreadyBooked) ? 0.5 : 1, cursor: (!canBook || alreadyBooked) ? 'not-allowed' : 'pointer' }}
                  whileHover={{ scale: canBook && !alreadyBooked ? 1.02 : 1 }}
                  whileTap={{ scale: canBook && !alreadyBooked ? 0.98 : 1 }}
                >
                  <span>{alreadyBooked ? 'Already Booked' : 'Book This Session'}</span>
                </motion.button>
              )}
            </div>

            {/* Admin Controls */}
            {user?.role === 'admin' && (
              <motion.div
                className="glass-card p-5 mt-2"
                style={{ border: '1px solid rgba(168,85,247,0.3)', background: 'rgba(168,85,247,0.04)' }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Shield size={16} style={{ color: '#a855f7' }} />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#a855f7' }}>Global Admin Console</span>
                </div>
                <p className="text-xxs mb-4" style={{ color: 'var(--text-muted)' }}>
                  As an administrator, you have complete read, write, and delete permissions for this profile.
                </p>
                <div className="flex gap-3">
                  <motion.button
                    onClick={() => openEdit(tutor)}
                    className="flex-1 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                    style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', color: '#3b82f6' }}
                    whileHover={{ scale: 1.02, background: 'rgba(59,130,246,0.18)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Pencil size={12} />
                    Edit Profile
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(tutor)}
                    className="flex-1 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                    style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}
                    whileHover={{ scale: 1.02, background: 'rgba(239,68,68,0.18)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Trash2 size={12} />
                    Delete Profile
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
          >
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                    Book Session with {tutor.tutorName}
                  </h3>
                  <motion.button
                    onClick={() => setShowModal(false)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}
                    whileHover={{ scale: 1.1, background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={16} />
                  </motion.button>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Auto-filled fields */}
                  {[
                    { label: 'Tutor Name', value: tutor.tutorName },
                    { label: 'Your Name', value: user?.displayName || '' },
                    { label: 'Your Email', value: user?.email || '' },
                  ].map(field => (
                    <div key={field.label}>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>{field.label}</label>
                      <input className="input opacity-70" value={field.value} readOnly />
                    </div>
                  ))}

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                      Your Phone <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div className="relative">
                      <Phone size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="tel"
                        className="input pl-10"
                        placeholder="+1 (555) 123-4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Payment gateway section */}
                  <div className="glass-card p-4 flex flex-col gap-3" style={{ borderColor: 'rgba(168,85,247,0.2)' }}>
                    <div className="flex flex-col gap-0.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: '#a855f7' }}>Payment Instructions</h4>
                      <p className="text-xxs" style={{ color: 'var(--text-muted)' }}>
                        Send money to our Personal number: <strong className="text-white" style={{ fontSize: '0.85rem' }}>01608171029</strong>
                      </p>
                    </div>

                    {/* Method Selector */}
                    <div>
                      <label className="block text-xxs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Select Payment Method</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['bKash', 'Nagad', 'Rocket'] as const).map(method => {
                          const isSelected = paymentMethod === method;
                          const activeStyles = {
                            bKash: { color: '#e2125d', bg: 'rgba(226,18,93,0.15)', border: '1px solid #e2125d' },
                            Nagad: { color: '#f15a22', bg: 'rgba(241,90,34,0.15)', border: '1px solid #f15a22' },
                            Rocket: { color: '#8c3494', bg: 'rgba(140,52,148,0.15)', border: '1px solid #8c3494' }
                          }[method];
                          
                          return (
                            <motion.button
                              key={method}
                              type="button"
                              onClick={() => setPaymentMethod(method)}
                              className="py-2 rounded-xl text-xs font-bold border transition-all"
                              style={isSelected ? activeStyles : {
                                color: 'var(--text-muted)',
                                background: 'var(--glass)',
                                borderColor: 'var(--glass-border)'
                              }}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                            >
                              {method}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Transaction ID */}
                    <div>
                      <label className="block text-xxs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                        Transaction ID <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <div className="relative">
                        <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                          <CheckCircle size={14} />
                        </span>
                        <input
                          type="text"
                          className="input pl-9 py-2 text-xs"
                          placeholder="e.g. TRX89KJS72"
                          value={transactionId}
                          onChange={e => setTransactionId(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Screenshot Upload */}
                    <div>
                      <label className="block text-xxs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                        Payment Screenshot
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="btn-neon text-xxs py-1.5 px-3 flex items-center gap-1 cursor-pointer">
                          <CheckCircle size={10} />
                          <span>Upload Screenshot</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, setPaymentScreenshot, setUploadingScreenshot)}
                          />
                        </label>
                        {uploadingScreenshot && <span className="text-xxs" style={{ color: '#a855f7' }}>Uploading...</span>}
                        {paymentScreenshot && (
                          <div className="relative group">
                            <img
                              src={paymentScreenshot}
                              className="w-8 h-8 rounded-lg object-cover"
                              style={{ border: '1px solid rgba(168,85,247,0.5)' }}
                              alt="Screenshot Preview"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Session Summary */}
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}>
                    <p className="text-xs font-semibold mb-2" style={{ color: '#a855f7' }}>Session Summary</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <span style={{ color: 'var(--text-muted)' }}>Subject:</span>
                      <span style={{ color: 'var(--text-primary)' }}>{tutor.subject}</span>
                      <span style={{ color: 'var(--text-muted)' }}>Date:</span>
                      <span style={{ color: 'var(--text-primary)' }}>{tutor.sessionDate}</span>
                      <span style={{ color: 'var(--text-muted)' }}>Time:</span>
                      <span style={{ color: 'var(--text-primary)' }}>{tutor.availableTime}</span>
                      <span style={{ color: 'var(--text-muted)' }}>Fee:</span>
                      <span style={{ color: '#a855f7', fontWeight: 'bold' }}>${tutor.fee}/hr</span>
                    </div>
                  </div>

                  {/* Submit */}
                  <motion.button
                    onClick={handleBook}
                    className="btn-neon w-full py-3.5 text-base"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>{loading ? 'Booking...' : 'Confirm Booking'}</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal (Admin Global Overrides) */}
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
                    onClick={handleUpdate}
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

export default TutorDetailPage;
