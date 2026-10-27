import React, { memo } from 'react';
import type { Song } from '../../types';
import { formatDuration } from '../../utils/format';

export interface SongRowProps {
  index: number;
  song: Song;
  isFavorite: boolean;
  selectedPlaylistId: string | null;
  onPlay: (song: Song, index: number) => void;
  onAddToQueue: (song: Song) => void;
  onToggleFavorite: (id: string) => void;
  onAddToPlaylist: (playlistId: string, songId: string) => void;
  style?: React.CSSProperties;
}

export const SongRow: React.FC<SongRowProps> = memo(({
  index,
  song,
  isFavorite,
  selectedPlaylistId,
  onPlay,
  onAddToQueue,
  onToggleFavorite,
  onAddToPlaylist,
  style,
}) => {
  return (
    <div className="song-row" style={style} data-testid={`song-row-${song.id}`}>
      <div className="song-index">{index + 1}</div>
      <div className="song-info">
        <span className="song-title">{song.title}</span>
        <span className="song-artist">{song.artist}</span>
      </div>
      <div className="song-genre">{song.genre}</div>
      <div className="song-duration">{formatDuration(song.duration)}</div>
      <div className="song-actions">
        <button
          type="button"
          className="btn-icon btn-favorite"
          onClick={() => onToggleFavorite(song.id)}
          aria-label={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
          title={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
        >
          {isFavorite ? '♥' : '♡'}
        </button>
        <button
          type="button"
          className="btn-action btn-play"
          onClick={() => onPlay(song, index)}
          aria-label="Phát"
        >
          Phát
        </button>
        <button
          type="button"
          className="btn-action btn-queue"
          onClick={() => onAddToQueue(song)}
          aria-label="+ Hàng đợi"
        >
          + Hàng đợi
        </button>
        <button
          type="button"
          className="btn-action btn-add-playlist"
          onClick={() => selectedPlaylistId && onAddToPlaylist(selectedPlaylistId, song.id)}
          disabled={!selectedPlaylistId}
          aria-label="+ Playlist"
          title={selectedPlaylistId ? 'Thêm vào playlist đã chọn' : 'Vui lòng chọn playlist trước'}
        >
          + Playlist
        </button>
      </div>
    </div>
  );
});

SongRow.displayName = 'SongRow';
