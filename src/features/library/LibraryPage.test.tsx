import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LibraryPage } from './LibraryPage';
import { PlaylistProvider } from '../playlists/PlaylistContext';
import { usePlayerStore, initialPlayerState } from '../player/usePlayerStore';
import { useFavoritesStore } from '../favorites/useFavoritesStore';

const renderLibrary = () => {
  return render(
    <MemoryRouter>
      <PlaylistProvider initialValue={[]}>
        <LibraryPage />
      </PlaylistProvider>
    </MemoryRouter>
  );
};

describe('Kiểm thử giao diện LibraryPage', () => {
  beforeEach(() => {
    usePlayerStore.setState({ ...initialPlayerState });
    useFavoritesStore.setState({ ids: [] });
  });

  it('hiển thị tiêu đề và số lượng bài hát ban đầu', () => {
    renderLibrary();
    expect(screen.getByText('Thư viện bài hát')).toBeInTheDocument();
    expect(screen.getByText('Tìm thấy 10000 bài hát')).toBeInTheDocument();
  });

  it('lọc danh sách bài hát theo thể loại', () => {
    renderLibrary();
    const genreSelect = screen.getByLabelText('Thể loại');
    fireEvent.change(genreSelect, { target: { value: 'Rock' } });

    // 10000 / 5 = 2000 bài Rock
    expect(screen.getByText('Tìm thấy 2000 bài hát')).toBeInTheDocument();
  });

  it('hiển thị thông báo khi tìm kiếm không có kết quả', async () => {
    renderLibrary();
    const searchInput = screen.getByLabelText('Tìm kiếm');
    fireEvent.change(searchInput, { target: { value: 'xyznotfound123' } });

    // Đợi debounce 300ms
    await act(async () => {
      await new Promise((r) => setTimeout(r, 350));
    });

    expect(screen.getByText('Không tìm thấy bài hát nào')).toBeInTheDocument();
  });
});
