import React from 'react';

import { useTimePreferences } from '@hooks/useTimePreferences';
import { Box, Typography, Button, CircularProgress } from '@mui/material';

import TimePreferencesGrid from './TimePreferencesGrid';

export default function TimePreferencesPage() {
  const { selectedTimes, setSelectedTimes, loading, error, savePreferences } = useTimePreferences();

  // Function to save preferences and navigate back to profile page
  const handleSavePreferences = async () => {
    await savePreferences();
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
