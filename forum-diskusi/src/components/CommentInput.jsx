import { useState } from 'react';

function CommentInput({ onSubmit, isLoading }) {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) {
      return;
    }
    onSubmit(content);
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <label className="field">
        Tulis komentar
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Bagikan pendapatmu…"
          className="input textarea"
          rows={4}
          required
        />
      </label>
      <button type="submit" className="btn-primary" disabled={isLoading}>
        {isLoading ? 'Mengirim…' : 'Kirim Komentar'}
      </button>
    </form>
  );
}

export default CommentInput;
