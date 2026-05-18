import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MouseGlow from './components/MouseGlow';

import HomePage from './pages/HomePage';
import TutorsPage from './pages/TutorsPage';
import TutorDetailPage from './pages/TutorDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AddTutorPage from './pages/AddTutorPage';
import MyTutorsPage from './pages/MyTutorsPage';
import MyBookingsPage from './pages/MyBookingsPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.35, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);

const AppRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
        <Route path="/tutors" element={<PageWrapper><TutorsPage /></PageWrapper>} />
        <Route
          path="/tutors/:id"
          element={
            <PrivateRoute>
              <PageWrapper><TutorDetailPage /></PageWrapper>
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><RegisterPage /></PageWrapper>} />
        <Route
          path="/add-tutor"
          element={
            <PrivateRoute>
              <PageWrapper><AddTutorPage /></PageWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/my-tutors"
          element={
            <PrivateRoute>
              <PageWrapper><MyTutorsPage /></PageWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <PrivateRoute>
              <PageWrapper><MyBookingsPage /></PageWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <PageWrapper><ProfilePage /></PageWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <PageWrapper><AdminDashboard /></PageWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/:section"
          element={
            <PrivateRoute>
              <PageWrapper><AdminDashboard /></PageWrapper>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<PageWrapper><NotFoundPage /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

const ThemedToast: React.FC = () => {
  const { theme } = useTheme();
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      theme={theme === 'dark' ? 'dark' : 'light'}
      toastStyle={{
        background: theme === 'dark' ? '#0f172a' : '#ffffff',
        border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
        borderRadius: '12px',
        color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
      }}
    />
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
            <MouseGlow />
            <Navbar />
            <main>
              <AppRoutes />
            </main>
            <Footer />
            <ThemedToast />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
