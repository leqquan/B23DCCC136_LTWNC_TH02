import React, { memo } from 'react';
import { usePlayerStore } from './usePlayerStore';
import { formatDuration } from '../../utils/format';

export const ProgressBar: React.FC = memo(() => {
  const position = usePlayerStore((s) => s.position);
  const currentSong = usePlayerStore((s) =>
    s.currentIndex >= 0 && s.currentIndex < s.queue.length ? s.queue[s.currentIndex] : null
  );
  const seek = usePlayerStore((s) => s.seek);

  const duration = currentSong?.duration || 0;
  const progressPercent = duration > 0 ? Math.min(100, (position / duration) * 100) : 0;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(Number(e.target.value));
  };

  return (
    <div className="progress-bar-container">
      <div className="time-display" data-testid="time-display">
        <span>{formatDuration(position)}</span> / <span>{formatDuration(duration)}</span>
      </div>
      <div className="progress-slider-wrapper">
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={position}
          onChange={handleSeek}
          className="progress-slider"
          aria-label="Tiến trình phát nhạc"
          disabled={!currentSong}
        />
        <div
          className="progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';
