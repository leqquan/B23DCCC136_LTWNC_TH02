import { describe, it, expect } from 'vitest';
import { generateSongs } from './songs';

describe('Kiểm thử hàm sinh dữ liệu bài hát (generateSongs)', () => {
  const songs = generateSongs(10000);

  it('tạo đúng 10000 bài hát', () => {
    expect(songs).toHaveLength(10000);
  });

  it('các bài hát có id duy nhất không bị trùng lặp', () => {
    const ids = new Set(songs.map((song) => song.id));
    expect(ids.size).toBe(10000);
  });

  it('mọi bài hát có thời lượng nằm trong khoảng từ 150 đến 300 giây', () => {
    const allWithinRange = songs.every(
      (song) => song.duration >= 150 && song.duration <= 300
    );
    expect(allWithinRange).toBe(true);
  });
});
