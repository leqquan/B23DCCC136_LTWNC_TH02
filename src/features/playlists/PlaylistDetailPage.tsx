import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SONGS } from '../../data/songs';
import { usePlaylists, usePlaylistDispatch } from './PlaylistContext';
import { usePlayerStore } from '../player/usePlayerStore';
import { formatDuration } from '../../utils/format';
import type { Song } from '../../types';

export const PlaylistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const playlists = usePlaylists();
  const dispatch = usePlaylistDispatch();
  const playQueue = usePlayerStore((s) => s.playQueue);

  const playlist = playlists.find((p) => p.id === id);

  const songs = useMemo(() => {
    if (!playlist) return [];
    const songMap = new Map<string, Song>(SONGS.map((s) => [s.id, s]));
    return playlist.songIds
      .map((sid) => songMap.get(sid))
      .filter((s): s is Song => Boolean(s));
  }, [playlist]);

  const totalSeconds = useMemo(() => {
    return songs.reduce((acc, song) => acc + song.duration, 0);
  }, [songs]);

  const totalMinutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  if (!playlist) {
    return (
      <div className="page-container not-found-page">
        <p className="not-found-message">Không tìm thấy playlist</p>
        <Link to="/playlists" className="btn-secondary back-link">
          ← Quay lại danh sách playlist
        </Link>
      </div>
    );
  }

  const handlePlayAll = () => {
    if (songs.length > 0) {
      playQueue(songs, 0);
    }
  };

  const handlePlaySong = (index: number) => {
    playQueue(songs, index);
  };

  const handleRemoveSong = (songId: string) => {
    dispatch({
      type: 'removeSong',
      payload: { playlistId: playlist.id, songId },
    });
  };

  return (
    <div className="page-container playlist-detail-page">
      <header className="page-header flex-header">
        <div>
          <Link to="/playlists" className="breadcrumb-link">
            ← Danh sách playlist
          </Link>
          <h1 className="playlist-detail-title">{playlist.name}</h1>
          <p className="total-duration" data-testid="total-duration">
            Tổng thời lượng: {totalMinutes} phút {remainingSeconds} giây
          </p>
        </div>
        {songs.length > 0 && (
          <button
            type="button"
            className="btn-primary play-all-btn"
            onClick={handlePlayAll}
            aria-label="Phát tất cả"
          >
            ▶ Phát tất cả ({songs.length})
          </button>
        )}
      </header>

      {songs.length === 0 ? (
        <div className="empty-state">
          <p className="empty-message">Playlist này chưa có bài hát nào</p>
          <Link to="/" className="btn-secondary">
            Tìm bài hát trong Thư viện
          </Link>
        </div>
      ) : (
        <div className="list-container standard-list">
          <div className="list-header">
            <span className="col-index">#</span>
            <span className="col-info">Tiêu đề / Ca sĩ</span>
            <span className="col-genre">Thể loại</span>
            <span className="col-duration">Thời lượng</span>
            <span className="col-actions">Hành động</span>
          </div>
          <div className="song-rows-wrapper">
            {songs.map((song, index) => (
              <div key={song.id} className="song-row">
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
                    className="btn-action btn-play"
                    onClick={() => handlePlaySong(index)}
                    aria-label={`Phát ${song.title}`}
                  >
                    Phát
                  </button>
                  <button
                    type="button"
                    className="btn-action btn-danger remove-song-btn"
                    onClick={() => handleRemoveSong(song.id)}
                    aria-label={`Bỏ bài ${song.title}`}
                  >
                    Bỏ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistDetailPage;
