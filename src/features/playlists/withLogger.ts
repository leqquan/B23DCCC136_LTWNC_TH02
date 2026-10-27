import type { Playlist, PlaylistAction } from './playlistReducer';

export type PlaylistReducerType = (state: Playlist[], action: PlaylistAction) => Playlist[];

export const withLogger = (reducer: PlaylistReducerType): PlaylistReducerType => {
  return (state: Playlist[], action: PlaylistAction): Playlist[] => {
    const nextState = reducer(state, action);
    if (import.meta.env.DEV) {
      console.log(`Action: ${action.type}`, {
        previousState: state,
        nextState,
      });
    }
    return nextState;
  };
};
