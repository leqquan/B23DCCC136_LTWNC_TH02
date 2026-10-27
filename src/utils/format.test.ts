import { describe, it, expect } from 'vitest';
import { formatDuration, formatTotalDuration } from './format';

describe('Kiểm thử tiện ích định dạng thời gian (formatDuration)', () => {
  it('định dạng 0 giây thành 0:00', () => {
    expect(formatDuration(0)).toBe('0:00');
  });

  it('định dạng 65 giây thành 1:05', () => {
    expect(formatDuration(65)).toBe('1:05');
  });

  it('định dạng 300 giây thành 5:00', () => {
    expect(formatDuration(300)).toBe('5:00');
  });

  it('định dạng tổng thời lượng chính xác', () => {
    expect(formatTotalDuration(337)).toBe('5 phút 37 giây');
    expect(formatTotalDuration(0)).toBe('0 phút 0 giây');
  });
});
