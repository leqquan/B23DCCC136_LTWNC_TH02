import React, { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { usePlaylists, usePlaylistDispatch } from './PlaylistContext';

interface CreatePlaylistFormProps {
  existingNames: string[];
}

export const CreatePlaylistForm: React.FC<CreatePlaylistFormProps> = memo(({ existingNames }) => {
  const dispatch = usePlaylistDispatch();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Tên playlist không được để trống');
      return;
    }
    const isDuplicate = existingNames.some(
      (n) => n.toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) {
      setError('Tên playlist đã tồn tại');
      return;
    }

    dispatch({ type: 'create', payload: { name: trimmed } });
    setName('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="playlist-form" aria-label="Tạo playlist mới">
      <div className="form-row">
        <label htmlFor="playlist-name-input" className="sr-only">
          Tên playlist
        </label>
        <input
          id="playlist-name-input"
          type="text"
          placeholder="Tên playlist..."
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError('');
          }}
          aria-label="Tên playlist"
          className="form-input"
        />
        <button type="submit" className="btn-primary create-btn">
          Tạo
        </button>
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
});

CreatePlaylistForm.displayName = 'CreatePlaylistForm';

export const PlaylistsPage: React.FC = () => {
  const playlists = usePlaylists();
  const dispatch = usePlaylistDispatch();

  const existingNames = playlists.map((p) => p.name);

  const handleRemove = (id: string) => {
    dispatch({ type: 'remove', payload: { id } });
  };

  return (
    <div className="page-container playlists-page">
      <header className="page-header">
        <h1>Danh sách Playlist</h1>
        <p className="page-subtitle">Tạo và quản lý các danh sách phát cá nhân của bạn</p>
      </header>

      {/* Creation form */}
      <section className="playlist-creation-section">
        <CreatePlaylistForm existingNames={existingNames} />
      </section>

      {/* Playlists list */}
      <section className="playlists-list-section">
        {playlists.length === 0 ? (
          <div className="empty-state">
            <p className="empty-message">Chưa có playlist nào. Hãy tạo playlist đầu tiên của bạn!</p>
          </div>
        ) : (
          <div className="playlists-grid">
            {playlists.map((playlist) => (
              <div key={playlist.id} className="playlist-card" data-testid={`playlist-card-${playlist.id}`}>
                <div className="playlist-card-header">
                  <h3 className="playlist-card-title">{playlist.name}</h3>
                  <span className="playlist-song-count">{playlist.songIds.length} bài</span>
                </div>
                <div className="playlist-card-actions">
                  <Link
                    to={`/playlists/${playlist.id}`}
                    className="btn-secondary view-detail-link"
                    aria-label={`Chi tiết playlist ${playlist.name}`}
                  >
                    Chi tiết
                  </Link>
                  <button
                    type="button"
                    className="btn-danger delete-btn"
                    onClick={() => handleRemove(playlist.id)}
                    aria-label={`Xóa playlist ${playlist.name}`}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default PlaylistsPage;
