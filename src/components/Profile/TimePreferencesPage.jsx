// To be deleted
// adding thid page to display the time grid for now.
import React, { useState } from 'react';

import { Box, Typography, Button } from '@mui/material';

import TimePreferencesGrid from './TimePreferencesGrid';

export default function TimePreferencesPage() {
  const [selectedTimes, setSelectedTimes] = useState([]);

  const handleSavePreferences = () => {
    console.log('Selected Times:', selectedTimes);
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', padding: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Select Your Study Time Preferences
      </Typography>

      <TimePreferencesGrid selectedTimes={selectedTimes} setSelectedTimes={setSelectedTimes} />

      <Button variant="contained" onClick={handleSavePreferences} sx={{ marginTop: 2 }}>
        Save Preferences
      </Button>
    </Box>
  );
}
