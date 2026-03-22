import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './pages/Landing';
import DashboardPage from './pages/Dashboard';
import Profile from './pages/Profile';
import Projects from './pages/Projects';
import Jobs from './pages/Jobs';
import Alumni from './pages/Alumni';
import LoginModal from './components/auth/LoginModal';
import useAuth from './hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
};

const App = () => {
  const { initAuth, isAuthenticated } = useAuth();
  const [loginModal, setLoginModal] = useState({ open: false, mode: 'login' });

  useEffect(() => {
    initAuth();
    const handleLogout = () => initAuth();
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const openLoginModal = (mode = 'login') => {
    setLoginModal({ open: true, mode });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <Navbar onLoginClick={openLoginModal} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/alumni" element={<Alumni />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      <LoginModal
        isOpen={loginModal.open}
        onClose={() => setLoginModal({ open: false, mode: 'login' })}
        defaultMode={loginModal.mode}
      />

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#f9fafb',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#6366f1', secondary: '#fff' } },
        }}
      />
    </div>
  );
};

export default App;
