import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { asyncCreateThread } from '../states/threads/slice.js';
import ThreadInput from '../components/ThreadInput.jsx';

function NewThreadPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.authUser);
  const { status } = useSelector((state) => state.threads);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const onSubmit = async ({ title, body, category }) => {
    const result = await dispatch(asyncCreateThread({ title, body, category }));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/');
    }
  };

  return (
    <div className="narrow-wrap">
      <h2>Buat Thread Baru</h2>
      <p className="muted">Bagikan pertanyaan atau ide menarikmu.</p>
      <ThreadInput onSubmit={onSubmit} isLoading={status === 'loading'} />
    </div>
  );
}

export default NewThreadPage;
