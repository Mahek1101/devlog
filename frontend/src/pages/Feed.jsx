import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFeed, searchUsers } from '../api/users';
import LogCard from '../components/logs/LogCard';
import './Feed.css';

export default function Feed({ user, logout }) {
  const navigate = useNavigate();
  const [logs, setLogs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [results, setResults]   = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    getFeed()
      .then(res => setLogs(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!search.trim()) { setResults([]); return; }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await searchUsers(search);
        setResults(res.data);
      } catch { setResults([]); }
      finally { setSearching(false); }
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="feed-page">
      <header className="feed-header">
        <h1 className="feed-logo" onClick={() => navigate('/dashboard')} style={{cursor:'pointer'}}>DevLog</h1>
        <div className="feed-nav">
          <button className="nav-btn" onClick={() => navigate('/dashboard')}>My logs</button>
          <button className="nav-btn active">Feed</button>
          <button className="nav-btn" onClick={() => navigate(`/profile/${user?.username}`)}>Profile</button>
          <button className="nav-btn logout" onClick={handleLogout}>Log out</button>
        </div>
      </header>

      <div className="feed-main">
        <div className="search-box">
          <input
            className="search-input"
            placeholder="Search developers by username..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {results.length > 0 && (
            <div className="search-results">
              {results.map(u => (
                <div
                  key={u.id}
                  className="search-result"
                  onClick={() => { navigate(`/profile/${u.username}`); setSearch(''); setResults([]); }}
                >
                  <div className="result-avatar">{u.username[0].toUpperCase()}</div>
                  <div>
                    <p className="result-username">@{u.username}</p>
                    <p className="result-logs">{u.total_logs} logs</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {search && results.length === 0 && !searching && (
            <div className="search-results">
              <p className="no-results">No developers found</p>
            </div>
          )}
        </div>

        <h2 className="feed-title">Community feed</h2>

        {loading && <p className="feed-muted">Loading feed...</p>}
        {!loading && logs.length === 0 && (
          <div className="feed-empty">
            <p>Your feed is empty.</p>
            <p>Search for developers above and follow them to see their logs here!</p>
          </div>
        )}

        {logs.map(log => (
          <div key={log.id}>
            <p
              className="log-author"
              onClick={() => navigate(`/profile/${log.author_username}`)}
            >
              @{log.author_username}
            </p>
            <LogCard log={log} onDelete={() => {}} />
          </div>
        ))}
      </div>
    </div>
  );
}
