import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { asyncLogin, asyncRegister, asyncPreload } from './slice.js';
import api from '../../utils/api.js';

vi.mock('../../utils/api.js', () => ({
  default: {
    login: vi.fn(),
    register: vi.fn(),
    getOwnProfile: vi.fn(),
    getAccessToken: vi.fn(),
    putAccessToken: vi.fn(),
    removeAccessToken: vi.fn(),
  },
}));

/**
 * Skenario pengujian thunk authUser:
 * 1. asyncLogin berhasil -> menyimpan token, memanggil getOwnProfile, menyimpan user.
 * 2. asyncLogin gagal -> status failed dan error terisi.
 * 3. asyncRegister berhasil -> status succeeded.
 * 4. asyncPreload tanpa token -> mengembalikan null dan preload selesai.
 */

describe('authUser thunk', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('asyncLogin berhasil menyimpan user', async () => {
    const user = { id: 'user-1', name: 'Dicoding' };
    api.login.mockResolvedValue('fake-token');
    api.getOwnProfile.mockResolvedValue(user);
    const store = configureStore({ reducer: { authUser: authReducer } });
    await store.dispatch(asyncLogin({ email: 'a@a.com', password: 'secret123' }));
    const state = store.getState().authUser;
    expect(api.putAccessToken).toHaveBeenCalledWith('fake-token');
    expect(state.user).toEqual(user);
    expect(state.status).toBe('succeeded');
  });

  it('asyncLogin gagal menyimpan error', async () => {
    api.login.mockRejectedValue(new Error('Email atau password salah'));
    const store = configureStore({ reducer: { authUser: authReducer } });
    await store.dispatch(asyncLogin({ email: 'salah@mail.com', password: 'salah' }));
    const state = store.getState().authUser;
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Email atau password salah');
  });

  it('asyncRegister berhasil', async () => {
    api.register.mockResolvedValue({ id: 'user-1' });
    const store = configureStore({ reducer: { authUser: authReducer } });
    const result = await store.dispatch(asyncRegister({ name: 'Tes', email: 't@t.com', password: 'secret123' }));
    expect(result.meta.requestStatus).toBe('fulfilled');
    expect(store.getState().authUser.status).toBe('succeeded');
  });

  it('asyncPreload tanpa token mengembalikan null', async () => {
    api.getAccessToken.mockReturnValue(null);
    const store = configureStore({ reducer: { authUser: authReducer } });
    await store.dispatch(asyncPreload());
    const state = store.getState().authUser;
    expect(state.user).toBeNull();
    expect(state.isPreloadDone).toBe(true);
  });
});
