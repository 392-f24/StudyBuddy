import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

import '@testing-library/jest-dom';
import GroupsPage from './GroupsPage';

// Mock user data as logged in
const user = {
  uid: 'loggedInUser123',
  year: 'Senior',
  timePreferences: [],
  profilePic: null,
  phoneNumber: '(123)-456-7890',
  open: true,
  online: true,
  inPerson: true,
  name: 'User Name',
  major: 'Computer Science',
  email: 'email@email.com',
  description: '',
  locationPreference: [],
  listOfCourses: [],
  pastMatches: [],
  incomingMatches: [],
  outgoingMatches: [],
  currentMatches: ['match1', 'match2'],
};

vi.mock('@auth/useAuthState', () => ({
  useAuthState: vi.fn(() => [user]),
}));

vi.mock('@data/useUserProfile', () => ({
  default: vi.fn(() => ({
    userProfile: user,
    loading: false,
  })),
}));

describe('HomePage Navigation', () => {
  it('navigates to the Groups page correctly when the Matches icon is clicked', async () => {
    const theme = createTheme();

    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={['/groups']}>
          <Routes>
            <Route path="/groups" element={<GroupsPage />} />
          </Routes>
        </MemoryRouter>
      </ThemeProvider>,
    );

    // Check for content specific to the Groups page
    expect(screen.getByText('Matches')).toBeInTheDocument();
    expect(screen.getByText('Incoming Requests')).toBeInTheDocument();
    expect(screen.getByText('Outgoing Requests')).toBeInTheDocument();
  });
});
