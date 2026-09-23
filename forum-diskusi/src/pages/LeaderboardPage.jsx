import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { asyncFetchLeaderboards } from '../states/leaderboards/slice.js';
import Loading from '../components/Loading.jsx';

function LeaderboardPage() {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector((state) => state.leaderboards);

  useEffect(() => {
    dispatch(asyncFetchLeaderboards());
  }, [dispatch]);

  return (
    <div className="narrow-wrap">
      <h2>Leaderboard</h2>
      <p className="muted">Pengguna paling aktif di forum.</p>
      {status === 'loading' && <Loading text="Memuat leaderboard…" />}
      {status === 'failed' && <p className="error">{error}</p>}
      <div className="leader-list">
        {list.map((item, index) => (
          <div key={item.user.id} className="leader-card">
            <span className="rank">#{index + 1}</span>
            <img src={item.user.avatar} alt={item.user.name} className="avatar" />
            <div className="leader-info">
              <p className="owner-name">{item.user.name}</p>
              <p className="muted-sm">{item.user.email}</p>
            </div>
            <span className="score">{item.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LeaderboardPage;
