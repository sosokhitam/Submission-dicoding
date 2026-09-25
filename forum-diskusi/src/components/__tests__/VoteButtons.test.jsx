import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import VoteButtons from '../VoteButtons.jsx';

/**
 * Skenario pengujian VoteButtons:
 * 1. Harus menampilkan skor = upVotes - downVotes.
 * 2. Harus menandai tombol up aktif bila user sudah up-vote.
 * 3. Harus menandai tombol down aktif bila user sudah down-vote.
 * 4. Harus bisa diklik tanpa crash saat belum login (memunculkan alert).
 */

function renderVotes(props, user = null) {
  const store = configureStore({
    reducer: {
      authUser: (state = { user }) => state,
      threads: (state = {}) => state,
      threadDetail: (state = {}) => state,
    },
  });
  render(
    <Provider store={store}>
      <VoteButtons type="thread-list" threadId="thread-1" upVotesBy={[]} downVotesBy={[]} {...props} />
    </Provider>,
  );
}

describe('VoteButtons', () => {
  it('menampilkan skor dengan benar', () => {
    renderVotes({ upVotesBy: ['a', 'b'], downVotesBy: ['c'] });
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('menandai up aktif bila user sudah up-vote', () => {
    renderVotes({ upVotesBy: ['user-1'], downVotesBy: [] }, { id: 'user-1' });
    expect(screen.getByLabelText('up vote')).toHaveClass('active-up');
  });

  it('menandai down aktif bila user sudah down-vote', () => {
    renderVotes({ upVotesBy: [], downVotesBy: ['user-1'] }, { id: 'user-1' });
    expect(screen.getByLabelText('down vote')).toHaveClass('active-down');
  });

  it('memunculkan alert saat vote tanpa login', () => {
    const alertMock = window.alert;
    window.alert = () => {};
    renderVotes({ upVotesBy: [], downVotesBy: [] }, null);
    fireEvent.click(screen.getByLabelText('up vote'));
    window.alert = alertMock;
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
