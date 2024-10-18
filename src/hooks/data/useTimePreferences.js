import { useState, useEffect } from 'react';

import { useAuthState } from '@auth/useAuthState';
import useUserProfile from '@data/useUserProfile';
import { saveTimePreferences } from '@firestore/userProfile';
import { useNavigate } from 'react-router-dom';

const useTimePreferences = () => {
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [user] = useAuthState();
  const navigate = useNavigate();

  const userId = user?.uid;
  const { userProfile, loading } = useUserProfile();

  // Set selected times from user profile only when userProfile is updated
  useEffect(() => {
    if (userProfile && userProfile.timePreferences) {
      setSelectedTimes(userProfile.timePreferences);
    }
  }, [userProfile]);

  // Function to save the selected time preferences
  const savePreferences = async () => {
    try {
      await saveTimePreferences(userId, selectedTimes);
      navigate(`/profile/${userId}`);
    } catch (err) {
      console.error('Failed to save time preferences');
    }
  };

  return {
    selectedTimes,
    setSelectedTimes,
    loading,
    savePreferences,
  };
};

export default useTimePreferences;
