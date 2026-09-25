import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import detailReducer, { asyncFetchThreadDetail, asyncCreateComment } from './slice.js';
import api from '../../utils/api.js';

vi.mock('../../utils/api.js', () => ({
  default: {
    getThreadDetail: vi.fn(),
    createComment: vi.fn(),
  },
}));

/**
 * Skenario pengujian thunk threadDetail:
 * 1. asyncFetchThreadDetail berhasil -> detail tersimpan.
 * 2. asyncFetchThreadDetail gagal -> error tersimpan.
 * 3. asyncCreateComment berhasil -> memanggil createComment lalu refetch detail.
 */

describe('threadDetail thunk', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('asyncFetchThreadDetail berhasil', async () => {
    const detail = { id: 'thread-1', title: 'Tes' };
    api.getThreadDetail.mockResolvedValue(detail);
    const store = configureStore({ reducer: { threadDetail: detailReducer } });
    await store.dispatch(asyncFetchThreadDetail('thread-1'));
    expect(store.getState().threadDetail.detail).toEqual(detail);
  });

  it('asyncFetchThreadDetail gagal', async () => {
    api.getThreadDetail.mockRejectedValue(new Error('Tidak ditemukan'));
    const store = configureStore({ reducer: { threadDetail: detailReducer } });
    await store.dispatch(asyncFetchThreadDetail('salah'));
    expect(store.getState().threadDetail.status).toBe('failed');
  });

  it('asyncCreateComment memanggil API lalu refetch', async () => {
    api.createComment.mockResolvedValue({ id: 'comment-1' });
    api.getThreadDetail.mockResolvedValue({ id: 'thread-1', comments: [{ id: 'comment-1' }] });
    const store = configureStore({ reducer: { threadDetail: detailReducer } });
    await store.dispatch(asyncCreateComment({ threadId: 'thread-1', content: 'Keren!' }));
    expect(api.createComment).toHaveBeenCalledWith('thread-1', 'Keren!');
    expect(store.getState().threadDetail.detail.comments).toHaveLength(1);
  });
});
