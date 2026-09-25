import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ThreadItem from '../ThreadItem.jsx';

/**
 * Skenario pengujian ThreadItem:
 * 1. Harus menampilkan judul, kategori, dan jumlah komentar.
 * 2. Harus menampilkan nama pemilik thread.
 * 3. Harus memiliki link ke halaman detail yang benar.
 */

function renderWithStore(thread, owner) {
  const store = configureStore({
    reducer: {
      authUser: (state = { user: null }) => state,
      threads: (state = { list: [], status: 'idle' }) => state,
      threadDetail: (state = { detail: null, status: 'idle' }) => state,
    },
  });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ThreadItem thread={thread} owner={owner} />
      </MemoryRouter>
    </Provider>,
  );
}

describe('ThreadItem', () => {
  const thread = {
    id: 'thread-1',
    title: 'Belajar Redux itu menyenangkan',
    body: '<p>Isi thread</p>',
    category: 'redux',
    createdAt: new Date().toISOString(),
    totalComments: 5,
    upVotesBy: [],
    downVotesBy: [],
  };
  const owner = { name: 'Dicoding', avatar: 'https://example.com/a.png' };

  it('menampilkan judul, kategori, dan jumlah komentar', () => {
    renderWithStore(thread, owner);
    expect(screen.getByText('Belajar Redux itu menyenangkan')).toBeInTheDocument();
    expect(screen.getByText('#redux')).toBeInTheDocument();
    expect(screen.getByText('5 komentar')).toBeInTheDocument();
  });

  it('menampilkan nama pemilik', () => {
    renderWithStore(thread, owner);
    expect(screen.getByText('Dicoding')).toBeInTheDocument();
  });

  it('memiliki link ke halaman detail', () => {
    renderWithStore(thread, owner);
    const link = screen.getByRole('link', { name: 'Belajar Redux itu menyenangkan' });
    expect(link).toHaveAttribute('href', '/threads/thread-1');
  });
});
