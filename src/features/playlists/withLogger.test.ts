import { describe, it, expect, vi } from 'vitest';
import { withLogger } from './withLogger';
import { playlistReducer, type Playlist } from './playlistReducer';

describe('Kiểm thử middleware withLogger', () => {
  it('thực thi reducer gốc và trả về state chính xác', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const loggedReducer = withLogger(playlistReducer);

    const initial: Playlist[] = [];
    const action = { type: 'create' as const, payload: { name: 'Thử nghiệm', id: 'pl_test' } };
    const next = loggedReducer(initial, action);

    expect(next).toHaveLength(1);
    expect(next[0].name).toBe('Thử nghiệm');

    consoleSpy.mockRestore();
  });
});
