import React, { useState } from 'react';

import { Box, Typography, Button } from '@mui/material';

import TimePreferencesGrid from './TimePreferencesGrid';

export default function TimePreferencesPage() {
  const [selectedTimes, setSelectedTimes] = useState([]);

  const handleSavePreferences = () => {
    console.log('Selected Times:', selectedTimes);
  };

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
