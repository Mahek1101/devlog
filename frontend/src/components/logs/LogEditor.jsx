import { useState } from 'react';
import { createLog } from '../../api/logs';
import './LogEditor.css';

const LANGUAGES = ['', 'javascript', 'python', 'jsx', 'css', 'html', 'bash', 'json', 'typescript'];

export default function LogEditor({ onLogCreated }) {
  const [form, setForm] = useState({ title: '', content: '', snippet: '', language: '', tags: '' });
  const [showSnippet, setShowSnippet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and content are required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await createLog(form);
      onLogCreated(res.data);
      setForm({ title: '', content: '', snippet: '', language: '', tags: '' });
      setShowSnippet(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create log');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editor-card">
      <h2 className="editor-heading">New Log Entry</h2>
      {error && <div className="editor-error">{error}</div>}
      <form onSubmit={handleSubmit} className="editor-form">
        <input
          className="editor-input"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="What did you work on today?"
        />
        <textarea
          className="editor-textarea"
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Write about what you learned, built, or struggled with..."
          rows={5}
        />
        <input
          className="editor-input"
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="Tags (comma separated): react, python, css"
        />

        <button
          type="button"
          className="snippet-toggle"
          onClick={() => setShowSnippet(!showSnippet)}
        >
          {showSnippet ? '− Remove code snippet' : '+ Add code snippet'}
        </button>

        {showSnippet && (
          <div className="snippet-section">
            <select
              className="editor-input"
              name="language"
              value={form.language}
              onChange={handleChange}
            >
              {LANGUAGES.map(l => (
                <option key={l} value={l}>{l || 'Select language'}</option>
              ))}
            </select>
            <textarea
              className="editor-textarea editor-code"
              name="snippet"
              value={form.snippet}
              onChange={handleChange}
              placeholder="Paste your code snippet here..."
              rows={6}
              spellCheck={false}
            />
          </div>
        )}

        <button type="submit" className="editor-btn" disabled={loading}>
          {loading ? 'Saving...' : 'Save log'}
        </button>
      </form>
    </div>
  );
}
