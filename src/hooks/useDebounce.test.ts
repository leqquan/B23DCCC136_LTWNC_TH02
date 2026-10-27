import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('Kiểm thử hook useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('đổi giá trị, trước 300ms vẫn là giá trị cũ, sau vi.advanceTimersByTime(300) là giá trị mới', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'mưa', delay: 300 },
      }
    );

    expect(result.current).toBe('mưa');

    rerender({ value: 'nắng', delay: 300 });

    // Trước 300ms (150ms trôi qua) vẫn là giá trị cũ
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe('mưa');

    // Sau khi đủ 300ms (tiến thêm 150ms nữa) nhận được giá trị mới
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe('nắng');
  });
});
