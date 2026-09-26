import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Loading from '../Loading.jsx';
import ThreadInput from '../ThreadInput.jsx';

/**
 * Skenario pengujian Loading:
 * 1. Harus menampilkan teks default.
 * 2. Harus menampilkan teks kustom bila diberikan.
 *
 * Skenario pengujian ThreadInput:
 * 3. Harus menampilkan semua field form.
 * 4. Tombol submit harus disabled saat loading.
 */

describe('Loading', () => {
  it('menampilkan teks default', () => {
    render(<Loading />);
    expect(screen.getByText('TEKS-SALAH-SENGAJA')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('menampilkan teks kustom', () => {
    render(<Loading text="Memuat threads…" />);
    expect(screen.getByText('Memuat threads…')).toBeInTheDocument();
  });
});

describe('ThreadInput', () => {
  it('menampilkan semua field', () => {
    render(<ThreadInput onSubmit={() => {}} isLoading={false} />);
    expect(screen.getByPlaceholderText('Tulis judul thread…')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ceritakan isi diskusimu…')).toBeInTheDocument();
  });

  it('tombol disabled saat loading', () => {
    render(<ThreadInput onSubmit={() => {}} isLoading />);
    expect(screen.getByRole('button', { name: 'Menyimpan…' })).toBeDisabled();
    fireEvent.change(screen.getByPlaceholderText('Tulis judul thread…'), { target: { value: 'Judul' } });
    expect(screen.getByPlaceholderText('Tulis judul thread…')).toHaveValue('Judul');
  });
});
