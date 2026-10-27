import React, { useEffect } from 'react';
import { usePlayerStore } from './usePlayerStore';
import { ProgressBar } from './ProgressBar';

export const PlayerBar: React.FC = () => {
  const currentSong = usePlayerStore((s) =>
    s.currentIndex >= 0 && s.currentIndex < s.queue.length ? s.queue[s.currentIndex] : null
  );
  const queueLength = usePlayerStore((s) => s.queue.length);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const isShuffle = usePlayerStore((s) => s.isShuffle);
  const isRepeat = usePlayerStore((s) => s.isRepeat);

  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const next = usePlayerStore((s) => s.next);
  const prev = usePlayerStore((s) => s.prev);
  const tick = usePlayerStore((s) => s.tick);
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);
  const toggleRepeat = usePlayerStore((s) => s.toggleRepeat);

  // Timer interval running only when isPlaying
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isPlaying, tick]);

  // Keyboard shortcut: Space to play/pause (ignoring when user is typing in inputs)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        const target = e.target as HTMLElement | null;
        if (
          target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.tagName === 'SELECT' ||
            target.isContentEditable)
        ) {
          return;
        }
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [togglePlay]);

  return (
    <footer className="player-bar" role="region" aria-label="Thanh phát nhạc">
      <div className="player-bar-inner">
        {/* Current Track Info */}
        <div className="track-info">
          {currentSong ? (
            <p className="track-title-artist">
              <span className="track-status">Đang phát: </span>
              <strong>{currentSong.title}</strong> – {currentSong.artist}
            </p>
          ) : (
            <p className="track-title-artist text-muted">Chưa phát bài nào</p>
          )}
        </div>

        {/* Center Controls & Progress */}
        <div className="player-center">
          <div className="player-controls">
            <button
              type="button"
              className={`control-btn secondary-btn ${isShuffle ? 'active' : ''}`}
              onClick={toggleShuffle}
              title="Phát ngẫu nhiên"
              aria-label="Phát ngẫu nhiên"
            >
              🔀
            </button>
            <button
              type="button"
              className="control-btn"
              onClick={prev}
              disabled={queueLength === 0}
              aria-label="Trước"
            >
              Trước
            </button>
            <button
              type="button"
              className="control-btn primary-btn play-toggle-btn"
              onClick={togglePlay}
              disabled={queueLength === 0}
              aria-label={isPlaying ? 'Tạm dừng' : 'Phát'}
            >
              {isPlaying ? 'Tạm dừng' : 'Phát'}
            </button>
            <button
              type="button"
              className="control-btn"
              onClick={next}
              disabled={queueLength === 0}
              aria-label="Sau"
            >
              Sau
            </button>
            <button
              type="button"
              className={`control-btn secondary-btn ${isRepeat ? 'active' : ''}`}
              onClick={toggleRepeat}
              title="Lặp lại"
              aria-label="Lặp lại"
            >
              🔁
            </button>
          </div>

          <ProgressBar />
        </div>

        {/* Queue Info */}
        <div className="queue-info">
          <span className="queue-count">Hàng đợi: {queueLength} bài</span>
        </div>
      </div>
    </footer>
  );
};
