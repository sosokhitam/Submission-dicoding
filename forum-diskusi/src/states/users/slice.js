import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../utils/api.js';

const asyncFetchUsers = createAsyncThunk('users/fetch', async (_, { rejectWithValue }) => {
  try {
    const users = await api.getAllUsers();
    return users;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(asyncFetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(asyncFetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(asyncFetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export { asyncFetchUsers };
export default usersSlice.reducer;
