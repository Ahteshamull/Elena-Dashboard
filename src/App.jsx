import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import { Login } from './pages/Auth/Login';
import { ForgotPassword } from './pages/Auth/ForgotPassword';
import { OTPVerification } from './pages/Auth/OTPVerification';
import { ResetPassword } from './pages/Auth/ResetPassword';
import ScrollToTop from './components/layout/ScrollToTop';
import Header from './components/layout/Header';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user || (user.role !== 'admin' && user.role !== 'superAdmin')) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('user'));

  // Listen for login/logout events (using storage event for cross-tab or manual state changes)
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('user'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-[#FAFAFA]">
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/forget-password" element={<ForgotPassword />} />
            <Route path="/auth/verify-otp" element={<OTPVerification />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            
            {/* Protected Admin Routes */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Root Redirects */}
            <Route 
              path="/" 
              element={<Navigate to={isAuthenticated ? "/admin" : "/auth/login"} replace />} 
            />
            
            {/* Catch-all */}
            <Route 
              path="*" 
              element={<Navigate to={isAuthenticated ? "/admin" : "/auth/login"} replace />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;