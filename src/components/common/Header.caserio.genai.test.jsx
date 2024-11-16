import React from 'react';

import { useAuthNavigation } from '@auth/useAuthNavigation';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, vi, afterEach, beforeEach } from 'vitest';

import Header from './Header';

vi.mock('@auth/useAuthNavigation');

// Define mockNavigate outside of beforeEach
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/' }),
  };
});

describe('Header Component', () => {
  const mockHandleProfileClick = vi.fn();

  beforeEach(() => {
    useAuthNavigation.mockReturnValue({
      user: { displayName: 'Test User', photoURL: '/test-avatar.png' },
      handleProfileClick: mockHandleProfileClick,
      signInAndCheckFirstTimeUser: vi.fn(),
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('navigates to the profile page when profile icon is clicked', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Header />} />
        </Routes>
      </MemoryRouter>,
    );

    const profileIcon = screen.getByRole('button', { name: /Test User/i });
    fireEvent.click(profileIcon);

    expect(mockHandleProfileClick).toHaveBeenCalled();
  });
});
