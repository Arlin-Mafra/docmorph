
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppRoute } from './types';

// Pages
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Config from './pages/Config';
import Payment from './pages/Payment';
import Confirmation from './pages/Confirmation';
import History from './pages/History';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import PaymentHistory from './pages/PaymentHistory';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);
  const toggleTheme = () => setDarkMode(prev => !prev);

  return (
    <Router>
      <div className="min-h-screen flex justify-center bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 shadow-2xl relative flex flex-col min-h-screen overflow-hidden">
          <Routes>
            {/* Public Routes */}
            <Route path={AppRoute.WELCOME} element={<Welcome />} />
            <Route path={AppRoute.LOGIN} element={<Login onLogin={login} />} />
            <Route path={AppRoute.REGISTER} element={<Register />} />
            <Route path={AppRoute.FORGOT_PASSWORD} element={<ForgotPassword />} />

            {/* Private Routes (Mock Authentication) */}
            <Route path={AppRoute.DASHBOARD} element={<Dashboard />} />
            <Route path={AppRoute.UPLOAD} element={<Upload />} />
            <Route path={AppRoute.CONFIG} element={<Config />} />
            <Route path={AppRoute.PAYMENT} element={<Payment />} />
            <Route path={AppRoute.CONFIRMATION} element={<Confirmation />} />
            <Route path={AppRoute.HISTORY} element={<History />} />
            <Route path={AppRoute.SETTINGS} element={<Settings darkMode={darkMode} onToggleTheme={toggleTheme} onLogout={logout} />} />
            <Route path={AppRoute.PROFILE} element={<Profile />} />
            <Route path={AppRoute.CHANGE_PASSWORD} element={<ChangePassword />} />
            <Route path={AppRoute.PAYMENT_HISTORY} element={<PaymentHistory />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to={AppRoute.WELCOME} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
