import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { asyncLogout } from '../states/authUser/slice.js';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.authUser);
  const threadsStatus = useSelector((state) => state.threads.status);
  const detailStatus = useSelector((state) => state.threadDetail.status);

  const isLoading = threadsStatus === 'loading' || detailStatus === 'loading';

  const onLogout = () => {
    dispatch(asyncLogout());
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">D</span>
          <span className="brand-text">DiskusiForum</span>
        </Link>
        <nav className="nav-links">
          <Link to="/">Threads</Link>
          <Link to="/leaderboards">Leaderboard</Link>
          {user && <Link to="/new" className="btn-primary-sm">+ Thread Baru</Link>}
        </nav>
        <div className="nav-user">
          {user ? (
            <>
              <img src={user.avatar} alt={user.name} className="avatar-sm" />
              <span className="user-name">{user.name}</span>
              <button type="button" onClick={onLogout} className="btn-ghost">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Login</Link>
              <Link to="/register" className="btn-primary-sm">Register</Link>
            </>
          )}
        </div>
      </div>
      {isLoading && <div className="loading-bar"><div className="loading-bar-inner" /></div>}
    </header>
  );
}

export default Navbar;
