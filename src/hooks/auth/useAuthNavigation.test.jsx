import React from 'react';

import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { handleSignIn } from '@utils/auth';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { describe, test, vi, expect } from 'vitest';

import { useAuthNavigation } from './useAuthNavigation';

vi.mock('@utils/auth', () => ({
  handleSignIn: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('useAuthNavigation - New User Sign-In', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('Should navigate to edit-profile for new users', async () => {
    // Mock `handleSignIn` to return `false` for a new user
    vi.mocked(handleSignIn).mockResolvedValue(false);

    // Use `renderHook` to render the hook in a valid environment
    const { result } = renderHook(() => useAuthNavigation(), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });

    // Simulate calling `signInAndCheckFirstTimeUser`
    await act(async () => {
      result.current.signInAndCheckFirstTimeUser();
    });

    // Verify navigation to "/edit-profile"
    expect(mockNavigate).toHaveBeenCalledWith('/edit-profile');
  });
});
