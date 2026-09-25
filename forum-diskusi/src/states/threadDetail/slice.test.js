import { describe, it, expect } from 'vitest';
import threadDetailReducer, {
  clearDetail,
  asyncFetchThreadDetail,
  asyncCreateComment,
} from './slice.js';

/**
 * Skenario pengujian threadDetail reducer:
 * 1. Harus mengembalikan initial state.
 * 2. Harus menyimpan detail saat fetch fulfilled.
 * 3. Harus menyimpan error saat fetch rejected.
 * 4. Harus membersihkan detail saat clearDetail.
 * 5. Harus menangani optimistic vote thread dan komentar.
 */

describe('threadDetail reducer', () => {
  it('harus mengembalikan initial state', () => {
    const state = threadDetailReducer(undefined, { type: 'unknown' });
    expect(state).toEqual({ detail: null, status: 'idle', error: null });
  });

  it('harus menyimpan detail saat fetch fulfilled', () => {
    const detail = { id: 'thread-1', title: 'Tes', upVotesBy: [], downVotesBy: [], comments: [] };
    const state = threadDetailReducer(undefined, {
      type: asyncFetchThreadDetail.fulfilled.type,
      payload: detail,
    });
    expect(state.status).toBe('succeeded');
    expect(state.detail).toEqual(detail);
  });

  it('harus menyimpan error saat fetch rejected', () => {
    const state = threadDetailReducer(undefined, {
      type: asyncFetchThreadDetail.rejected.type,
      payload: 'Tidak ditemukan',
    });
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Tidak ditemukan');
  });

  it('harus membersihkan detail saat clearDetail', () => {
    const filled = { detail: { id: 'thread-1' }, status: 'succeeded', error: null };
    const state = threadDetailReducer(filled, clearDetail());
    expect(state.detail).toBeNull();
    expect(state.status).toBe('idle');
  });

  it('harus memperbarui detail saat create comment fulfilled', () => {
    const updated = { id: 'thread-1', comments: [{ id: 'comment-1' }] };
    const state = threadDetailReducer(undefined, {
      type: asyncCreateComment.fulfilled.type,
      payload: { detail: updated },
    });
    expect(state.detail).toEqual(updated);
  });

  it('harus menangani optimistic vote thread dan komentar', () => {
    const initial = {
      detail: {
        id: 'thread-1',
        upVotesBy: [],
        downVotesBy: [],
        comments: [{ id: 'comment-1', upVotesBy: [], downVotesBy: [] }],
      },
      status: 'succeeded',
      error: null,
    };
    const votedThread = threadDetailReducer(initial, {
      type: 'threadDetail/optimisticVoteThread',
      payload: { voteType: 'up-vote', userId: 'user-1' },
    });
    expect(votedThread.detail.upVotesBy).toContain('user-1');

    const votedComment = threadDetailReducer(initial, {
      type: 'threadDetail/optimisticVoteComment',
      payload: { commentId: 'comment-1', voteType: 'down-vote', userId: 'user-1' },
    });
    const comment = votedComment.detail.comments.find((c) => c.id === 'comment-1');
    expect(comment.downVotesBy).toContain('user-1');
  });
});
