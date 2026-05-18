import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

// Google SVG icon
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const LoginPage: React.FC = () => {
  useEffect(() => { document.title = 'MediQueue – Login'; }, []);

  const { login, loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back! 🎉');
      navigate(from, { replace: true });
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Signed in with Google! 🎉');
      navigate(from, { replace: true });
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
      {/* Background Blobs */}
      <div className="neon-circle" style={{ width: '400px', height: '400px', background: 'radial-gradient(circle, #a855f7, transparent)', top: '-100px', left: '-100px' }} />
      <div className="neon-circle" style={{ width: '300px', height: '300px', background: 'radial-gradient(circle, #3b82f6, transparent)', bottom: '-100px', right: '-50px' }} />

      <motion.div
        className="glass-card w-full max-w-md p-8 relative z-10"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #a855f7, #3b82f6)' }}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <GraduationCap size={30} color="white" />
          </motion.div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
            Welcome Back
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Sign in to your MediQueue account</p>
        </div>

        {/* Google Button */}
        <motion.button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-medium text-sm mb-6"
          style={{
            background: 'var(--glass)',
            border: '1px solid var(--glass-border)',
            color: 'var(--text-primary)',
          }}
          whileHover={{ scale: 1.01, borderColor: 'rgba(168,85,247,0.3)', boxShadow: '0 0 20px rgba(168,85,247,0.1)' }}
          whileTap={{ scale: 0.99 }}
        >
          <GoogleIcon />
          Continue with Google
        </motion.button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1" style={{ height: '1px', background: 'var(--glass-border)' }} />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>or sign in with email</span>
          <div className="flex-1" style={{ height: '1px', background: 'var(--glass-border)' }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                className="input pl-10"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Password</label>
              <button type="button" className="text-xs" style={{ color: '#a855f7' }}>Forgot password?</button>
            </div>
            <div className="relative">
              <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type={showPass ? 'text' : 'password'}
                className="input pl-10 pr-10"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
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
          </div>

          <motion.button
            type="submit"
            className="btn-neon w-full py-3.5 text-base mt-2"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>{loading ? 'Signing In...' : 'Sign In'}</span>
          </motion.button>
        </form>

        {/* Register Link */}
        <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold" style={{ color: '#a855f7' }}>
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
