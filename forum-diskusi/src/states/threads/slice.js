import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../utils/api.js';

const asyncFetchThreads = createAsyncThunk('threads/fetch', async (_, { rejectWithValue }) => {
  try {
    const threads = await api.getThreads();
    return threads;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const asyncCreateThread = createAsyncThunk(
  'threads/create',
  async ({ title, body, category }, { rejectWithValue }) => {
    try {
      const thread = await api.createThread({ title, body, category });
      return thread;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const asyncVoteThread = createAsyncThunk(
  'threads/vote',
  async ({ threadId, voteType, userId }, { dispatch, rejectWithValue }) => {
    dispatch(optimisticVote({ threadId, voteType, userId }));
    try {
      await api.voteThread(threadId, voteType);
      return { threadId };
    } catch (error) {
      dispatch(asyncFetchThreads());
      return rejectWithValue(error.message);
    }
  },
);

const threadsSlice = createSlice({
  name: 'threads',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
    categoryFilter: 'all',
  },
  reducers: {
    setCategoryFilter(state, action) {
      state.categoryFilter = action.payload;
    },
    optimisticVote(state, action) {
      const { threadId, voteType, userId } = action.payload;
      const thread = state.list.find((item) => item.id === threadId);
      if (!thread) {
        return;
      }
      thread.upVotesBy = thread.upVotesBy.filter((id) => id !== userId);
      thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId);
      if (voteType === 'up-vote') {
        thread.upVotesBy.push(userId);
      }
      if (voteType === 'down-vote') {
        thread.downVotesBy.push(userId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncFetchThreads.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(asyncFetchThreads.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(asyncFetchThreads.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(asyncCreateThread.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(asyncCreateThread.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = [action.payload, ...state.list];
      })
      .addCase(asyncCreateThread.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

const { setCategoryFilter, optimisticVote } = threadsSlice.actions;

export { asyncFetchThreads, asyncCreateThread, asyncVoteThread, setCategoryFilter };
export default threadsSlice.reducer;
