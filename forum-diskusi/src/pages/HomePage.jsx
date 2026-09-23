import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { asyncFetchThreads, setCategoryFilter } from '../states/threads/slice.js';
import { asyncFetchUsers } from '../states/users/slice.js';
import ThreadList from '../components/ThreadList.jsx';
import CategoryFilter from '../components/CategoryFilter.jsx';
import Loading from '../components/Loading.jsx';

function HomePage() {
  const dispatch = useDispatch();
  const { list: threads, status, categoryFilter } = useSelector((state) => state.threads);
  const { list: users } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(asyncFetchThreads());
    dispatch(asyncFetchUsers());
  }, [dispatch]);

  const categories = useMemo(() => {
    const set = new Set(threads.map((t) => t.category).filter(Boolean));
    return Array.from(set);
  }, [threads]);

  const filteredThreads = useMemo(() => {
    if (categoryFilter === 'all') {
      return threads;
    }
    return threads.filter((t) => t.category === categoryFilter);
  }, [threads, categoryFilter]);

  return (
    <div className="layout-2col">
      <section>
        <div className="page-head">
          <h2>Diskusi Terbaru</h2>
          <p className="muted">{filteredThreads.length} thread ditampilkan</p>
        </div>
        {status === 'loading' && <Loading text="Memuat threads…" />}
        {status !== 'loading' && <ThreadList threads={filteredThreads} users={users} />}
      </section>
      <CategoryFilter
        categories={categories}
        active={categoryFilter}
        onSelect={(cat) => dispatch(setCategoryFilter(cat))}
      />
    </div>
  );
}

export default HomePage;
