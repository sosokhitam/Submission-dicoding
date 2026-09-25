import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ThreadItem from '../components/ThreadItem.jsx';

function makeStore() {
  return configureStore({
    reducer: {
      authUser: (state = { user: { id: 'user-1', name: 'Dicoding' } }) => state,
      threads: (state = {}) => state,
      threadDetail: (state = {}) => state,
    },
  });
}

const meta = {
  title: 'Forum/ThreadItem',
  component: ThreadItem,
  decorators: [
    (Story) => (
      <Provider store={makeStore()}>
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      </Provider>
    ),
  ],
};

export default meta;

const baseThread = {
  id: 'thread-1',
  title: 'Bagaimana pengalamanmu belajar Redux?',
  body: 'Coba ceritakan dong, gimana pengalaman kalian belajar Redux di Dicoding?',
  category: 'redux',
  createdAt: new Date().toISOString(),
  totalComments: 12,
  upVotesBy: ['user-1', 'user-2'],
  downVotesBy: [],
};

const owner = {
  name: 'Dimas Saputra',
  avatar: 'https://ui-avatars.com/api/?name=Dimas+Saputra&background=random',
};

export function Default() {
  return <ThreadItem thread={baseThread} owner={owner} />;
}

export function TanpaVote() {
  return <ThreadItem thread={{ ...baseThread, upVotesBy: [], downVotesBy: [] }} owner={owner} />;
}

export function BanyakKomentar() {
  return <ThreadItem thread={{ ...baseThread, totalComments: 128 }} owner={owner} />;
}
