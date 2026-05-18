import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';

const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
);

// X (formerly Twitter) SVG icon
const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const footerLinks = {
  services: [
    { label: 'Find Tutors', to: '/tutors' },
    { label: 'Book Session', to: '/tutors' },
    { label: 'Add Tutor', to: '/add-tutor' },
    { label: 'My Bookings', to: '/my-bookings' },
  ],
  resources: [
    { label: 'Study Guides', to: '/' },
    { label: 'Learning Tips', to: '/' },
    { label: 'Subject Library', to: '/' },
    { label: 'Practice Tests', to: '/' },
  ],
  company: [
    { label: 'About Us', to: '/' },
    { label: 'Careers', to: '/' },
    { label: 'Blog', to: '/' },
    { label: 'Privacy Policy', to: '/' },
  ],
};

const Footer: React.FC = () => {
  return (
    <footer className="footer-glass">
      {/* Decorative top line */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #a855f7, #3b82f6, transparent)' }} />
      
      {/* Background glow */}
      <div className="neon-circle" style={{
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, #a855f7, transparent)',
        bottom: '-200px', left: '-100px',
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #a855f7, #3b82f6)' }}
              >
                <GraduationCap size={22} color="white" />
              </div>
              <span
                className="text-2xl font-bold gradient-text"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                MediQueue
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: 'var(--text-muted)' }}>
              The premium futuristic platform connecting students with world-class tutors. 
              Learn smarter, achieve more, grow faster.
            </p>

            {/* Contact */}
            <div className="flex flex-col gap-3 mb-6">
              {[
                { icon: <Mail size={14} />, text: 'hello@mediqueue.com' },
                { icon: <Phone size={14} />, text: '+1 (555) 123-4567' },
                { icon: <MapPin size={14} />, text: 'San Francisco, CA 94102' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <span style={{ color: '#a855f7' }}>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {[
                { icon: <GithubIcon />, href: '#', label: 'GitHub' },
                { icon: <XIcon />, href: '#', label: 'X' },
                { icon: <LinkedinIcon />, href: '#', label: 'LinkedIn' },
                { icon: <InstagramIcon />, href: '#', label: 'Instagram' },
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'var(--glass)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--text-muted)',
                  }}
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: 'rgba(168,85,247,0.1)',
                    borderColor: 'rgba(168,85,247,0.4)',
                    color: '#a855f7',
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: 'Tutor Services', links: footerLinks.services },
            { title: 'Learning Resources', links: footerLinks.resources },
            { title: 'Company', links: footerLinks.company },
          ].map((col) => (
            <div key={col.title}>
              <h4
                className="text-sm font-bold uppercase tracking-widest mb-4"
                style={{ color: 'var(--text-primary)', letterSpacing: '0.15em' }}
              >
                {col.title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm transition-colors duration-200 hover:text-purple-400"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid var(--glass-border)' }}
        >
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} MediQueue. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-muted)' }}>
            Built with
            <span className="mx-1" style={{ color: '#ef4444' }}>♥</span>
            for learners worldwide
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
