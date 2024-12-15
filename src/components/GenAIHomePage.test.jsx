import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

import '@testing-library/jest-dom';
import GroupsPage from './GroupsPage';
import HomePage from './HomePage';

// Mock user data to simulate a logged-in user
const mockUser = {
  uid: 'loggedInUser123',
  name: 'User Name',
  year: 'Senior',
  major: 'Computer Science',
  email: 'email@email.com',
  phoneNumber: '(123)-456-7890',
};

// Mock the useAuthState hook to always return the mock user data
vi.mock('@auth/useAuthState', () => ({
  useAuthState: vi.fn(() => [mockUser]), // Simulates a logged-in state
}));

// Mock the useUserProfile hook to return the user profile data
vi.mock('@data/useUserProfile', () => ({
  default: vi.fn(() => ({
    userProfile: mockUser, // Return the mock user data as the profile
    loading: false, // Simulates that the profile has finished loading
  })),
}));

describe('HomePage Navigation', () => {
  // Define the Material-UI theme to be used in the test
  const theme = createTheme();

  it('should navigate to the Groups page and display the correct content', () => {
    render(
      <ThemeProvider theme={theme}>
        {/* Use MemoryRouter to simulate navigation for testing */}
        <MemoryRouter initialEntries={['/groups']}>
          <Routes>
            {/* Define the route for the Groups page */}
            <Route path="/groups" element={<GroupsPage />} />
            {/* Define the route for the Home page */}
            <Route path="/home" element={<HomePage />} />
          </Routes>
        </MemoryRouter>
      </ThemeProvider>,
    );

    // Verify that the GroupsPage-specific content is rendered
    expect(screen.getByText('Matches')).toBeInTheDocument(); // Check for the "Matches" heading
    expect(screen.getByText('Incoming Requests')).toBeInTheDocument(); // Check for "Incoming Requests" section
    expect(screen.getByText('Outgoing Requests')).toBeInTheDocument(); // Check for "Outgoing Requests" section
  });
});
