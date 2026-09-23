import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../utils/api.js';

const asyncPreload = createAsyncThunk('authUser/preload', async (_, { rejectWithValue }) => {
  try {
    const token = api.getAccessToken();
    if (!token) {
      return null;
    }
    const user = await api.getOwnProfile();
    return user;
  } catch (error) {
    api.removeAccessToken();
    return rejectWithValue(error.message);
  }
});

const asyncLogin = createAsyncThunk('authUser/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const token = await api.login({ email, password });
    api.putAccessToken(token);
    const user = await api.getOwnProfile();
    return user;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const asyncRegister = createAsyncThunk(
  'authUser/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      await api.register({ name, email, password });
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const asyncLogout = createAsyncThunk('authUser/logout', async () => {
  api.removeAccessToken();
  return null;
});

const authUserSlice = createSlice({
  name: 'authUser',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
    isPreloadDone: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(asyncPreload.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(asyncPreload.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isPreloadDone = true;
      })
      .addCase(asyncPreload.rejected, (state) => {
        state.status = 'succeeded';
        state.user = null;
        state.isPreloadDone = true;
      })
      .addCase(asyncLogin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(asyncLogin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(asyncLogin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(asyncRegister.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(asyncRegister.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(asyncRegister.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(asyncLogout.fulfilled, (state) => {
        state.user = null;
        state.status = 'idle';
      });
  },
});

export { asyncPreload, asyncLogin, asyncRegister, asyncLogout };
export default authUserSlice.reducer;
