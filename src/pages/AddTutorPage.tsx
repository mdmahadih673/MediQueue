import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User, Image, BookOpen, Clock, DollarSign, Layers,
  Calendar, Building, MapPin, Monitor, Hash, Plus, Upload
} from 'lucide-react';
import { subjects } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../utils/api';

const AddTutorPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'MediQueue – Add Tutor';
    if (user && user.role !== 'admin') {
      toast.error('Unauthorized access. Admin role required.');
      navigate('/');
    }
  }, [user, navigate]);

  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

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
        toast.success('Image uploaded successfully! 📸');
      } catch (err: any) {
        toast.error('Failed to upload image locally.');
        console.error(err);
      } finally {
        setLoadingState(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const [form, setForm] = useState({
    tutorName: '',
    tutorImage: '',
    subject: subjects[0],
    availableDays: '',
    availableTime: '',
    fee: '',
    totalSlot: '',
    sessionDate: '',
    institution: '',
    experience: '',
    location: '',
    teachingMode: 'Online' as 'Online' | 'Offline' | 'Both',
    description: '',
  });

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.tutorName || !form.subject || !form.fee || !form.totalSlot || !form.sessionDate) {
      toast.error('Please fill in all required fields.');
      return;
    }
    const fee = parseFloat(form.fee);
    const totalSlot = parseInt(form.totalSlot);
    if (isNaN(fee) || fee <= 0) { toast.error('Please enter a valid fee.'); return; }
    if (isNaN(totalSlot) || totalSlot <= 0) { toast.error('Please enter a valid slot count.'); return; }

    setLoading(true);
    try {
      await api.post('/tutors', {
        tutorName: form.tutorName,
        tutorImage: form.tutorImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.tutorName)}&background=a855f7&color=fff&size=400`,
        subject: form.subject,
        availableDays: form.availableDays,
        availableTime: form.availableTime,
        fee,
        totalSlot,
        sessionDate: form.sessionDate,
        institution: form.institution,
        experience: form.experience,
        location: form.location,
        teachingMode: form.teachingMode,
        description: form.description,
      });
      toast.success('Tutor added successfully! 🎉');
      navigate('/my-tutors');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add tutor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      group: 'Personal Info',
      items: [
        { label: 'Tutor Name', field: 'tutorName', type: 'text', icon: <User size={16} />, placeholder: 'Dr. John Smith', required: true },
        { label: 'Institution', field: 'institution', type: 'text', icon: <Building size={16} />, placeholder: 'Harvard University', required: false },
        { label: 'Experience', field: 'experience', type: 'text', icon: <Layers size={16} />, placeholder: '5 years', required: false },
      ]
    },
    {
      group: 'Session Info',
      items: [
        { label: 'Available Days', field: 'availableDays', type: 'text', icon: <Calendar size={16} />, placeholder: 'Mon, Wed, Fri', required: false },
        { label: 'Available Time', field: 'availableTime', type: 'text', icon: <Clock size={16} />, placeholder: '9:00 AM - 12:00 PM', required: false },
        { label: 'Session Start Date', field: 'sessionDate', type: 'date', icon: <Calendar size={16} />, placeholder: '', required: true },
        { label: 'Location', field: 'location', type: 'text', icon: <MapPin size={16} />, placeholder: 'New York, USA', required: false },
      ]
    },
    {
      group: 'Pricing & Slots',
      items: [
        { label: 'Hourly Fee ($)', field: 'fee', type: 'number', icon: <DollarSign size={16} />, placeholder: '85', required: true },
        { label: 'Total Slots', field: 'totalSlot', type: 'number', icon: <Hash size={16} />, placeholder: '10', required: true },
      ]
    },
  ];

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingTop: '80px' }}>
      <div className="neon-circle" style={{ width: '500px', height: '500px', background: 'radial-gradient(circle, #a855f7, transparent)', top: '-100px', right: '-150px' }} />
      <div className="neon-circle" style={{ width: '400px', height: '400px', background: 'radial-gradient(circle, #3b82f6, transparent)', bottom: '-100px', left: '-100px' }} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4"
            style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)', color: '#a855f7' }}>
            <Plus size={14} />
            Add New Tutor
          </div>
          <h1 className="section-title mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-primary)' }}>
            Create Tutor <span className="gradient-text">Profile</span>
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Fill in the details below to add a new tutor to the MediQueue platform.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col gap-6"
        >
          {fields.map((group, gi) => (
            <div key={group.group} className="glass-card p-6">
              <h3 className="font-bold text-base mb-5" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                {group.group}
              </h3>

              {/* Tutor Photo Upload - only in Personal Info group */}
              {gi === 0 && (
                <div className="mb-5">
                  <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                    Tutor Photo <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
                  </label>
                  <div className="flex items-center gap-4">
                    {form.tutorImage ? (
                      <img
                        src={form.tutorImage}
                        alt="Preview"
                        className="w-16 h-16 rounded-xl object-cover"
                        style={{ border: '2px solid rgba(168,85,247,0.4)' }}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
                        <Image size={24} style={{ color: 'var(--text-muted)' }} />
                      </div>
                    )}
                    <div className="flex flex-col gap-1.5">
                      <label className="btn-neon text-xs py-2 px-4 flex items-center gap-2 cursor-pointer">
                        <Upload size={14} />
                        <span>{uploadingPhoto ? 'Uploading...' : 'Choose Photo'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, (url) => update('tutorImage', url), setUploadingPhoto)}
                          disabled={uploadingPhoto}
                        />
                      </label>
                      {form.tutorImage && (
                        <button type="button" onClick={() => update('tutorImage', '')} className="text-xxs" style={{ color: '#ef4444' }}>
                          Remove Photo
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {group.items.map(item => (
                  <div key={item.field}>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                      {item.label} {item.required && <span style={{ color: '#ef4444' }}>*</span>}
                    </label>
                    <div className="relative">
                      <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 1 }}>
                        {item.icon}
                      </span>
                      <input
                        type={item.type}
                        className="input pl-10"
                        placeholder={item.placeholder}
                        value={form[item.field as keyof typeof form] as string}
                        onChange={e => update(item.field, e.target.value)}
                        required={item.required}
                        min={item.type === 'number' ? '0' : undefined}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Subject dropdown in group 0 */}
              {gi === 0 && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                      Subject <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div className="relative">
                      <BookOpen size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <select
                        className="input pl-10"
                        value={form.subject}
                        onChange={e => update('subject', e.target.value)}
                        required
                      >
                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Teaching Mode in group 2 */}
              {gi === 2 && (
                <div className="mt-4">
                  <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                    Teaching Mode <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div className="glass-radio-group">
                    {(['Online', 'Offline', 'Both'] as const).map(mode => (
                      <label key={mode} className="radio-option">
                        <input
                          type="radio"
                          name="teachingMode"
                          value={mode}
                          checked={form.teachingMode === mode}
                          onChange={() => update('teachingMode', mode)}
                        />
                        <span className="radio-label">
                          <Monitor size={12} />
                          {mode}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Description */}
          <div className="glass-card p-6">
            <h3 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
              About the Tutor
            </h3>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Description
              </label>
              <textarea
                className="input resize-none"
                rows={4}
                placeholder="Describe the tutor's expertise, teaching style, and achievements..."
                value={form.description}
                onChange={e => update('description', e.target.value)}
              />
            </div>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            className="btn-neon w-full py-4 text-base"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>{loading ? 'Adding Tutor...' : 'Add Tutor to Platform'}</span>
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
};

export default AddTutorPage;
