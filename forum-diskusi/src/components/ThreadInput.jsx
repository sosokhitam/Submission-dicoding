import { useState } from 'react';

function ThreadInput({ onSubmit, isLoading }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('general');
  const [body, setBody] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      return;
    }
    onSubmit({ title: title.trim(), body, category: category.trim() || 'general' });
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <label className="field">
        Judul
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tulis judul thread…"
          className="input"
          required
        />
      </label>
      <label className="field">
        Kategori
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="mis. redux, perkenalan"
          className="input"
        />
      </label>
      <label className="field">
        Body
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Ceritakan isi diskusimu…"
          className="input textarea"
          rows={6}
          required
        />
      </label>
      <button type="submit" className="btn-primary" disabled={isLoading}>
        {isLoading ? 'Menyimpan…' : 'Buat Thread'}
      </button>
    </form>
  );
}

export default ThreadInput;
