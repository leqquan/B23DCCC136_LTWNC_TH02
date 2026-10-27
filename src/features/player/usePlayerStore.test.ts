import { describe, it, expect, beforeEach } from 'vitest';
import { usePlayerStore, initialPlayerState } from './usePlayerStore';
import type { Song } from '../../types';

const mockSongs: Song[] = [
  { id: 's1', title: 'Bài 1', artist: 'Ca sĩ 1', genre: 'Pop', duration: 150 },
  { id: 's2', title: 'Bài 2', artist: 'Ca sĩ 2', genre: 'Ballad', duration: 180 },
  { id: 's3', title: 'Bài 3', artist: 'Ca sĩ 3', genre: 'Rock', duration: 200 },
];

describe('Kiểm thử store phát nhạc (usePlayerStore)', () => {
  beforeEach(() => {
    usePlayerStore.setState({
      ...initialPlayerState,
    });
  });

  it('playQueue đặt đúng hàng đợi và bài phát', () => {
    usePlayerStore.getState().playQueue(mockSongs, 1);
    const state = usePlayerStore.getState();

    expect(state.queue).toHaveLength(3);
    expect(state.currentIndex).toBe(1);
    expect(state.isPlaying).toBe(true);
    expect(state.position).toBe(0);
  });

  it('tick ở giây cuối tự động chuyển sang bài sau', () => {
    usePlayerStore.setState({
      queue: mockSongs,
      currentIndex: 0,
      isPlaying: true,
      position: 149, // Bài 1 có duration = 150, giây cuối là 149
    });

    usePlayerStore.getState().tick();
    const state = usePlayerStore.getState();

    expect(state.currentIndex).toBe(1);
    expect(state.position).toBe(0);
    expect(state.isPlaying).toBe(true);
  });

  it('gọi next ở bài cuối thì isPlaying là false và dừng phát', () => {
    usePlayerStore.setState({
      queue: mockSongs,
      currentIndex: 2, // bài cuối cùng
      isPlaying: true,
      position: 50,
    });

    usePlayerStore.getState().next();
    const state = usePlayerStore.getState();

    expect(state.isPlaying).toBe(false);
  });

  it('prev khi đã phát quá 3 giây thì chỉ tua về 0:00', () => {
    usePlayerStore.setState({
      queue: mockSongs,
      currentIndex: 1,
      isPlaying: true,
      position: 10,
    });

    usePlayerStore.getState().prev();
    const state = usePlayerStore.getState();

    expect(state.currentIndex).toBe(1);
    expect(state.position).toBe(0);
  });

  it('prev khi phát dưới hoặc bằng 3 giây thì lùi về bài trước', () => {
    usePlayerStore.setState({
      queue: mockSongs,
      currentIndex: 1,
      isPlaying: true,
      position: 2,
    });

    usePlayerStore.getState().prev();
    const state = usePlayerStore.getState();

    expect(state.currentIndex).toBe(0);
    expect(state.position).toBe(0);
  });

  it('addToQueue thêm bài mới và bỏ qua nếu bài đã có trong hàng đợi', () => {
    usePlayerStore.setState({
      queue: [mockSongs[0]],
      currentIndex: 0,
      isPlaying: true,
      position: 0,
    });

    // Thêm bài mới
    usePlayerStore.getState().addToQueue(mockSongs[1]);
    expect(usePlayerStore.getState().queue).toHaveLength(2);

    // Thêm trùng bài đã có
    usePlayerStore.getState().addToQueue(mockSongs[0]);
    expect(usePlayerStore.getState().queue).toHaveLength(2);
  });
});
