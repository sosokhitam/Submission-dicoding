import { describe, it, expect } from 'vitest';
import threadsReducer, {
  setCategoryFilter,
  asyncFetchThreads,
  asyncCreateThread,
} from './slice.js';

/**
 * Skenario pengujian threads reducer:
 * 1. Harus mengembalikan initial state dengan benar.
 * 2. Harus mengubah categoryFilter saat setCategoryFilter dipanggil.
 * 3. Harus menandai status loading saat asyncFetchThreads pending.
 * 4. Harus menyimpan daftar thread saat asyncFetchThreads fulfilled.
 * 5. Harus menyimpan error saat asyncFetchThreads rejected.
 * 6. Harus menambahkan thread baru ke paling depan saat asyncCreateThread fulfilled.
 * 7. Harus menangani optimisticVote up-vote / down-vote / neutralize.
 */

describe('threads reducer', () => {
  it('harus mengembalikan initial state', () => {
    const state = threadsReducer(undefined, { type: 'unknown' });
    expect(state).toEqual({
      list: [],
      status: 'idle',
      error: null,
      categoryFilter: 'all',
    });
  });

  it('harus mengubah categoryFilter', () => {
    const state = threadsReducer(undefined, setCategoryFilter('redux'));
    expect(state.categoryFilter).toBe('redux');
  });

  it('harus menandai loading saat fetch pending', () => {
    const state = threadsReducer(undefined, { type: asyncFetchThreads.pending.type });
    expect(state.status).toBe('loading');
  });

  it('harus menyimpan threads saat fetch fulfilled', () => {
    const fakeThreads = [{ id: 'thread-1', title: 'Halo' }];
    const state = threadsReducer(undefined, {
      type: asyncFetchThreads.fulfilled.type,
      payload: fakeThreads,
    });
    expect(state.status).toBe('succeeded');
    expect(state.list).toEqual(fakeThreads);
  });

  it('harus menyimpan error saat fetch rejected', () => {
    const state = threadsReducer(undefined, {
      type: asyncFetchThreads.rejected.type,
      payload: 'Gagal memuat',
    });
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Gagal memuat');
  });

  it('harus menambahkan thread baru di depan saat create fulfilled', () => {
    const existing = { id: 'thread-1', title: 'Lama' };
    const initial = { list: [existing], status: 'succeeded', error: null, categoryFilter: 'all' };
    const created = { id: 'thread-2', title: 'Baru' };
    const state = threadsReducer(initial, {
      type: asyncCreateThread.fulfilled.type,
      payload: created,
    });
    expect(state.list[0]).toEqual(created);
    expect(state.list).toHaveLength(2);
  });

  it('harus menangani optimisticVote up-vote, down-vote, dan neutralize', () => {
    const initial = {
      list: [{ id: 'thread-1', upVotesBy: [], downVotesBy: ['user-2'] }],
      status: 'succeeded',
      error: null,
      categoryFilter: 'all',
    };
    const upVoted = threadsReducer(initial, {
      type: 'threads/optimisticVote',
      payload: { threadId: 'thread-1', voteType: 'up-vote', userId: 'user-1' },
    });
    expect(upVoted.list[0].upVotesBy).toContain('user-1');

    const downVoted = threadsReducer(initial, {
      type: 'threads/optimisticVote',
      payload: { threadId: 'thread-1', voteType: 'down-vote', userId: 'user-1' },
    });
    expect(downVoted.list[0].downVotesBy).toContain('user-1');

    const neutral = threadsReducer(
      { ...initial, list: [{ id: 'thread-1', upVotesBy: ['user-1'], downVotesBy: [] }] },
      {
        type: 'threads/optimisticVote',
        payload: { threadId: 'thread-1', voteType: 'neutral-vote', userId: 'user-1' },
      },
    );
    expect(neutral.list[0].upVotesBy).not.toContain('user-1');
  });
});
