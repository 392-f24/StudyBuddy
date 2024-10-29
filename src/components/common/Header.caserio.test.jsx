import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

import Header from './Header';

const navigate = vi.fn();

// Mock react-router-dom
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

// Mock the useAuthNavigation hook
vi.mock('@auth/useAuthNavigation', () => ({
  useAuthNavigation: () => ({
    user: { uid: 'test-uid', displayName: 'Test User', photoURL: 'test-url' },
    handleProfileClick: () => navigate(`/profile/test-uid`), // Directly invoke navigate to simulate handleProfileClick
  }),
}));

describe('Profile button in header', () => {
  it('navigates to the profile page when the profile icon is clicked', () => {
    navigate.mockClear(); // Clear previous calls to navigate

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    );

    // Simulate clicking on the profile icon
    const profileIcon = screen.getByRole('button', { name: /test user/i });
    fireEvent.click(profileIcon);

    // Assert that navigate was called with the user’s profile path
    expect(navigate).toHaveBeenCalledWith('/profile/test-uid');
  });
});
