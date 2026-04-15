import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GroupsPage from './pages/GroupsPage';
import DashboardPage from './pages/DashboardPage';
import OCRPage from './pages/OCRPage';
import AIChatPage from './pages/AIChatPage';
import ExpensesPage from './pages/ExpensesPage';
import ProfilePage from './pages/ProfilePage';
import AppLayout from './layouts/AppLayout';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#131313] text-[#b9c3ff]">
        <div className="bg-white/5 backdrop-blur-xl rounded-full px-8 py-4 font-display text-xs uppercase tracking-[0.3em] border border-white/10 animate-pulse">
          Syncing Spendez
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" />;
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected Routes */}
      <Route path="/" element={
        <PrivateRoute>
          <AppLayout>
            <DashboardPage />
          </AppLayout>
        </PrivateRoute>
      } />
      
      <Route path="/groups" element={
        <PrivateRoute>
          <AppLayout>
            <GroupsPage />
          </AppLayout>
        </PrivateRoute>
      } />

      <Route path="/ai-chat" element={
        <PrivateRoute>
          <AppLayout>
            <AIChatPage />
          </AppLayout>
        </PrivateRoute>
      } />

      <Route path="/expenses" element={
        <PrivateRoute>
          <AppLayout>
            <ExpensesPage />
          </AppLayout>
        </PrivateRoute>
      } />

      <Route path="/profile" element={
        <PrivateRoute>
          <AppLayout>
            <ProfilePage />
          </AppLayout>
        </PrivateRoute>
      } />

      <Route path="/ocr" element={
        <PrivateRoute>
          <AppLayout>
            <OCRPage />
          </AppLayout>
        </PrivateRoute>
      } />
      
      {/* Redirect all other paths to home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-[#131313] antialiased selection:bg-[#b9c3ff]/30 selection:text-white">
          <AppRoutes />
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'rgba(42, 42, 42, 0.88)',
                color: '#e5e2e1',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '20px',
                backdropFilter: 'blur(16px)',
              }
            }}
          />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
