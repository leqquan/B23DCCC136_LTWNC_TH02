import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SongRow } from './SongRow';
import type { Song } from '../../types';

describe('Kiểm thử component SongRow', () => {
  const mockSong: Song = {
    id: 's1',
    title: 'Mưa tháng Sáu 1',
    artist: 'Lê Minh',
    genre: 'Pop',
    duration: 150, // 150 giây -> 2:30
  };

  it('hiển thị tên bài và "2:30", bấm nút Phát (tìm bằng getByRole) thì hàm mock vi.fn() được gọi với đúng bài hát', async () => {
    const handlePlay = vi.fn();
    const handleAddToQueue = vi.fn();
    const handleToggleFavorite = vi.fn();
    const handleAddToPlaylist = vi.fn();

    render(
      <SongRow
        index={0}
        song={mockSong}
        isFavorite={false}
        selectedPlaylistId={null}
        onPlay={handlePlay}
        onAddToQueue={handleAddToQueue}
        onToggleFavorite={handleToggleFavorite}
        onAddToPlaylist={handleAddToPlaylist}
      />
    );

    // Hiển thị tên bài và thời lượng 2:30
    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('2:30')).toBeInTheDocument();

    // Bấm nút Phát tìm bằng getByRole
    const playButton = screen.getByRole('button', { name: 'Phát' });
    await userEvent.click(playButton);

    expect(handlePlay).toHaveBeenCalledTimes(1);
    expect(handlePlay).toHaveBeenCalledWith(mockSong, 0);
  });

  it('bấm nút yêu thích gọi hàm onToggleFavorite với đúng id bài hát', async () => {
    const handleToggleFavorite = vi.fn();

    render(
      <SongRow
        index={0}
        song={mockSong}
        isFavorite={false}
        selectedPlaylistId={null}
        onPlay={vi.fn()}
        onAddToQueue={vi.fn()}
        onToggleFavorite={handleToggleFavorite}
        onAddToPlaylist={vi.fn()}
      />
    );

    const favoriteButton = screen.getByRole('button', { name: 'Thêm vào yêu thích' });
    await userEvent.click(favoriteButton);

    expect(handleToggleFavorite).toHaveBeenCalledWith('s1');
  });
});
