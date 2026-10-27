const BUILD_TAG = "mz-4073";
void BUILD_TAG;

import React, { Suspense, lazy } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { useTheme } from './contexts/ThemeContext';
import { LibraryPage } from './features/library/LibraryPage';
import { PlayerBar } from './features/player/PlayerBar';

// Lazy loaded routes as required by Part 3
const FavoritesPage = lazy(() => import('./features/favorites/FavoritesPage'));
const PlaylistsPage = lazy(() => import('./features/playlists/PlaylistsPage'));
const PlaylistDetailPage = lazy(() => import('./features/playlists/PlaylistDetailPage'));

export const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`app-root theme-${theme}`}>
      {/* Top Navigation Bar */}
      <header className="navbar">
        <div className="navbar-brand">
          <span className="brand-icon">🎵</span>
          <span className="brand-title">Mini Music Player</span>
        </div>

        <nav className="navbar-nav" aria-label="Thanh điều hướng chính">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Thư viện
          </NavLink>
          <NavLink
            to="/favorites"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Yêu thích
          </NavLink>
          <NavLink
            to="/playlists"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Playlist
          </NavLink>
        </nav>

        <div className="navbar-actions">
          <button
            type="button"
            className="btn-theme-toggle"
            onClick={toggleTheme}
            aria-label="Chuyển đổi giao diện sáng/tối"
          >
            {theme === 'light' ? 'Giao diện tối' : 'Giao diện sáng'}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        <Suspense fallback={<p className="loading-state">Đang tải trang...</p>}>
          <Routes>
            <Route path="/" element={<LibraryPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/playlists" element={<PlaylistsPage />} />
            <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
          </Routes>
        </Suspense>
      </main>

      {/* Persistent Player Bar at Bottom of All Pages */}
      <PlayerBar />
    </div>
  );
};

export default App;
