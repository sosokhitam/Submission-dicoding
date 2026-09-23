import { postedAt } from '../utils/date.js';
import VoteButtons from './VoteButtons.jsx';

function CommentItem({ comment, threadId }) {
  return (
    <div className="comment-card">
      <div className="comment-head">
        <img src={comment.owner?.avatar} alt={comment.owner?.name} className="avatar-sm" />
        <div>
          <p className="owner-name">{comment.owner?.name}</p>
          <p className="muted-sm">{postedAt(comment.createdAt)}</p>
        </div>
      </div>
      <div className="comment-body" dangerouslySetInnerHTML={{ __html: comment.content }} />
      <VoteButtons
        type="comment"
        threadId={threadId}
        commentId={comment.id}
        upVotesBy={comment.upVotesBy}
        downVotesBy={comment.downVotesBy}
      />
    </div>
  );
}

export default CommentItem;
