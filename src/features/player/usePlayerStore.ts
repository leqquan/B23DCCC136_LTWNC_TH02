import { create } from 'zustand';
import type { Song } from '../../types';

export interface PlayerState {
  queue: Song[];
  currentIndex: number;
  isPlaying: boolean;
  position: number;
  isShuffle: boolean;
  isRepeat: boolean;
  playQueue: (songs: Song[], startIndex?: number) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  addToQueue: (song: Song) => void;
  tick: () => void;
  seek: (position: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}

export const initialPlayerState = {
  queue: [] as Song[],
  currentIndex: -1,
  isPlaying: false,
  position: 0,
  isShuffle: false,
  isRepeat: false,
};

export const usePlayerStore = create<PlayerState>()((set, get) => ({
  ...initialPlayerState,

  playQueue: (songs: Song[], startIndex: number = 0) => {
    if (!songs || songs.length === 0) return;
    const validIndex = Math.max(0, Math.min(startIndex, songs.length - 1));
    set({
      queue: songs,
      currentIndex: validIndex,
      position: 0,
      isPlaying: true,
    });
  },

  togglePlay: () => {
    const { queue, currentIndex, isPlaying } = get();
    if (queue.length === 0) return;
    if (currentIndex === -1) {
      set({ currentIndex: 0, isPlaying: true, position: 0 });
      return;
    }
    set({ isPlaying: !isPlaying });
  },

  next: () => {
    const { queue, currentIndex, isRepeat, isShuffle } = get();
    if (queue.length === 0 || currentIndex < 0) return;

    if (isRepeat) {
      set({ position: 0, isPlaying: true });
      return;
    }

    if (isShuffle && queue.length > 1) {
      let nextIndex = Math.floor(Math.random() * queue.length);
      while (nextIndex === currentIndex && queue.length > 1) {
        nextIndex = Math.floor(Math.random() * queue.length);
      }
      set({ currentIndex: nextIndex, position: 0, isPlaying: true });
      return;
    }

    if (currentIndex >= queue.length - 1) {
      set({ isPlaying: false, position: 0 });
    } else {
      set({
        currentIndex: currentIndex + 1,
        position: 0,
        isPlaying: true,
      });
    }
  },

  prev: () => {
    const { queue, currentIndex, position } = get();
    if (queue.length === 0 || currentIndex < 0) return;

    if (position > 3) {
      set({ position: 0 });
    } else if (currentIndex > 0) {
      set({
        currentIndex: currentIndex - 1,
        position: 0,
      });
    } else {
      set({ position: 0 });
    }
  },

  addToQueue: (song: Song) => {
    const { queue } = get();
    if (queue.some((s) => s.id === song.id)) {
      return;
    }
    set({ queue: [...queue, song] });
  },

  tick: () => {
    const state = get();
    if (!state.isPlaying || state.currentIndex < 0 || state.currentIndex >= state.queue.length) {
      return;
    }
    const currentSong = state.queue[state.currentIndex];
    if (state.position + 1 >= currentSong.duration) {
      state.next();
    } else {
      set({ position: state.position + 1 });
    }
  },

  seek: (position: number) => {
    set({ position: Math.max(0, position) });
  },

  toggleShuffle: () => {
    set((state) => ({ isShuffle: !state.isShuffle }));
  },

  toggleRepeat: () => {
    set((state) => ({ isRepeat: !state.isRepeat }));
  },
}));
