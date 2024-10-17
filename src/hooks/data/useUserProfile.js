import React from 'react';

import { useAuthState } from '@hooks/auth/useAuthState';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import TimePreferencesGrid from './TimePreferencesGrid';
import { useTimePreferences } from '../../hooks/useTimePreferences'; // Adjust path to your hooks

export default function TimePreferencesPage() {
  const [user] = useAuthState();
  const navigate = useNavigate();

  const { selectedTimes, setSelectedTimes, loading, error, savePreferences } = useTimePreferences(
    user?.uid,
  );

  // Redirect to home page if user is not authenticated
  if (!user?.uid) {
    navigate('/');
    return null;
  }

  const handleSavePreferences = async () => {
    await savePreferences();
    navigate(`/profile/${user.uid}`);
  };

  if (loading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', padding: 3, alignItems: 'center' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Time Preferences
      </Typography>

      {error && (
        <Typography variant="body2" color="error" align="center">
          {error}
        </Typography>
      )}

      <TimePreferencesGrid selectedTimes={selectedTimes} setSelectedTimes={setSelectedTimes} />

      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
        <Button variant="contained" onClick={handleSavePreferences}>
          Save Preferences
        </Button>
      </Box>
    </Box>
  );
}
