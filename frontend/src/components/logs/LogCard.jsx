import { useState } from 'react';
import { deleteLog } from '../../api/logs';
import './LogCard.css';

export default function LogCard({ log, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Delete this log?')) return;
    setDeleting(true);
    try {
      await deleteLog(log.id);
      onDelete(log.id);
    } catch {
      setDeleting(false);
    }
  };

  const tags = log.tags ? log.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
  const date = new Date(log.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="log-card">
      <div className="log-header">
        <div>
          <h3 className="log-title">{log.title}</h3>
          <span className="log-date">{date}</span>
        </div>
        <div className="log-actions">
          <button className="log-action-btn" onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Collapse' : 'Read more'}
          </button>
          <button className="log-action-btn log-delete-btn" onClick={handleDelete} disabled={deleting}>
            {deleting ? '...' : 'Delete'}
          </button>
        </div>
      </div>

      <p className="log-content">
        {expanded ? log.content : `${log.content.slice(0, 120)}${log.content.length > 120 ? '...' : ''}`}
      </p>

      {tags.length > 0 && (
        <div className="log-tags">
          {tags.map(tag => <span key={tag} className="log-tag">{tag}</span>)}
        </div>
      )}

      {expanded && log.snippet && (
        <div className="log-snippet">
          {log.language && <div className="snippet-lang">{log.language}</div>}
          <pre><code>{log.snippet}</code></pre>
        </div>
      )}
    </div>
  );
}
