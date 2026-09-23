import { configureStore } from '@reduxjs/toolkit';
import authUserReducer from './authUser/slice.js';
import usersReducer from './users/slice.js';
import threadsReducer from './threads/slice.js';
import threadDetailReducer from './threadDetail/slice.js';
import leaderboardsReducer from './leaderboards/slice.js';

const store = configureStore({
  reducer: {
    authUser: authUserReducer,
    users: usersReducer,
    threads: threadsReducer,
    threadDetail: threadDetailReducer,
    leaderboards: leaderboardsReducer,
  },
});

export default store;
