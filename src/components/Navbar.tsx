import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Sun, Moon, Menu, X, GraduationCap, LogOut, User,
  Plus, BookOpen, Calendar, ChevronDown, Shield
} from 'lucide-react';
import { toast } from 'react-toastify';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    toast.success('Logged out successfully!');
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/tutors', label: 'Tutors' },
    ...(user ? [
      ...(user.role === 'admin' ? [
        { to: '/add-tutor', label: 'Add Tutor', icon: <Plus size={14} /> },
        { to: '/my-tutors', label: 'My Tutors', icon: <GraduationCap size={14} /> },
      ] : []),
      { to: '/my-bookings', label: 'My Bookings', icon: <Calendar size={14} /> },
    ] : []),
  ];

  return (
    <>
      <motion.nav
        className={`navbar-glass ${scrolled ? 'scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #a855f7, #3b82f6)' }}
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <GraduationCap size={20} color="white" />
              </motion.div>
              <span
                className="text-xl font-bold gradient-text"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                MediQueue
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `nav-link flex items-center gap-1 ${isActive ? 'active' : ''}`
                  }
                >
                  {link.icon && link.icon}
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: 'var(--glass)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-secondary)',
                }}
                whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(168,85,247,0.3)' }}
                whileTap={{ scale: 0.9 }}
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </motion.button>

              {/* Auth Section */}
              {user ? (
                <div className="user-profile" ref={dropdownRef}>
                  <motion.div
                    className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-xl"
                    style={{
                      background: 'var(--glass)',
                      border: '1px solid var(--glass-border)',
                    }}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="avatar">
                      <img
                        src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'U')}&background=a855f7&color=fff`}
                        alt={user.displayName || 'User'}
                      />
                    </div>
                    <span
                      className="hidden sm:block text-sm font-medium max-w-24 truncate"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {user.displayName?.split(' ')[0]}
                    </span>
                    <motion.div animate={{ rotate: dropdownOpen ? 180 : 0 }}>
                      <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
                    </motion.div>
                  </motion.div>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        className="dropdown-menu"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                      >
                        <div className="px-3 py-2 mb-1" style={{ borderBottom: '1px solid var(--glass-border)' }}>
                          <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                            {user.displayName}
                          </p>
                          <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            {user.email}
                          </p>
                        </div>
                        {user.role === 'admin' && (
                          <>
                            <Link
                              to="/admin"
                              className="dropdown-item"
                              style={{ color: '#c084fc', fontWeight: 'bold' }}
                              onClick={() => setDropdownOpen(false)}
                            >
                              <Shield size={16} />
                              Admin Panel
                            </Link>
                            <Link
                              to="/my-tutors"
                              className="dropdown-item"
                              onClick={() => setDropdownOpen(false)}
                            >
                              <GraduationCap size={16} />
                              My Tutors
                            </Link>
                          </>
                        )}
                        <Link
                          to="/profile"
                          className="dropdown-item"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <User size={16} />
                          Profile
                        </Link>
                        <Link
                          to="/my-bookings"
                          className="dropdown-item"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <BookOpen size={16} />
                          My Bookings
                        </Link>
                        <button
                          className="dropdown-item w-full text-left"
                          style={{ color: '#ef4444' }}
                          onClick={handleLogout}
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/login">
                    <motion.button
                      className="px-4 py-2 rounded-xl text-sm font-medium"
                      style={{
                        background: 'var(--glass)',
                        border: '1px solid var(--glass-border)',
                        color: 'var(--text-primary)',
                      }}
                      whileHover={{ scale: 1.02, borderColor: 'rgba(168,85,247,0.4)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Login
                    </motion.button>
                  </Link>
                  <Link to="/register">
                    <motion.button
                      className="btn-neon px-4 py-2 text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>Register</span>
                    </motion.button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <motion.button
                className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: 'var(--glass)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-secondary)',
                }}
                onClick={() => setMobileOpen(!mobileOpen)}
                whileTap={{ scale: 0.9 }}
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                background: 'var(--navbar-bg)',
                borderTop: '1px solid var(--glass-border)',
              }}
            >
              <div className="px-4 py-4 flex flex-col gap-2">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <NavLink
                      to={link.to}
                      end={link.to === '/'}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium ${
                          isActive
                            ? 'text-purple-400'
                            : ''
                        }`
                      }
                      style={{ color: 'var(--text-secondary)' }}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.icon && link.icon}
                      {link.label}
                    </NavLink>
                  </motion.div>
                ))}
                {user && user.role === 'admin' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.05 }}
                  >
                    <NavLink
                      to="/admin"
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold ${
                          isActive ? 'text-purple-400' : ''
                        }`
                      }
                      style={{ color: '#c084fc' }}
                      onClick={() => setMobileOpen(false)}
                    >
                      <Shield size={14} />
                      Admin Panel
                    </NavLink>
                  </motion.div>
                )}
                {!user && (
                  <div className="flex gap-2 pt-2" style={{ borderTop: '1px solid var(--glass-border)' }}>
                    <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <button
                        className="w-full py-2.5 rounded-xl text-sm font-medium"
                        style={{
                          background: 'var(--glass)',
                          border: '1px solid var(--glass-border)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        Login
                      </button>
                    </Link>
                    <Link to="/register" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <button className="btn-neon w-full py-2.5 text-sm">
                        <span>Register</span>
                      </button>
                    </Link>
                  </div>
                )}
                {user && (
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
                    style={{ color: '#ef4444' }}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;
