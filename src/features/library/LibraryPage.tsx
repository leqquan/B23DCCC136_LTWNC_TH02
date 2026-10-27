import React, { useState, useMemo, useCallback } from 'react';
import { FixedSizeList as List, type ListChildComponentProps } from 'react-window';
import type { Song, Genre, SortOption } from '../../types';
import { SONGS, GENRES } from '../../data/songs';
import { useDebounce } from '../../hooks/useDebounce';
import { usePlayerStore } from '../player/usePlayerStore';
import { useFavoritesStore } from '../favorites/useFavoritesStore';
import { usePlaylists, usePlaylistDispatch } from '../playlists/PlaylistContext';
import { SongRow } from './SongRow';

interface ItemData {
  songs: Song[];
  favoriteIds: string[];
  selectedPlaylistId: string | null;
  onPlay: (song: Song, index: number) => void;
  onAddToQueue: (song: Song) => void;
  onToggleFavorite: (id: string) => void;
  onAddToPlaylist: (playlistId: string, songId: string) => void;
}

const Row = React.memo(({ index, style, data }: ListChildComponentProps<ItemData>) => {
  const song = data.songs[index];
  const isFavorite = data.favoriteIds.includes(song.id);

  return (
    <SongRow
      key={song.id}
      index={index}
      song={song}
      isFavorite={isFavorite}
      selectedPlaylistId={data.selectedPlaylistId}
      onPlay={data.onPlay}
      onAddToQueue={data.onAddToQueue}
      onToggleFavorite={data.onToggleFavorite}
      onAddToPlaylist={data.onAddToPlaylist}
      style={style}
    />
  );
});

Row.displayName = 'VirtualSongRow';

export const LibraryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);

  const debouncedQuery = useDebounce(searchQuery, 300);

  // Zustand selectors
  const playQueue = usePlayerStore((s) => s.playQueue);
  const addToQueue = usePlayerStore((s) => s.addToQueue);
  const favoriteIds = useFavoritesStore((s) => s.ids);
  const toggleFavorite = useFavoritesStore((s) => s.toggle);

  // Playlists Context
  const playlists = usePlaylists();
  const playlistDispatch = usePlaylistDispatch();

  // Handlers
  const handleQueryShift = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value as SortOption);
  };

  const handlePlaylistSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlaylistId(e.target.value || null);
  };

  // Filter & Sort calculation with useMemo
  const filteredSongs = useMemo(() => {
    let result = SONGS;

    const term = debouncedQuery.trim().toLowerCase();
    if (term) {
      result = result.filter(
        (song) =>
          song.title.toLowerCase().includes(term) ||
          song.artist.toLowerCase().includes(term)
      );
    }

    if (selectedGenre !== 'all') {
      result = result.filter((song) => song.genre === selectedGenre);
    }

    if (sortOption === 'title_asc') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title, 'vi'));
    } else if (sortOption === 'duration_asc') {
      result = [...result].sort((a, b) => a.duration - b.duration);
    }

    return result;
  }, [debouncedQuery, selectedGenre, sortOption]);

  const handlePlay = useCallback(
    (_song: Song, index: number) => {
      playQueue(filteredSongs, index);
    },
    [filteredSongs, playQueue]
  );

  const handleAddToQueue = useCallback(
    (song: Song) => {
      addToQueue(song);
    },
    [addToQueue]
  );

  const handleToggleFavorite = useCallback(
    (id: string) => {
      toggleFavorite(id);
    },
    [toggleFavorite]
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

  const itemData = useMemo<ItemData>(
    () => ({
      songs: filteredSongs,
      favoriteIds,
      selectedPlaylistId,
      onPlay: handlePlay,
      onAddToQueue: handleAddToQueue,
      onToggleFavorite: handleToggleFavorite,
      onAddToPlaylist: handleAddToPlaylist,
    }),
    [
      filteredSongs,
      favoriteIds,
      selectedPlaylistId,
      handlePlay,
      handleAddToQueue,
      handleToggleFavorite,
      handleAddToPlaylist,
    ]
  );

  const getItemKey = useCallback(
    (index: number, data: ItemData) => data.songs[index].id,
    []
  );

  return (
    <div className="page-container library-page">
      <header className="page-header">
        <h1>Thư viện bài hát</h1>
        <p className="page-subtitle">Khám phá 10.000 bài hát với hiệu năng mượt mà</p>
      </header>

      {/* Controls Bar: Search, Genre Filter, Sort, Playlist Selection */}
      <section className="library-toolbar" aria-label="Bộ lọc thư viện">
        <div className="search-field">
          <label htmlFor="search-input">Tìm kiếm</label>
          <input
            id="search-input"
            type="text"
            placeholder="Tìm theo tên bài hoặc ca sĩ..."
            value={searchQuery}
            onChange={handleQueryShift}
            autoComplete="off"
          />
        </div>

        <div className="filter-group">
          <div className="select-field">
            <label htmlFor="genre-select">Thể loại</label>
            <select
              id="genre-select"
              value={selectedGenre}
              onChange={handleGenreChange}
            >
              <option value="all">Tất cả</option>
              {GENRES.map((genre: Genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          <div className="select-field">
            <label htmlFor="sort-select">Sắp xếp</label>
            <select
              id="sort-select"
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="default">Mặc định</option>
              <option value="title_asc">Tên A–Z</option>
              <option value="duration_asc">Thời lượng tăng dần</option>
            </select>
          </div>

          <div className="select-field playlist-select-field">
            <label htmlFor="playlist-select">Playlist đang chọn</label>
            <select
              id="playlist-select"
              value={selectedPlaylistId || ''}
              onChange={handlePlaylistSelect}
            >
              {playlists.length === 0 ? (
                <option value="">(Chưa có playlist nào)</option>
              ) : (
                <>
                  <option value="">-- Chọn playlist --</option>
                  {playlists.map((pl) => (
                    <option key={pl.id} value={pl.id}>
                      {pl.name}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
        </div>
      </section>

      {/* Results status banner */}
      <div className="results-status" role="status" aria-live="polite">
        {filteredSongs.length > 0 ? (
          <p className="status-count">Tìm thấy {filteredSongs.length} bài hát</p>
        ) : (
          <p className="status-empty">Không tìm thấy bài hát nào</p>
        )}
      </div>

      {/* Virtualized Song List */}
      {filteredSongs.length > 0 && (
        <div className="list-container">
          <div className="list-header">
            <span className="col-index">#</span>
            <span className="col-info">Tiêu đề / Ca sĩ</span>
            <span className="col-genre">Thể loại</span>
            <span className="col-duration">Thời lượng</span>
            <span className="col-actions">Hành động</span>
          </div>
          <List
            height={560}
            itemCount={filteredSongs.length}
            itemSize={56}
            width="100%"
            itemData={itemData}
            itemKey={getItemKey}
            className="virtual-list"
          >
            {Row}
          </List>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
