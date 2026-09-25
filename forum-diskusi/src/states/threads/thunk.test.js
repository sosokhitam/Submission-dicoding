import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import threadsReducer, { asyncFetchThreads, asyncCreateThread, asyncVoteThread } from './slice.js';
import api from '../../utils/api.js';

vi.mock('../../utils/api.js', () => ({
  default: {
    getThreads: vi.fn(),
    createThread: vi.fn(),
    voteThread: vi.fn(),
  },
}));

/**
 * Skenario pengujian thunk threads:
 * 1. asyncFetchThreads berhasil -> status succeeded dan list terisi.
 * 2. asyncFetchThreads gagal -> status failed dan error terisi.
 * 3. asyncCreateThread berhasil -> thread baru ada di depan list.
 * 4. asyncVoteThread optimistik -> upVotesBy langsung bertambah lalu panggil API.
 */

function createTestStore() {
  return configureStore({ reducer: { threads: threadsReducer } });
}

describe('threads thunk', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('asyncFetchThreads berhasil menyimpan threads', async () => {
    const fake = [{ id: 'thread-1', title: 'Halo' }];
    api.getThreads.mockResolvedValue(fake);
    const store = createTestStore();
    await store.dispatch(asyncFetchThreads());
    const state = store.getState().threads;
    expect(state.status).toBe('succeeded');
    expect(state.list).toEqual(fake);
  });

  it('asyncFetchThreads gagal menyimpan error', async () => {
    api.getThreads.mockRejectedValue(new Error('Network error'));
    const store = createTestStore();
    await store.dispatch(asyncFetchThreads());
    const state = store.getState().threads;
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Network error');
  });

  it('asyncCreateThread berhasil menambahkan thread di depan', async () => {
    const created = { id: 'thread-99', title: 'Baru' };
    api.createThread.mockResolvedValue(created);
    const store = createTestStore();
    await store.dispatch(asyncCreateThread({ title: 'Baru', body: 'Isi', category: 'general' }));
    expect(store.getState().threads.list[0]).toEqual(created);
    expect(api.createThread).toHaveBeenCalledWith({ title: 'Baru', body: 'Isi', category: 'general' });
  });

  it('asyncVoteThread optimistik menambah vote lalu memanggil API', async () => {
    api.voteThread.mockResolvedValue();
    const store = configureStore({
      reducer: { threads: threadsReducer },
      preloadedState: {
        threads: {
          list: [{ id: 'thread-1', upVotesBy: [], downVotesBy: [] }],
          status: 'succeeded',
          error: null,
          categoryFilter: 'all',
        },
      },
    });
    await store.dispatch(asyncVoteThread({ threadId: 'thread-1', voteType: 'up-vote', userId: 'user-1' }));
    expect(store.getState().threads.list[0].upVotesBy).toContain('user-1');
    expect(api.voteThread).toHaveBeenCalledWith('thread-1', 'up-vote');
  });
});
