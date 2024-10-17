import { useState, useEffect } from 'react';

import { useAuthState } from '@auth/useAuthState';
import { fetchTimePreferences, saveTimePreferences } from '@firestore/userProfile';
import { useNavigate } from 'react-router-dom';

export const useTimePreferences = () => {
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user] = useAuthState();
  const navigate = useNavigate();

  const userId = user?.uid;

  // Check if user is authenticated, if not, redirect to home
  useEffect(() => {
    if (!userId) {
      navigate('/');
      return;
    }

    // Fetch saved time preferences when the component loads
    const loadPreferences = async () => {
      try {
        const fetchedTimes = await fetchTimePreferences(userId);
        setSelectedTimes(fetchedTimes);
      } catch (err) {
        setError('Failed to load time preferences');
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [userId, navigate]);

  // Function to save the selected time preferences
  const savePreferences = async () => {
    try {
      await saveTimePreferences(userId, selectedTimes);
    } catch (err) {
      setError('Failed to save time preferences');
    }
  };

  return {
    selectedTimes,
    setSelectedTimes,
    loading,
    error,
    savePreferences,
    userId,
  };
};
