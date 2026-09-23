import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Loading from './components/Loading.jsx';
import HomePage from './pages/HomePage.jsx';
import DetailPage from './pages/DetailPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import NewThreadPage from './pages/NewThreadPage.jsx';
import LeaderboardPage from './pages/LeaderboardPage.jsx';
import { asyncPreload } from './states/authUser/slice.js';

function App() {
  const dispatch = useDispatch();
  const { isPreloadDone } = useSelector((state) => state.authUser);

  useEffect(() => {
    dispatch(asyncPreload());
  }, [dispatch]);

  if (!isPreloadDone) {
    return (
      <div className="app">
        <Loading text="Menyiapkan aplikasi…" />
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/threads/:id" element={<DetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/new" element={<NewThreadPage />} />
          <Route path="/leaderboards" element={<LeaderboardPage />} />
          <Route path="*" element={<p className="empty">Halaman tidak ditemukan.</p>} />
        </Routes>
      </main>
      <footer className="footer">
        <p>Forum Diskusi • Dicoding Forum API • React + Redux</p>
      </footer>
    </div>
  );
}

export default App;
