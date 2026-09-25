import { describe, it, expect } from 'vitest';
import leaderboardsReducer, { asyncFetchLeaderboards } from './slice.js';

/**
 * Skenario pengujian leaderboards reducer:
 * 1. Harus mengembalikan initial state.
 * 2. Harus menandai loading saat fetch pending.
 * 3. Harus menyimpan leaderboard saat fetch fulfilled.
 * 4. Harus menyimpan error saat fetch rejected.
 */

describe('leaderboards reducer', () => {
  it('harus mengembalikan initial state', () => {
    const state = leaderboardsReducer(undefined, { type: 'unknown' });
    expect(state).toEqual({ list: [], status: 'idle', error: null });
  });

  it('harus menandai loading saat fetch pending', () => {
    const state = leaderboardsReducer(undefined, { type: asyncFetchLeaderboards.pending.type });
    expect(state.status).toBe('loading');
  });

  it('harus menyimpan data saat fetch fulfilled', () => {
    const data = [{ user: { id: 'user-1' }, score: 10 }];
    const state = leaderboardsReducer(undefined, {
      type: asyncFetchLeaderboards.fulfilled.type,
      payload: data,
    });
    expect(state.status).toBe('succeeded');
    expect(state.list).toEqual(data);
  });

  it('harus menyimpan error saat fetch rejected', () => {
    const state = leaderboardsReducer(undefined, {
      type: asyncFetchLeaderboards.rejected.type,
      payload: 'Gagal',
    });
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Gagal');
  });
});
