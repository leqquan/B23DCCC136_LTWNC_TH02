export type Genre = 'Pop' | 'Ballad' | 'Rock' | 'Indie' | 'Rap';

export interface Song {
  id: string;
  title: string;
  artist: string;
  genre: Genre;
  duration: number; // đơn vị: giây
}

export type Theme = 'light' | 'dark';

export type SortOption = 'default' | 'title_asc' | 'duration_asc';
