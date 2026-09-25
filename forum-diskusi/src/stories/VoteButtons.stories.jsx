import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import VoteButtons from '../components/VoteButtons.jsx';

function makeStore(user) {
  return configureStore({
    reducer: {
      authUser: (state = { user }) => state,
      threads: (state = {}) => state,
      threadDetail: (state = {}) => state,
    },
  });
}

const meta = {
  title: 'Forum/VoteButtons',
  component: VoteButtons,
};

export default meta;

export function BelumVote() {
  return (
    <Provider store={makeStore({ id: 'user-1' })}>
      <VoteButtons type="thread-list" threadId="thread-1" upVotesBy={[]} downVotesBy={[]} />
    </Provider>
  );
}

export function SudahUpVote() {
  return (
    <Provider store={makeStore({ id: 'user-1' })}>
      <VoteButtons type="thread-list" threadId="thread-1" upVotesBy={['user-1']} downVotesBy={[]} />
    </Provider>
  );
}

export function SudahDownVote() {
  return (
    <Provider store={makeStore({ id: 'user-1' })}>
      <VoteButtons type="thread-list" threadId="thread-1" upVotesBy={[]} downVotesBy={['user-1']} />
    </Provider>
  );
}
