/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppProvider, useAppContext } from './store/AppContext';
import { AdProvider } from './store/AdContext';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import Home from './pages/Home';
import MatchDetails from './pages/MatchDetails';
import CreateTeam from './pages/CreateTeam';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Watch from './pages/Watch';
import Wallet from './pages/Wallet';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import AdminPanel from './pages/AdminPanel';
import Referral from './pages/Referral';

import { AgeVerification } from './components/AgeVerification';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthReady } = useAppContext();
  if (!isAuthReady) return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div></div>;
  if (!user) return <Navigate to="/login" />;
  if (user.isAdmin) return <Navigate to="/admin" />;
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthReady } = useAppContext();
  if (!isAuthReady) return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div></div>;
  if (!user || !user.isAdmin) return <Navigate to="/login" />;
  return <>{children}</>;
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthReady } = useAppContext();
  if (!isAuthReady) return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div></div>;
  if (user) {
    if (user.isAdmin) return <Navigate to="/admin" />;
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};

import { ErrorBoundary } from './components/ErrorBoundary';

const AppRoutes = () => {
  return (
    <>
      <AgeVerification />
      <Routes>
        <Route path="/login" element={<AuthRoute><Auth /></AuthRoute>} />
        <Route path="/signup" element={<AuthRoute><Auth /></AuthRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
        <Route element={<Layout />}>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/match/:id" element={<ProtectedRoute><MatchDetails /></ProtectedRoute>} />
          <Route path="/create-team/:id" element={<ProtectedRoute><CreateTeam /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/watch" element={<ProtectedRoute><Watch /></ProtectedRoute>} />
          <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
          <Route path="/deposit" element={<ProtectedRoute><Deposit /></ProtectedRoute>} />
          <Route path="/withdraw" element={<ProtectedRoute><Withdraw /></ProtectedRoute>} />
          <Route path="/referral" element={<ProtectedRoute><Referral /></ProtectedRoute>} />
        </Route>
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AdProvider>
          <BrowserRouter>
            <AppRoutes />
            <Toaster position="top-right" richColors />
          </BrowserRouter>
        </AdProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}
