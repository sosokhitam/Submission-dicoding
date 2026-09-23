import { useDispatch, useSelector } from 'react-redux';
import { asyncVoteThread } from '../states/threads/slice.js';
import { asyncVoteThreadDetail, asyncVoteComment } from '../states/threadDetail/slice.js';

function getVoteType(upVotesBy, downVotesBy, userId) {
  if (upVotesBy.includes(userId)) {
    return 'up';
  }
  if (downVotesBy.includes(userId)) {
    return 'down';
  }
  return null;
}

function VoteButtons({ type, threadId, commentId, upVotesBy = [], downVotesBy = [] }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authUser);
  const userId = user?.id || '';
  const active = getVoteType(upVotesBy, downVotesBy, userId);
  const score = upVotesBy.length - downVotesBy.length;

  const handleVote = (kind) => {
    if (!user) {
      alert('Silakan login dulu untuk vote.');
      return;
    }
    let voteType = 'neutral-vote';
    if (kind === 'up') {
      voteType = active === 'up' ? 'neutral-vote' : 'up-vote';
    }
    if (kind === 'down') {
      voteType = active === 'down' ? 'neutral-vote' : 'down-vote';
    }

    if (type === 'thread-list') {
      dispatch(asyncVoteThread({ threadId, voteType, userId }));
    }
    if (type === 'thread-detail') {
      dispatch(asyncVoteThreadDetail({ threadId, voteType, userId }));
    }
    if (type === 'comment') {
      dispatch(asyncVoteComment({ threadId, commentId, voteType, userId }));
    }
  };

  return (
    <div className="votes">
      <button
        type="button"
        aria-label="up vote"
        className={active === 'up' ? 'vote-btn active-up' : 'vote-btn'}
        onClick={() => handleVote('up')}
      >
        ▲
      </button>
      <span className="vote-score">{score}</span>
      <button
        type="button"
        aria-label="down vote"
        className={active === 'down' ? 'vote-btn active-down' : 'vote-btn'}
        onClick={() => handleVote('down')}
      >
        ▼
      </button>
    </div>
  );
}

export default VoteButtons;
