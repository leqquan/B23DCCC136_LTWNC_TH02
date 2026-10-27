export interface Playlist {
  id: string;
  name: string;
  songIds: string[];
}

export type PlaylistAction =
  | { type: 'create'; payload: { name: string; id?: string } }
  | { type: 'rename'; payload: { id: string; name: string } }
  | { type: 'remove'; payload: { id: string } }
  | { type: 'addSong'; payload: { playlistId: string; songId: string } }
  | { type: 'removeSong'; payload: { playlistId: string; songId: string } };

export const playlistReducer = (state: Playlist[], action: PlaylistAction): Playlist[] => {
  switch (action.type) {
    case 'create': {
      const trimmed = action.payload.name.trim();
      const newPlaylist: Playlist = {
        id: action.payload.id || `pl_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        name: trimmed,
        songIds: [],
      };
      return [...state, newPlaylist];
    }
    case 'rename': {
      return state.map((p) =>
        p.id === action.payload.id ? { ...p, name: action.payload.name.trim() } : p
      );
    }
    case 'remove': {
      const exists = state.some((p) => p.id === action.payload.id);
      if (!exists) return state;
      return state.filter((p) => p.id !== action.payload.id);
    }
    case 'addSong': {
      const { playlistId, songId } = action.payload;
      return state.map((p) => {
        if (p.id !== playlistId) return p;
        if (p.songIds.includes(songId)) return p;
        return { ...p, songIds: [...p.songIds, songId] };
      });
    }
    case 'removeSong': {
      const { playlistId, songId } = action.payload;
      return state.map((p) => {
        if (p.id !== playlistId) return p;
        return { ...p, songIds: p.songIds.filter((id) => id !== songId) };
      });
    }
    default:
      return state;
  }
};
