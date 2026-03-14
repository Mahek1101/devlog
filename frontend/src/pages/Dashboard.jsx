import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyLogs } from '../api/logs';
import LogEditor from '../components/logs/LogEditor';
import LogCard from '../components/logs/LogCard';
import StreakCalendar from '../components/logs/StreakCalendar';
import './Dashboard.css';

export default function Dashboard({ user, logout }) {
  const navigate = useNavigate();
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyLogs()
      .then(res => setLogs(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogCreated = (newLog) => setLogs([newLog, ...logs]);
  const handleLogDeleted = (id)     => setLogs(logs.filter(l => l.id !== id));
  const handleLogout     = ()       => { logout(); navigate('/login'); };

  return (
    <div className="dashboard">
      <header className="dash-header">
        <h1 className="dash-logo">DevLog</h1>
        <div className="dash-nav">
          <button className="nav-btn active">My logs</button>
          <button className="nav-btn" onClick={() => navigate('/feed')}>Feed</button>
          <button className="nav-btn" onClick={() => navigate(`/profile/${user?.username}`)}>Profile</button>
          <button className="nav-btn logout" onClick={handleLogout}>Log out</button>
        </div>
      </header>

      <main className="dash-main">
        <div className="dash-stats">
          <div className="stat-card">
            <span className="stat-value">{logs.length}</span>
            <span className="stat-label">Total logs</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{getStreak(logs)}</span>
            <span className="stat-label">Day streak 🔥</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{getUniqueTags(logs)}</span>
            <span className="stat-label">Technologies</span>
          </div>
        </div>

        <StreakCalendar logs={logs} />
        <LogEditor onLogCreated={handleLogCreated} />

        <h2 className="section-title">Your logs</h2>
        {loading && <p className="dash-muted">Loading your logs...</p>}
        {!loading && logs.length === 0 && (
          <p className="dash-muted">No logs yet. Write your first one above!</p>
        )}
        {logs.map(log => (
          <LogCard key={log.id} log={log} onDelete={handleLogDeleted} />
        ))}
      </main>
    </div>
  );
}

function getStreak(logs) {
  if (!logs.length) return 0;
  const days = [...new Set(logs.map(l => l.created_at.slice(0, 10)))].sort().reverse();
  const today = new Date().toISOString().slice(0, 10);
  if (days[0] !== today) return 0;
  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    const diff = (new Date(days[i - 1]) - new Date(days[i])) / 86400000;
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

function getUniqueTags(logs) {
  const all = logs.flatMap(l => l.tags ? l.tags.split(',').map(t => t.trim()).filter(Boolean) : []);
  return new Set(all).size;
}
