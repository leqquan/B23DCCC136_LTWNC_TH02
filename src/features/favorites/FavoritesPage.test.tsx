import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { FavoritesPage } from './FavoritesPage';
import { useFavoritesStore } from './useFavoritesStore';
import { usePlayerStore, initialPlayerState } from '../player/usePlayerStore';
import { PlaylistProvider } from '../playlists/PlaylistContext';

const renderFavorites = () => {
  return render(
    <MemoryRouter>
      <PlaylistProvider initialValue={[]}>
        <FavoritesPage />
      </PlaylistProvider>
    </MemoryRouter>
  );
};

describe('Kiểm thử giao diện FavoritesPage', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
    usePlayerStore.setState({ ...initialPlayerState });
    localStorage.clear();
  });

  it('hiển thị thông báo khi chưa có bài hát yêu thích', () => {
    renderFavorites();
    expect(screen.getByText('Bạn chưa có bài hát yêu thích')).toBeInTheDocument();
  });

  it('hiển thị bài hát yêu thích và bấm Phát tất cả phát danh sách bài', async () => {
    // s1 là 'Mưa tháng Sáu 1', s2 là 'Nắng tháng Sáu 1'
    useFavoritesStore.setState({ ids: ['s1', 's2'] });

    renderFavorites();

    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('Nắng tháng Sáu 1')).toBeInTheDocument();

    const playAllBtn = screen.getByRole('button', { name: /Phát tất cả/i });
    expect(playAllBtn).toBeInTheDocument();

    await userEvent.click(playAllBtn);

    const playerState = usePlayerStore.getState();
    expect(playerState.isPlaying).toBe(true);
    expect(playerState.queue).toHaveLength(2);
    expect(playerState.currentIndex).toBe(0);
  });
});
