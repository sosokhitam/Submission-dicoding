import { describe, it, expect } from 'vitest';
import authUserReducer, { asyncLogin, asyncRegister } from './slice.js';

/**
 * Skenario pengujian authUser reducer:
 * 1. Harus mengembalikan initial state.
 * 2. Harus menandai loading saat login pending.
 * 3. Harus menyimpan user saat login fulfilled.
 * 4. Harus menyimpan error saat login rejected.
 * 5. Harus menandai loading dan sukses saat register.
 */

describe('authUser reducer', () => {
  it('harus mengembalikan initial state', () => {
    const state = authUserReducer(undefined, { type: 'unknown' });
    expect(state.user).toBeNull();
    expect(state.isPreloadDone).toBe(false);
  });

  it('harus menandai loading saat login pending', () => {
    const state = authUserReducer(undefined, { type: asyncLogin.pending.type });
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('harus menyimpan user saat login fulfilled', () => {
    const user = { id: 'user-1', name: 'Dicoding' };
    const state = authUserReducer(undefined, {
      type: asyncLogin.fulfilled.type,
      payload: user,
    });
    expect(state.status).toBe('succeeded');
    expect(state.user).toEqual(user);
  });

  it('harus menyimpan error saat login rejected', () => {
    const state = authUserReducer(undefined, {
      type: asyncLogin.rejected.type,
      payload: 'Email atau password salah',
    });
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Email atau password salah');
  });

  it('harus menangani register pending dan fulfilled', () => {
    const pending = authUserReducer(undefined, { type: asyncRegister.pending.type });
    expect(pending.status).toBe('loading');
    const fulfilled = authUserReducer(undefined, { type: asyncRegister.fulfilled.type });
    expect(fulfilled.status).toBe('succeeded');
  });
});
