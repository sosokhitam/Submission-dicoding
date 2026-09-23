import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../utils/api.js';

const asyncFetchThreadDetail = createAsyncThunk(
  'threadDetail/fetch',
  async (threadId, { rejectWithValue }) => {
    try {
      const detail = await api.getThreadDetail(threadId);
      return detail;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const asyncCreateComment = createAsyncThunk(
  'threadDetail/createComment',
  async ({ threadId, content }, { rejectWithValue }) => {
    try {
      const comment = await api.createComment(threadId, content);
      const detail = await api.getThreadDetail(threadId);
      return { detail, comment };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const asyncVoteThreadDetail = createAsyncThunk(
  'threadDetail/voteThread',
  async ({ threadId, voteType, userId }, { dispatch, rejectWithValue }) => {
    dispatch(optimisticVoteThread({ voteType, userId }));
    try {
      await api.voteThread(threadId, voteType);
      return { threadId };
    } catch (error) {
      dispatch(asyncFetchThreadDetail(threadId));
      return rejectWithValue(error.message);
    }
  },
);

const asyncVoteComment = createAsyncThunk(
  'threadDetail/voteComment',
  async ({ threadId, commentId, voteType, userId }, { dispatch, rejectWithValue }) => {
    dispatch(optimisticVoteComment({ commentId, voteType, userId }));
    try {
      await api.voteComment(threadId, commentId, voteType);
      return { commentId };
    } catch (error) {
      dispatch(asyncFetchThreadDetail(threadId));
      return rejectWithValue(error.message);
    }
  },
);

const threadDetailSlice = createSlice({
  name: 'threadDetail',
  initialState: {
    detail: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearDetail(state) {
      state.detail = null;
      state.status = 'idle';
    },
    optimisticVoteThread(state, action) {
      const { voteType, userId } = action.payload;
      if (!state.detail) {
        return;
      }
      state.detail.upVotesBy = state.detail.upVotesBy.filter((id) => id !== userId);
      state.detail.downVotesBy = state.detail.downVotesBy.filter((id) => id !== userId);
      if (voteType === 'up-vote') {
        state.detail.upVotesBy.push(userId);
      }
      if (voteType === 'down-vote') {
        state.detail.downVotesBy.push(userId);
      }
    },
    optimisticVoteComment(state, action) {
      const { commentId, voteType, userId } = action.payload;
      if (!state.detail) {
        return;
      }
      const comment = state.detail.comments.find((item) => item.id === commentId);
      if (!comment) {
        return;
      }
      comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
      comment.downVotesBy = comment.downVotesBy.filter((id) => id !== userId);
      if (voteType === 'up-vote') {
        comment.upVotesBy.push(userId);
      }
      if (voteType === 'down-vote') {
        comment.downVotesBy.push(userId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncFetchThreadDetail.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(asyncFetchThreadDetail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.detail = action.payload;
      })
      .addCase(asyncFetchThreadDetail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(asyncCreateComment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(asyncCreateComment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.detail = action.payload.detail;
      })
      .addCase(asyncCreateComment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

const { clearDetail, optimisticVoteThread, optimisticVoteComment } = threadDetailSlice.actions;

export {
  asyncFetchThreadDetail,
  asyncCreateComment,
  asyncVoteThreadDetail,
  asyncVoteComment,
  clearDetail,
};
export default threadDetailSlice.reducer;
