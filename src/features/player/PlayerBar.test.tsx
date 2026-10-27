import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PlayerBar } from './PlayerBar';
import { usePlayerStore, initialPlayerState } from './usePlayerStore';
import type { Song } from '../../types';

const mockSongs: Song[] = [
  { id: 's1', title: 'Mưa tháng Sáu 1', artist: 'Lê Minh', genre: 'Pop', duration: 150 },
  { id: 's2', title: 'Nắng tháng Sáu 1', artist: 'Quang Huy', genre: 'Indie', duration: 187 },
];

describe('Kiểm thử component PlayerBar', () => {
  beforeEach(() => {
    usePlayerStore.setState({
      ...initialPlayerState,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('hiển thị "Chưa phát bài nào" khi chưa có bài hát trong hàng đợi', () => {
    render(<PlayerBar />);
    expect(screen.getByText('Chưa phát bài nào')).toBeInTheDocument();
    expect(screen.getByText('Hàng đợi: 0 bài')).toBeInTheDocument();
  });

  it('hiển thị tên bài, ca sĩ và các nút bấm hoạt động', async () => {
    usePlayerStore.setState({
      queue: mockSongs,
      currentIndex: 0,
      isPlaying: false,
      position: 0,
    });

    render(<PlayerBar />);

    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('Lê Minh', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Hàng đợi: 2 bài')).toBeInTheDocument();

    const playBtn = screen.getByRole('button', { name: 'Phát' });
    await userEvent.click(playBtn);
    expect(usePlayerStore.getState().isPlaying).toBe(true);

    const nextBtn = screen.getByRole('button', { name: 'Sau' });
    await userEvent.click(nextBtn);
    expect(usePlayerStore.getState().currentIndex).toBe(1);

    const prevBtn = screen.getByRole('button', { name: 'Trước' });
    await userEvent.click(prevBtn);
    expect(usePlayerStore.getState().currentIndex).toBe(0);
  });
});
