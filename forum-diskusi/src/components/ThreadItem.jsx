import { Link } from 'react-router-dom';
import { postedAt, stripHtml, truncate } from '../utils/date.js';
import VoteButtons from './VoteButtons.jsx';

function ThreadItem({ thread, owner }) {
  const bodyText = truncate(stripHtml(thread.body || ''), 180);

  return (
    <article className="thread-card">
      <div className="thread-main">
        <div className="thread-meta">
          <span className="category">#{thread.category}</span>
          <span>•</span>
          <span>{postedAt(thread.createdAt)}</span>
          <span>•</span>
          <span>{thread.totalComments} komentar</span>
        </div>
        <Link to={`/threads/${thread.id}`} className="thread-title">
          {thread.title}
        </Link>
        <p className="thread-body">{bodyText}</p>
        <div className="thread-footer">
          <div className="owner">
            <img src={owner?.avatar} alt={owner?.name || 'user'} className="avatar-sm" />
            <span>{owner?.name || 'Pengguna'}</span>
          </div>
          <VoteButtons
            type="thread-list"
            threadId={thread.id}
            upVotesBy={thread.upVotesBy}
            downVotesBy={thread.downVotesBy}
          />
        </div>
      </div>
    </article>
  );
}

export default ThreadItem;
