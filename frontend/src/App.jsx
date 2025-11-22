import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AddEmployee from './pages/AddEmployee.jsx';
import AttendanceScan from './pages/AttendanceScan.jsx';
import WeeklyReport from './pages/WeeklyReport.jsx';

export default function App() {
  // ✅ read token from localStorage on first load
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  // optional: keep in sync if localStorage changes
  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (stored && !token) {
      setToken(stored);
    }
  }, [token]);

  const isAuth = !!token;

  return (
    <BrowserRouter>
      <Routes>
        {/* Login – shows when not auth */}
        <Route
          path="/login"
          element={<Login onLogin={setToken} />}
        />

        {/* Home menu */}
        <Route
          path="/"
          element={isAuth ? <Home /> : <Navigate to="/login" replace />}
        />

        {/* Other protected pages */}
        <Route
          path="/add-employee"
          element={isAuth ? <AddEmployee /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/scan"
          element={isAuth ? <AttendanceScan /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/weekly-report"
          element={isAuth ? <WeeklyReport /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/employees"
          element={isAuth ? <Dashboard /> : <Navigate to="/login" replace />}
        />

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to={isAuth ? '/' : '/login'} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
