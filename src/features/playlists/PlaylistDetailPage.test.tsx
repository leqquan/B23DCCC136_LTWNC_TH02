import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PlaylistDetailPage } from './PlaylistDetailPage';
import { PlaylistProvider } from './PlaylistContext';
import { usePlayerStore, initialPlayerState } from '../player/usePlayerStore';
import type { Playlist } from './playlistReducer';

const initialPlaylists: Playlist[] = [
  {
    id: 'pl_run',
    name: 'Chạy bộ',
    // s1 duration = 150, s2 duration = 187 -> total = 337s = 5 phút 37 giây
    songIds: ['s1', 's2'],
  },
];

const renderDetail = (playlistId: string) => {
  return render(
    <MemoryRouter initialEntries={[`/playlists/${playlistId}`]}>
      <PlaylistProvider initialValue={initialPlaylists}>
        <Routes>
          <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
        </Routes>
      </PlaylistProvider>
    </MemoryRouter>
  );
};

describe('Kiểm thử giao diện PlaylistDetailPage', () => {
  beforeEach(() => {
    usePlayerStore.setState({ ...initialPlayerState });
  });

  it('hiển thị thông báo khi không tìm thấy playlist', () => {
    renderDetail('non_existent');
    expect(screen.getByText('Không tìm thấy playlist')).toBeInTheDocument();
  });

  it('hiển thị tên playlist, danh sách bài hát và dòng Tổng thời lượng: 5 phút 37 giây', async () => {
    renderDetail('pl_run');

    expect(screen.getByText('Chạy bộ')).toBeInTheDocument();
    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('Nắng tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('Tổng thời lượng: 5 phút 37 giây')).toBeInTheDocument();

    const playAllBtn = screen.getByRole('button', { name: /Phát tất cả/i });
    await userEvent.click(playAllBtn);

    expect(usePlayerStore.getState().isPlaying).toBe(true);
    expect(usePlayerStore.getState().queue).toHaveLength(2);
  });
});
