import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

import EditProfile from './EditProfile';

const navigate = vi.fn();
vi.mock('react-router-dom', async (original) => {
  const actual = await original();
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

vi.mock('@auth/useAuthState', () => ({
  useAuthState: () => [{ uid: 'test-uid' }],
}));

vi.mock('@data/useMajors', () => ({
  default: () => ['Computer Science', 'Mathematics'],
}));

vi.mock('@data/useCourses', () => ({
  default: () => ['CS101', 'MATH201'],
}));

vi.mock('@hooks/useEditProfileForm', () => ({
  default: () => ({
    formData: {
      name: 'Test User',
      email: 'test@example.com',
      phoneNumber: '1234567890',
      year: 'Freshman',
      description: '',
      inPerson: false,
      online: false,
    },
    selectedMajors: ['Computer Science'],
    setSelectedMajors: vi.fn(),
    selectedCourses: ['CS101'],
    setSelectedCourses: vi.fn(),
    handleInputChange: vi.fn(),
    errors: {},
    isFormValid: true,
    firstTimeUser: false,
    loading: false,
    handleSubmit: vi.fn().mockResolvedValue(true), // Simulate success
  }),
}));

describe('EditProfile navigation', () => {
  it('navigates back to the updated profile after saving', async () => {
    render(
      <BrowserRouter>
        <EditProfile />
      </BrowserRouter>,
    );

    const saveButton = screen.getByText(/save profile/i);

    // Simulate click
    await fireEvent.click(saveButton);

    // Assert navigate was called
    expect(navigate).toHaveBeenCalledWith('/profile/test-uid', {
      state: { fromEditProfile: true },
    });
  });
});
