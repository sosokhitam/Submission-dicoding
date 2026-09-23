import { useState } from 'react';

function CategoryFilter({ categories, active, onSelect }) {
  const [keyword, setKeyword] = useState('');

  const filtered = categories.filter((cat) => cat.toLowerCase().includes(keyword.toLowerCase()));

  return (
    <aside className="filter-box">
      <h3>Kategori</h3>
      <input
        type="text"
        placeholder="Cari kategori…"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="input"
      />
      <div className="chips">
        <button
          type="button"
          className={active === 'all' ? 'chip active' : 'chip'}
          onClick={() => onSelect('all')}
        >
          Semua
        </button>
        {filtered.map((cat) => (
          <button
            key={cat}
            type="button"
            className={active === cat ? 'chip active' : 'chip'}
            onClick={() => onSelect(cat)}
          >
            #{cat}
          </button>
        ))}
      </div>
    </aside>
  );
}

export default CategoryFilter;
