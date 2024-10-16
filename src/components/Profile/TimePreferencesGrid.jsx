import React, { useState } from 'react';

import {
  Box,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  useTheme,
} from '@mui/material';

// Generate 12-hour clock with AM/PM
const hours = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 || 12;
  return `${hour} ${i < 12 ? 'AM' : 'PM'}`;
});

const weekdays = ['M', 'T', 'W', 'Th', 'F'];
const weekendDays = ['Sa', 'Su'];

const TimePreferencesGrid = ({ selectedTimes, setSelectedTimes }) => {
  const [noEarlierThan, setNoEarlierThan] = useState(8); // Time index for "No earlier than"
  const [noLaterThan, setNoLaterThan] = useState(20); // Time index for "No later than"
  const [includeWeekends, setIncludeWeekends] = useState(false); // Toggle for showing weekends

  const handleSlotClick = (day, hour) => {
    const slot = `${day}-${hour}`;
    setSelectedTimes((prev) =>
      prev.includes(slot) ? prev.filter((time) => time !== slot) : [...prev, slot],
    );
  };

  const theme = useTheme();

  // Handle filtering the displayed hours based on the selected limits
  const filteredHours = hours.slice(noEarlierThan, noLaterThan + 1);

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', padding: 3 }}>
      {/* No Earlier Than and No Later Than selectors */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>No earlier than</InputLabel>
          <Select
            value={noEarlierThan}
            label="No earlier than"
            onChange={(e) => setNoEarlierThan(e.target.value)}
          >
            {hours.map((hour, index) => (
              <MenuItem key={hour} value={index}>
                {hour}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>No later than</InputLabel>
          <Select
            value={noLaterThan}
            label="No later than"
            onChange={(e) => setNoLaterThan(e.target.value)}
          >
            {hours.map((hour, index) => (
              <MenuItem key={hour} value={index}>
                {hour}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Toggle for Weekends */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={includeWeekends}
              onChange={(e) => setIncludeWeekends(e.target.checked)}
              color="primary"
            />
          }
          label="Include Weekends"
        />
      </Box>

      {/* Time Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${includeWeekends ? weekdays.length + weekendDays.length + 1 : weekdays.length + 1}, 1fr)`,
          gap: 1,
        }}
      >
        <Box /> {/* Empty cell for alignment */}
        {weekdays.map((day) => (
          <Typography key={day} variant="subtitle1" align="center">
            {day}
          </Typography>
        ))}
        {includeWeekends &&
          weekendDays.map((day) => (
            <Typography key={day} variant="subtitle1" align="center">
              {day}
            </Typography>
          ))}
        {filteredHours.map((hour) => (
          <React.Fragment key={hour}>
            <Typography variant="subtitle2" align="center" sx={{ whiteSpace: 'nowrap' }}>
              {hour}
            </Typography>
            {weekdays.map((day) => {
              const slot = `${day}-${hour}`;
              const isSelected = selectedTimes.includes(slot);

              return (
                <Paper
                  key={slot}
                  onClick={() => handleSlotClick(day, hour)}
                  sx={{
                    width: '100%',
                    height: 30,
                    backgroundColor: isSelected ? theme.palette.primary.main : 'white',
                    cursor: 'pointer',
                    border: '0.5px solid grey',
                  }}
                />
              );
            })}
            {includeWeekends &&
              weekendDays.map((day) => {
                const slot = `${day}-${hour}`;
                const isSelected = selectedTimes.includes(slot);

                return (
                  <Paper
                    key={slot}
                    onClick={() => handleSlotClick(day, hour)}
                    sx={{
                      width: '100%',
                      height: 30,
                      backgroundColor: isSelected ? theme.palette.primary.main : 'white',
                      cursor: 'pointer',
                      border: '0.5px solid grey',
                    }}
                  />
                );
              })}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default React.memo(TimePreferencesGrid);
