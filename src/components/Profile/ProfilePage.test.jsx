import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import ProfilePage from './ProfilePage';

// Mock Firebase modules
vi.mock('/src/utils/firebase.config', () => ({
  db: {}, // Mock Firestore database
  auth: {}, // Mock Auth object
}));

describe('ProfilePage', () => {
  let originalConsoleError;
  let originalConsoleWarn;

  beforeEach(() => {
    // Save the original console methods
    originalConsoleError = console.error;
    originalConsoleWarn = console.warn;

    // Mock console.error to suppress specific warnings
    console.error = vi.fn((message) => {
      const msg = String(message); // Ensure message is a string
      if (
        msg.includes('You have provided an out-of-range value') ||
        msg.includes('Error using user provided cache')
      ) {
        return; // Ignore specific errors
      }
      originalConsoleError(message); // Call the original console.error
    });

    // Mock console.warn to suppress specific warnings
    console.warn = vi.fn((message) => {
      const msg = String(message); // Ensure message is a string
      if (
        msg.includes('You have provided an out-of-range value') ||
        msg.includes('Error using user provided cache')
      ) {
        return; // Ignore specific warnings
      }
      originalConsoleWarn(message); // Call the original console.warn
    });
  });

  afterEach(() => {
    // Restore the original console methods after each test
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
  });

  it('navigates to edit profile page when edit button is clicked', () => {
    render(
      <BrowserRouter>
        <ProfilePage />
      </BrowserRouter>,
    );

    const editButton = screen.getByText(/edit profile/i);
    fireEvent.click(editButton);

    // Check if navigation works
    expect(window.location.pathname).toBe('/edit-profile');
  });
});
