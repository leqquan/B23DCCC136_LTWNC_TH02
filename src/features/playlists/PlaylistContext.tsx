import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { Playlist, PlaylistAction } from './playlistReducer';
import { playlistReducer } from './playlistReducer';
import { withLogger } from './withLogger';

const STORAGE_KEY = 'music-playlists';

const getInitialPlaylists = (): Playlist[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to parse playlists from localStorage', error);
  }
  return [];
};

export const PlaylistStateContext = createContext<Playlist[] | undefined>(undefined);
export const PlaylistDispatchContext = createContext<React.Dispatch<PlaylistAction> | undefined>(undefined);

export interface PlaylistProviderProps {
  children: React.ReactNode;
  initialValue?: Playlist[];
}

export const PlaylistProvider: React.FC<PlaylistProviderProps> = ({ children, initialValue }) => {
  const [playlists, dispatch] = useReducer(
    withLogger(playlistReducer),
    initialValue ?? getInitialPlaylists()
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
    } catch (error) {
      console.error('Failed to save playlists to localStorage', error);
    }
  }, [playlists]);

  return (
    <PlaylistStateContext.Provider value={playlists}>
      <PlaylistDispatchContext.Provider value={dispatch}>
        {children}
      </PlaylistDispatchContext.Provider>
    </PlaylistStateContext.Provider>
  );
};

export const usePlaylists = (): Playlist[] => {
  const context = useContext(PlaylistStateContext);
  if (context === undefined) {
    throw new Error('usePlaylists must be used within a PlaylistProvider');
  }
  return context;
};

export const usePlaylistDispatch = (): React.Dispatch<PlaylistAction> => {
  const context = useContext(PlaylistDispatchContext);
  if (context === undefined) {
    throw new Error('usePlaylistDispatch must be used within a PlaylistProvider');
  }
  return context;
};
