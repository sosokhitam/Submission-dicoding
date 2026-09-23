import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../utils/api.js';

const asyncFetchLeaderboards = createAsyncThunk(
  'leaderboards/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const leaderboards = await api.getLeaderboards();
      return leaderboards;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const leaderboardsSlice = createSlice({
  name: 'leaderboards',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(asyncFetchLeaderboards.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(asyncFetchLeaderboards.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(asyncFetchLeaderboards.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export { asyncFetchLeaderboards };
export default leaderboardsSlice.reducer;
