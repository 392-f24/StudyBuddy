import React, { useState, useEffect, useRef } from 'react';

import { useAuthState } from '@auth/useAuthState';
import StudentList from '@components/Home/StudentList';
import useUserProfile from '@data/useUserProfile';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import StudentFilter from './Home/StudentFilter';

export default function HomePage({ isFilterOpen, handleFilterToggle }) {
  // Receive props from AppContent
  const [user] = useAuthState();
  const { userProfile, requestedUsers, setRequestedUsers, matchedUserUids, loading } =
    useUserProfile(user);
  const [selectedMajors, setSelectedMajors] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const filterRef = useRef(null); // Reference to the filter component
  const navigate = useNavigate();

  // Close the filter if clicked outside
  const handleClickOutside = (event) => {
    // Check if the click is inside the filter or inside the dropdown (Autocomplete or Select)
    if (
      filterRef.current &&
      !filterRef.current.contains(event.target) &&
      !document.querySelector('.MuiAutocomplete-popper')?.contains(event.target) && // For Autocomplete dropdowns
      !document.querySelector('.MuiPopover-root')?.contains(event.target) // For Select dropdowns
    ) {
      handleFilterToggle(false); // Close the filter only when clicked outside
    }
  };

  useEffect(() => {
    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside); // or use 'pointerdown' instead of 'mousedown'
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Cleanup the listener
    };
  }, [isFilterOpen]);

  useEffect(() => {
    if (userProfile && (!userProfile.major || !userProfile.year || !userProfile.phoneNumber)) {
      navigate('/edit-profile');
    }
  }, [userProfile, navigate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Please log in to access the app.
        </Typography>
      </Box>
    );
  }

  if (!userProfile || !userProfile.major || !userProfile.year || !userProfile.phoneNumber) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {/* Render the filter section only if it's open */}
      {isFilterOpen && (
        <Box
          ref={filterRef}
          sx={{
            position: 'absolute',
            top: 60,
            left: 0,
            zIndex: 10,
            backgroundColor: 'white',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            width: '100%',
            padding: 1,
            marginBottom: 2,
          }}
        >
          <StudentFilter
            selectedMajors={selectedMajors}
            setSelectedMajors={setSelectedMajors}
            selectedCourses={selectedCourses}
            setSelectedCourses={setSelectedCourses}
            selectedYears={selectedYears}
            setSelectedYears={setSelectedYears}
          />
        </Box>
      )}
      <StudentList
        userProfile={userProfile}
        requestedUsers={requestedUsers}
        setRequestedUsers={setRequestedUsers}
        matchedUserUids={matchedUserUids}
        selectedMajors={selectedMajors}
        selectedCourses={selectedCourses}
        selectedYears={selectedYears}
      />
    </Box>
  );
}
