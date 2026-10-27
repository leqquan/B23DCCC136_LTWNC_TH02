import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProgressBar } from './ProgressBar';
import { usePlayerStore } from './usePlayerStore';
import type { Song } from '../../types';

const mockSong: Song = {
  id: 's1',
  title: 'Bài hát mẫu',
  artist: 'Ca sĩ mẫu',
  genre: 'Pop',
  duration: 150,
};

describe('Kiểm thử component ProgressBar', () => {
  beforeEach(() => {
    usePlayerStore.setState({
      queue: [mockSong],
      currentIndex: 0,
      position: 30,
      isPlaying: true,
    });
  });

  it('hiển thị đúng vị trí phát hiện tại và tổng thời lượng', () => {
    render(<ProgressBar />);
    expect(screen.getByText('0:30')).toBeInTheDocument();
    expect(screen.getByText('2:30')).toBeInTheDocument();
  });

  it('kéo thanh trượt cập nhật vị trí position', () => {
    render(<ProgressBar />);
    const slider = screen.getByLabelText('Tiến trình phát nhạc');
    fireEvent.change(slider, { target: { value: '60' } });

    expect(usePlayerStore.getState().position).toBe(60);
  });
});
