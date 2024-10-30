import React, { useState } from 'react';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import GroupsPage from './GroupsPage';

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

const match1 = {
  uid: 'match1',
  year: 'Senior',
  timePreferences: [],
  profilePic: null,
  phoneNumber: '(111)-222-3333',
  open: true,
  online: true,
  inPerson: true,
  name: 'Alice Smith',
  major: 'Biology',
  email: 'alice@email.com',
  description: '',
  locationPreference: [],
  listOfCourses: [],
  pastMatches: [],
  incomingMatches: [],
  outgoingMatches: [],
  currentMatches: ['loggedInUser123'],
};

const match2 = {
  uid: 'match2',
  year: 'Junior',
  timePreferences: [],
  profilePic: null,
  phoneNumber: '(444)-555-6666',
  open: true,
  online: true,
  inPerson: true,
  name: 'John Doe',
  major: 'Physics',
  email: 'john@email.com',
  description: '',
  locationPreference: [],
  listOfCourses: [],
  pastMatches: [],
  incomingMatches: [],
  outgoingMatches: [],
  currentMatches: ['loggedInUser123'],
};

vi.mock('@auth/useAuthState', () => ({
  useAuthState: vi.fn(() => [{ uid: 'loggedInUser123' }]), // Mock logged-in user
}));

vi.mock('@data/useUserProfile', () => ({
  // Mock user profile
  default: vi.fn(() => ({
    userProfile: user,
    loading: false,
  })),
}));

const mockSetMatchProfiles = vi.fn(); // Mock matches state
vi.spyOn(React, 'useState').mockImplementation((initialValue) => {
  return [[match1, match2], mockSetMatchProfiles];
});

vi.mock('@firestore/matches', () => ({
  // Mock matches for user
  getUserMatches: vi.fn(() => [match1, match2]),
}));

describe('Matches modal', () => {
  it('opens the profile modal with user info when "View Profile" is clicked for a matched profile', async () => {
    render(
      <ThemeProvider theme={createTheme()}>
        <GroupsPage />
      </ThemeProvider>,
    );

    // Wait for matched profiles to load
    const viewProfileButtons = await screen.findAllByRole('button', { name: /View Profile/i });

    // Ensure there are profile buttons
    expect(viewProfileButtons.length > 0);

    // Click the first View Profile button
    fireEvent.click(viewProfileButtons[0]);

    const names1 = await screen.findAllByText('Alice Smith');
    expect(names1.length > 0);
    const number = await screen.findByText('(111)-222-3333');
    expect(number);

    const names2 = await screen.findAllByText('John Doe');
    expect(names2.length == 0);
  });
});
