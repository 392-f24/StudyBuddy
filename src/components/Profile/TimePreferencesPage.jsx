import React from 'react';

import useTimePreferences from '@data/useTimePreferences';
import { Box, Typography, Button, CircularProgress } from '@mui/material';

import TimePreferencesGrid from './TimePreferencesGrid';

export default function TimePreferencesPage() {
  const { selectedTimes, setSelectedTimes, loading, savePreferences } = useTimePreferences();

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

      <TimePreferencesGrid selectedTimes={selectedTimes} setSelectedTimes={setSelectedTimes} />

      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
        <Button variant="contained" onClick={handleSavePreferences}>
          Save Preferences
        </Button>
      </Box>
    </Box>
  );
}
