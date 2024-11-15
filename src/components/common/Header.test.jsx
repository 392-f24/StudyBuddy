import { useAuthNavigation } from '@auth/useAuthNavigation';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, vi, beforeEach, afterEach } from 'vitest';

import Header from './Header';

import '@testing-library/jest-dom';

vi.mock('@auth/useAuthNavigation', () => ({
  useAuthNavigation: vi.fn(),
}));

describe('Header - Profile Button', () => {
  const mockSignInAndCheckFirstTimeUser = vi.fn();

  beforeEach(() => {
    useAuthNavigation.mockReturnValue({
      user: null,
      handleProfileClick: vi.fn(),
      signInAndCheckFirstTimeUser: mockSignInAndCheckFirstTimeUser,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('opens a sign-in pop-up when profile button is clicked', async () => {
    render(
      <MemoryRouter>
        <Header onFilterToggle={vi.fn()} showFilter={false} isFilterOpen={false} />
      </MemoryRouter>,
    );

    const signInButton = screen.getByTestId('sign-in-button');
    expect(signInButton).toBeInTheDocument();

    await fireEvent.click(signInButton);

    expect(mockSignInAndCheckFirstTimeUser).toHaveBeenCalled();
  });
});
