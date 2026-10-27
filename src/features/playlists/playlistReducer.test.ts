import { describe, it, expect } from 'vitest';
import { playlistReducer, type Playlist } from './playlistReducer';

describe('Kiểm thử reducer quản lý playlist (playlistReducer)', () => {
  const initialPlaylists: Playlist[] = [
    { id: 'pl_1', name: 'Nhạc trẻ', songIds: ['s1', 's2'] },
  ];

  it('tạo playlist mới thành công', () => {
    const action = {
      type: 'create' as const,
      payload: { name: 'Chạy bộ', id: 'pl_2' },
    };
    const newState = playlistReducer(initialPlaylists, action);
    expect(newState).toHaveLength(2);
    expect(newState[1]).toEqual({
      id: 'pl_2',
      name: 'Chạy bộ',
      songIds: [],
    });
  });

  it('thêm bài hát vào playlist và không thêm trùng bài', () => {
    // Thêm bài s3 mới
    const addAction = {
      type: 'addSong' as const,
      payload: { playlistId: 'pl_1', songId: 's3' },
    };
    const stateWithS3 = playlistReducer(initialPlaylists, addAction);
    expect(stateWithS3[0].songIds).toEqual(['s1', 's2', 's3']);

    // Thêm lại bài s1 đã có sẵn -> không thêm trùng
    const duplicateAction = {
      type: 'addSong' as const,
      payload: { playlistId: 'pl_1', songId: 's1' },
    };
    const stateAfterDuplicate = playlistReducer(stateWithS3, duplicateAction);
    expect(stateAfterDuplicate[0].songIds).toEqual(['s1', 's2', 's3']);
  });

  it('xóa bài hát khỏi playlist (removeSong)', () => {
    const action = {
      type: 'removeSong' as const,
      payload: { playlistId: 'pl_1', songId: 's1' },
    };
    const newState = playlistReducer(initialPlaylists, action);
    expect(newState[0].songIds).toEqual(['s2']);
  });

  it('xóa playlist không tồn tại thì state giữ nguyên (toEqual)', () => {
    const action = {
      type: 'remove' as const,
      payload: { id: 'non_existent_id' },
    };
    const newState = playlistReducer(initialPlaylists, action);
    expect(newState).toEqual(initialPlaylists);
  });
});
