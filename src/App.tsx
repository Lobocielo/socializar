import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import SwipePage from './pages/SwipePage';
import MatchesPage from './pages/MatchesPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import PremiumPage from './pages/PremiumPage';
import Navbar from './components/ui/Navbar';
import LoadingScreen from './components/ui/LoadingScreen';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/swipe" /> : <LoginPage />} />
      <Route path="/setup" element={<ProtectedRoute><ProfileSetupPage /></ProtectedRoute>} />
      <Route path="/swipe" element={<ProtectedRoute><div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50"><SwipePage /><Navbar /></div></ProtectedRoute>} />
      <Route path="/matches" element={<ProtectedRoute><div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50"><MatchesPage /><Navbar /></div></ProtectedRoute>} />
      <Route path="/chat/:matchId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50"><ProfilePage /><Navbar /></div></ProtectedRoute>} />
      <Route path="/premium" element={<ProtectedRoute><PremiumPage /></ProtectedRoute>} />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <div className="min-h-screen">
        <AppRoutes />
        <Toaster position="top-center" toastOptions={{ duration: 3000, style: { background: '#333', color: '#fff', borderRadius: '10px' } }} />
      </div>
    </Router>
  </AuthProvider>
);

export default App;
