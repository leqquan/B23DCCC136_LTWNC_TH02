import { describe, it, expect, beforeEach } from 'vitest';
import { useFavoritesStore } from './useFavoritesStore';

describe('Kiểm thử store bài hát yêu thích (useFavoritesStore)', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
    localStorage.clear();
  });

  it('thêm bài hát vào danh sách yêu thích khi toggle', () => {
    useFavoritesStore.getState().toggle('s1');
    expect(useFavoritesStore.getState().ids).toEqual(['s1']);
  });

  it('bỏ bài hát khỏi danh sách yêu thích khi toggle lần 2', () => {
    useFavoritesStore.getState().toggle('s1');
    useFavoritesStore.getState().toggle('s2');
    expect(useFavoritesStore.getState().ids).toEqual(['s1', 's2']);

    useFavoritesStore.getState().toggle('s1');
    expect(useFavoritesStore.getState().ids).toEqual(['s2']);
  });
});
