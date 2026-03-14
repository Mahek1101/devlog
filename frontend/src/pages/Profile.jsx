import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProfile, getUserLogs, followUser, unfollowUser } from '../api/users';
import LogCard from '../components/logs/LogCard';
import './Profile.css';

export default function Profile({ currentUser }) {
  const { username } = useParams();
  const navigate     = useNavigate();
  const [profile, setProfile] = useState(null);
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProfile(username), getUserLogs(username)])
      .then(([profileRes, logsRes]) => {
        setProfile(profileRes.data);
        setLogs(logsRes.data);
      })
      .catch(() => navigate('/feed'))
      .finally(() => setLoading(false));
  }, [username]);

  const handleFollow = async () => {
    try {
      if (profile.is_following) {
        await unfollowUser(username);
        setProfile({ ...profile, is_following: false, followers: profile.followers - 1 });
      } else {
        await followUser(username);
        setProfile({ ...profile, is_following: true, followers: profile.followers + 1 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="profile-loading">Loading...</div>;
  if (!profile) return null;

  const isOwnProfile = currentUser?.username === username;

  return (
    <div className="profile-page">
      <header className="profile-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      </header>

      <div className="profile-main">
        <div className="profile-card">
          <div className="profile-avatar">
            {username[0].toUpperCase()}
          </div>
          <div className="profile-info">
            <h1 className="profile-username">@{profile.username}</h1>
            {profile.bio && <p className="profile-bio">{profile.bio}</p>}
            <div className="profile-stats">
              <div className="profile-stat">
                <span className="profile-stat-value">{profile.total_logs}</span>
                <span className="profile-stat-label">Logs</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-value">{profile.followers}</span>
                <span className="profile-stat-label">Followers</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-value">{profile.following}</span>
                <span className="profile-stat-label">Following</span>
              </div>
            </div>
          </div>
          {!isOwnProfile && (
            <button
              className={`follow-btn ${profile.is_following ? 'following' : ''}`}
              onClick={handleFollow}
            >
              {profile.is_following ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>

        <h2 className="section-title">{isOwnProfile ? 'Your logs' : `${username}'s logs`}</h2>

        {logs.length === 0 && <p className="profile-empty">No logs yet.</p>}
        {logs.map(log => (
          <LogCard key={log.id} log={log} onDelete={() => {}} />
        ))}
      </div>
    </div>
  );
}
