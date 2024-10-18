import { useState, useEffect } from 'react';

import { useAuthState } from '@auth/useAuthState';
import { fetchUserProfile, updateUserProfile } from '@firestore/userProfile';
import { useNavigate } from 'react-router-dom';

const useTimePreferences = () => {
  // Initialize as null to indicate loading state
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState();
  const navigate = useNavigate();

  const userId = user?.uid;

  // Set selected times from user profile only when userProfile is updated
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const { profile } = await fetchUserProfile(userId);
        const fetchedTimes = profile?.timePreferences || [];
        setSelectedTimes(fetchedTimes);
      } catch (err) {
        console.error('Failed to load time preferences');
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [userId]);

  // Function to save the selected time preferences
  const savePreferences = async () => {
    try {
      await updateUserProfile(userId, {
        timePreferences: selectedTimes,
      });
      navigate(`/profile/${userId}`);
    } catch (err) {
      console.error('Failed to save time preferences');
    }
  };

  return {
    selectedTimes,
    setSelectedTimes,
    loading: loading,
    savePreferences,
  };
};

export default useTimePreferences;
