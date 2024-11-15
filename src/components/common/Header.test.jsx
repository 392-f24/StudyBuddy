import { useAuthNavigation } from '@auth/useAuthNavigation';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';

import Header from './Header';

vi.mock('@auth/useAuthNavigation', () => ({
  useAuthNavigation: vi.fn(),
}));

describe('Header - Sign In Button Behavior', () => {
  const mockSignInAndCheckFirstTimeUser = vi.fn();

  beforeEach(() => {
    useAuthNavigation.mockReturnValue({
      user: null, // Simulate the user not being logged in
      handleProfileClick: vi.fn(),
      signInAndCheckFirstTimeUser: mockSignInAndCheckFirstTimeUser,
    });
  });

  test('Should show "Sign In" button when user is not logged in', async () => {
    render(
      <MemoryRouter>
        <Header onFilterToggle={vi.fn()} showFilter={false} isFilterOpen={false} />
      </MemoryRouter>,
    );

    // Verify "Sign In" button appears
    const signInButton = screen.getByText('Sign In');
    expect(signInButton).toBeTruthy();

    // Click the "Sign In" button
    await act(async () => {
      fireEvent.click(signInButton);
    });

    // Verify the `signInAndCheckFirstTimeUser` function is called
    expect(mockSignInAndCheckFirstTimeUser).toHaveBeenCalled();
  });

  test('Should show user avatar when logged in', async () => {
    const mockUser = { displayName: 'Elara Liu', photoURL: 'avatar.png' };

    useAuthNavigation.mockReturnValue({
      user: mockUser, // Simulate the user being logged in
      handleProfileClick: vi.fn(),
      signInAndCheckFirstTimeUser: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Header onFilterToggle={vi.fn()} showFilter={false} isFilterOpen={false} />
      </MemoryRouter>,
    );

    // Verify avatar appears with correct alt text
    const avatar = screen.getByAltText(mockUser.displayName);
    expect(avatar).toBeTruthy();
  });

  test('Should trigger navigation to profile when avatar is clicked', async () => {
    const mockUser = { displayName: 'Elara Liu', photoURL: 'avatar.png', uid: '123' };
    const mockHandleProfileClick = vi.fn();

    useAuthNavigation.mockReturnValue({
      user: mockUser, // Simulate the user being logged in
      handleProfileClick: mockHandleProfileClick,
      signInAndCheckFirstTimeUser: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Header onFilterToggle={vi.fn()} showFilter={false} isFilterOpen={false} />
      </MemoryRouter>,
    );

    // Click the avatar
    const avatar = screen.getByAltText(mockUser.displayName);
    await act(async () => {
      fireEvent.click(avatar);
    });

    // Verify the `handleProfileClick` function is called
    expect(mockHandleProfileClick).toHaveBeenCalled();
  });
});
