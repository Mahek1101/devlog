import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getMe } from './api/auth';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import './styles/global.css';

function App() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    getMe()
      .then(res => setUser(res.data))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const logout = () => { localStorage.removeItem('token'); setUser(null); };

  if (loading) return <div style={{padding:'2rem',color:'var(--color-text-muted)'}}>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/"            element={<Navigate to={user ? '/dashboard' : '/login'} />} />
        <Route path="/login"       element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />} />
        <Route path="/register"    element={!user ? <Register setUser={setUser} /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard"   element={user ? <Dashboard user={user} logout={logout} /> : <Navigate to="/login" />} />
        <Route path="/feed"        element={user ? <Feed user={user} logout={logout} /> : <Navigate to="/login" />} />
        <Route path="/profile/:username" element={user ? <Profile currentUser={user} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
