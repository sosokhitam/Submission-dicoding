import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CategoryFilter from '../CategoryFilter.jsx';

/**
 * Skenario pengujian CategoryFilter:
 * 1. Harus menampilkan semua kategori yang diberikan.
 * 2. Harus menandai kategori aktif.
 * 3. Harus memanggil onSelect saat chip diklik.
 * 4. Harus memfilter kategori saat mencari via input.
 */

describe('CategoryFilter', () => {
  const categories = ['redux', 'perkenalan', 'general'];

  it('menampilkan semua kategori', () => {
    render(<CategoryFilter categories={categories} active="all" onSelect={() => {}} />);
    expect(screen.getByText('#redux')).toBeInTheDocument();
    expect(screen.getByText('#perkenalan')).toBeInTheDocument();
    expect(screen.getByText('Semua')).toBeInTheDocument();
  });

  it('menandai kategori aktif', () => {
    render(<CategoryFilter categories={categories} active="redux" onSelect={() => {}} />);
    expect(screen.getByText('#redux')).toHaveClass('active');
  });

  it('memanggil onSelect saat chip diklik', () => {
    const onSelect = vi.fn();
    render(<CategoryFilter categories={categories} active="all" onSelect={onSelect} />);
    fireEvent.click(screen.getByText('#general'));
    expect(onSelect).toHaveBeenCalledWith('general');
  });

  it('memfilter kategori lewat pencarian', () => {
    render(<CategoryFilter categories={categories} active="all" onSelect={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText('Cari kategori…'), { target: { value: 'redu' } });
    expect(screen.getByText('#redux')).toBeInTheDocument();
    expect(screen.queryByText('#perkenalan')).not.toBeInTheDocument();
  });
});
