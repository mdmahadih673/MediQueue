import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Image, GraduationCap, CheckCircle, XCircle, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const RegisterPage: React.FC = () => {
  useEffect(() => { document.title = 'MediQueue – Create Account'; }, []);

  const { register, loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', photoURL: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
      return;
    }
    setUploadingPhoto(true);
    const reader = new FileReader();
    reader.onload = () => {
      updateField('photoURL', String(reader.result || ''));
      toast.success('Photo selected!');
      setUploadingPhoto(false);
    };
    reader.onerror = () => {
      toast.error('Failed to read photo.');
      setUploadingPhoto(false);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);

  const updateField = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));

  const passwordRules = [
    { label: 'At least 6 characters', valid: formData.password.length >= 6 },
    { label: 'One uppercase letter', valid: /[A-Z]/.test(formData.password) },
    { label: 'One lowercase letter', valid: /[a-z]/.test(formData.password) },
  ];
  const passwordValid = passwordRules.every(r => r.valid);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) { toast.error('Please enter your name.'); return; }
    if (!formData.email.trim()) { toast.error('Please enter your email.'); return; }
    if (!passwordValid) { toast.error('Password does not meet requirements.'); return; }

    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password, formData.photoURL);
      toast.success('Account created successfully! Welcome to MediQueue 🎉');
      navigate('/');
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Registered with Google! 🎉');
      navigate('/');
    } catch {
      toast.error('Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen hero-bg-gradient grid-overlay flex items-center justify-center px-4"
      style={{ paddingTop: '80px', paddingBottom: '40px' }}
    >
      <div className="neon-circle" style={{ width: '400px', height: '400px', background: 'radial-gradient(circle, #a855f7, transparent)', top: '-100px', right: '-100px' }} />
      <div className="neon-circle" style={{ width: '300px', height: '300px', background: 'radial-gradient(circle, #3b82f6, transparent)', bottom: '-100px', left: '-50px' }} />

      <motion.div
        className="glass-card w-full max-w-md p-5 sm:p-8 relative z-10"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="text-center mb-8">
          <motion.div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #a855f7, #3b82f6)' }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <GraduationCap size={30} color="white" />
          </motion.div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
            Create Account
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Join MediQueue and start learning today</p>
        </div>

        {/* Google Button */}
        <motion.button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-medium text-sm mb-6"
          style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
          whileHover={{ scale: 1.01, borderColor: 'rgba(168,85,247,0.3)' }}
          whileTap={{ scale: 0.99 }}
        >
          <GoogleIcon />
          Continue with Google
        </motion.button>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1" style={{ height: '1px', background: 'var(--glass-border)' }} />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>or register with email</span>
          <div className="flex-1" style={{ height: '1px', background: 'var(--glass-border)' }} />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Full Name</label>
            <div className="relative">
              <User size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="input pl-10"
                placeholder="John Doe"
                value={formData.name}
                onChange={e => updateField('name', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Email Address</label>
            <div className="relative">
              <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                className="input pl-10"
                placeholder="you@example.com"
                value={formData.email}
                onChange={e => updateField('email', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Profile Photo Upload */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Profile Photo <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
            </label>
            <div className="flex items-center gap-3">
              {formData.photoURL ? (
                <img
                  src={formData.photoURL}
                  alt="Preview"
                  className="w-12 h-12 rounded-xl object-cover"
                  style={{ border: '2px solid rgba(168,85,247,0.4)' }}
                />
              ) : (
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
                  <Image size={20} style={{ color: 'var(--text-muted)' }} />
                </div>
              )}
              <label className="btn-neon text-xs py-2 px-4 flex items-center gap-2 cursor-pointer">
                <Upload size={14} />
                <span>{uploadingPhoto ? 'Uploading...' : 'Choose Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto}
                />
              </label>
              {formData.photoURL && (
                <button
                  type="button"
                  onClick={() => updateField('photoURL', '')}
                  className="text-xs" style={{ color: '#ef4444' }}
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Password</label>
            <div className="relative">
              <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type={showPass ? 'text' : 'password'}
                className="input pl-10 pr-10"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={e => updateField('password', e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Password Rules */}
            {formData.password && (
              <motion.div
                className="mt-2 flex flex-col gap-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {passwordRules.map(rule => (
                  <div key={rule.label} className="flex items-center gap-1.5 text-xs">
                    {rule.valid
                      ? <CheckCircle size={12} style={{ color: '#22c55e' }} />
                      : <XCircle size={12} style={{ color: '#ef4444' }} />}
                    <span style={{ color: rule.valid ? '#22c55e' : '#ef4444' }}>{rule.label}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          <motion.button
            type="submit"
            className="btn-neon w-full py-3.5 text-base mt-2"
            disabled={loading || !passwordValid}
            style={{ opacity: (!passwordValid && formData.password) ? 0.6 : 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
          </motion.button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold" style={{ color: '#a855f7' }}>Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
