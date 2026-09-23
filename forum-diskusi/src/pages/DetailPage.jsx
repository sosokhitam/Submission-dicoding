import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  asyncCreateComment,
  asyncFetchThreadDetail,
  clearDetail,
} from '../states/threadDetail/slice.js';
import CommentItem from '../components/CommentItem.jsx';
import CommentInput from '../components/CommentInput.jsx';
import VoteButtons from '../components/VoteButtons.jsx';
import Loading from '../components/Loading.jsx';
import { postedAt } from '../utils/date.js';

function DetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { detail, status, error } = useSelector((state) => state.threadDetail);
  const { user } = useSelector((state) => state.authUser);

  useEffect(() => {
    dispatch(asyncFetchThreadDetail(id));
    return () => {
      dispatch(clearDetail());
    };
  }, [dispatch, id]);

  const onCreateComment = (content) => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(asyncCreateComment({ threadId: id, content }));
  };

  if (status === 'loading' && !detail) {
    return <Loading text="Memuat detail thread…" />;
  }

  if (status === 'failed') {
    return <p className="error">Gagal memuat thread: {error}</p>;
  }

  if (!detail) {
    return null;
  }

  return (
    <div className="detail-wrap">
      <div className="thread-detail-card">
        <span className="category">#{detail.category}</span>
        <h2 className="detail-title">{detail.title}</h2>
        <div className="owner-row">
          <img src={detail.owner?.avatar} alt={detail.owner?.name} className="avatar" />
          <div>
            <p className="owner-name">{detail.owner?.name}</p>
            <p className="muted-sm">{postedAt(detail.createdAt)}</p>
          </div>
        </div>
        <div className="detail-body" dangerouslySetInnerHTML={{ __html: detail.body }} />
        <VoteButtons
          type="thread-detail"
          threadId={detail.id}
          upVotesBy={detail.upVotesBy}
          downVotesBy={detail.downVotesBy}
        />
      </div>

      <h3>Komentar ({detail.comments?.length || 0})</h3>
      {user ? (
        <CommentInput onSubmit={onCreateComment} isLoading={status === 'loading'} />
      ) : (
        <p className="muted">
          <a href="/login">Login</a> untuk ikut berkomentar.
        </p>
      )}
      <div className="comment-list">
        {(detail.comments || []).map((comment) => (
          <CommentItem key={comment.id} comment={comment} threadId={detail.id} />
        ))}
      </div>
    </div>
  );
}

export default DetailPage;
