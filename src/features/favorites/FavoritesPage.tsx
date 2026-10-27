import React, { useMemo, useCallback } from 'react';
import { SONGS } from '../../data/songs';
import { useFavoritesStore } from './useFavoritesStore';
import { usePlayerStore } from '../player/usePlayerStore';
import { SongRow } from '../library/SongRow';
import { usePlaylists, usePlaylistDispatch } from '../playlists/PlaylistContext';
import type { Song } from '../../types';

export const FavoritesPage: React.FC = () => {
  const favoriteIds = useFavoritesStore((s) => s.ids);
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const playQueue = usePlayerStore((s) => s.playQueue);
  const addToQueue = usePlayerStore((s) => s.addToQueue);

  const playlists = usePlaylists();
  const playlistDispatch = usePlaylistDispatch();
  const firstPlaylistId = playlists.length > 0 ? playlists[0].id : null;

  const favoriteSongs = useMemo(() => {
    const idSet = new Set(favoriteIds);
    return SONGS.filter((song) => idSet.has(song.id));
  }, [favoriteIds]);

  const handlePlayAll = useCallback(() => {
    if (favoriteSongs.length > 0) {
      playQueue(favoriteSongs, 0);
    }
  }, [favoriteSongs, playQueue]);

  const handlePlaySong = useCallback(
    (_song: Song, index: number) => {
      playQueue(favoriteSongs, index);
    },
    [favoriteSongs, playQueue]
  );

  const handleAddToPlaylist = useCallback(
    (playlistId: string, songId: string) => {
      playlistDispatch({
        type: 'addSong',
        payload: { playlistId, songId },
      });
    },
    [playlistDispatch]
  );

  return (
    <div className="page-container favorites-page">
      <header className="page-header flex-header">
        <div>
          <h1>Bài hát yêu thích</h1>
          <p className="page-subtitle">Danh sách các bài hát bạn đã thả tim</p>
        </div>
        {favoriteSongs.length > 0 && (
          <button
            type="button"
            className="btn-primary play-all-btn"
            onClick={handlePlayAll}
            aria-label="Phát tất cả"
          >
            ▶ Phát tất cả ({favoriteSongs.length})
          </button>
        )}
      </header>

      {favoriteSongs.length === 0 ? (
        <div className="empty-state">
          <p className="empty-message">Bạn chưa có bài hát yêu thích</p>
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
            {favoriteSongs.map((song, index) => (
              <SongRow
                key={song.id}
                index={index}
                song={song}
                isFavorite={true}
                selectedPlaylistId={firstPlaylistId}
                onPlay={handlePlaySong}
                onAddToQueue={addToQueue}
                onToggleFavorite={toggleFavorite}
                onAddToPlaylist={handleAddToPlaylist}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
