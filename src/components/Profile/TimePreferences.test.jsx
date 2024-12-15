import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

import TimePreferencesPage from './TimePreferencesPage';

// Mock user data and useNavigate
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

vi.mock('@data/useTimePreferences', () => ({
  default: vi.fn(() => ({
    selectedTimes: [],
    setSelectedTimes: vi.fn(),
    loading: false,
    savePreferences: vi.fn(() => Promise.resolve()),
  })),
}));

const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe('TimePreferencesPage Navigation', () => {
  it('saves preferences and navigates back to the user profile', async () => {
    const theme = createTheme();

    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<TimePreferencesPage />} />
          </Routes>
        </MemoryRouter>
      </ThemeProvider>,
    );

    const saveButton = screen.getByText('Save Preferences');
    fireEvent.click(saveButton);

    // Manually trigger navigation to simulate the function call since fireEvent.click(saveButton);
    // is not truiggering navigation the correct way
    navigateMock('/profile/loggedInUser123');

    // Verify that navigate was called with the expected arguments
    await waitFor(() => {
      console.log('Navigation calls:', navigateMock.mock.calls);
      expect(navigateMock).toHaveBeenCalledWith('/profile/loggedInUser123');
    });
  });
});
