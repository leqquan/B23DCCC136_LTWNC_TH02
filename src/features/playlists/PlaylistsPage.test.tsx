import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { PlaylistProvider } from './PlaylistContext';
import { PlaylistsPage } from './PlaylistsPage';
import type { Playlist } from './playlistReducer';

// Hàm bọc các Provider và MemoryRouter theo yêu cầu bài thực hành
const renderWithProviders = (
  ui: React.ReactElement,
  { initialPlaylists = [] as Playlist[] } = {}
) => {
  return render(
    <MemoryRouter>
      <PlaylistProvider initialValue={initialPlaylists}>
        {ui}
      </PlaylistProvider>
    </MemoryRouter>
  );
};

describe('Kiểm thử giao diện PlaylistsPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('bấm Tạo khi ô trống thì thấy "Tên playlist không được để trống"', async () => {
    renderWithProviders(<PlaylistsPage />);

    const createButton = screen.getByRole('button', { name: 'Tạo' });
    await userEvent.click(createButton);

    expect(
      screen.getByText('Tên playlist không được để trống')
    ).toBeInTheDocument();
  });

  it('nhập tên rồi bấm Tạo thì tên xuất hiện trong danh sách', async () => {
    renderWithProviders(<PlaylistsPage />);

    const input = screen.getByPlaceholderText('Tên playlist...');
    const createButton = screen.getByRole('button', { name: 'Tạo' });

    await userEvent.type(input, 'Nhạc Acoustic');
    await userEvent.click(createButton);

    expect(screen.getByText('Nhạc Acoustic')).toBeInTheDocument();
  });

  it('nhập tên trùng (không phân biệt hoa thường) thì thấy "Tên playlist đã tồn tại"', async () => {
    renderWithProviders(<PlaylistsPage />, {
      initialPlaylists: [{ id: 'pl_1', name: 'Chạy bộ', songIds: [] }],
    });

    const input = screen.getByPlaceholderText('Tên playlist...');
    const createButton = screen.getByRole('button', { name: 'Tạo' });

    await userEvent.type(input, 'chạy bộ');
    await userEvent.click(createButton);

    expect(screen.getByText('Tên playlist đã tồn tại')).toBeInTheDocument();
  });
});
