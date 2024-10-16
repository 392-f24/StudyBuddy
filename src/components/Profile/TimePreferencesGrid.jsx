//to be deleted soon
import React, { useState } from 'react';

import { Box, Paper, Typography } from '@mui/material';

// Generate 12-hour clock with AM/PM
const generateTimeSlots = () => {
  const slots = [];
  for (let i = 0; i < 24; i++) {
    const hour = i % 12 === 0 ? 12 : i % 12; // Handle 12-hour format
    const period = i < 12 ? 'AM' : 'PM';
    slots.push(`${hour}:00 ${period}`);
  }
  return slots;
};

const hours = generateTimeSlots();
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const TimePreferencesGrid = ({ selectedTimes, setSelectedTimes }) => {
  const handleSlotClick = (day, hour) => {
    const slot = `${day}-${hour}`;
    const updatedTimes = selectedTimes.includes(slot)
      ? selectedTimes.filter((time) => time !== slot)
      : [...selectedTimes, slot];

    setSelectedTimes(updatedTimes);
  };

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${days.length + 1}, 1fr)`, gap: 1 }}>
      {/* Render Day Headers */}
      <Paper elevation={0} /> {/* Empty cell for alignment */}
      {days.map((day) => (
        <Typography key={day} variant="subtitle1" align="center">
          {day}
        </Typography>
      ))}
      {/* Render Time Rows */}
      {hours.map((hour) => (
        <React.Fragment key={hour}>
          <Typography variant="subtitle2" align="center">
            {hour}
          </Typography>
          {days.map((day) => {
            const slot = `${day}-${hour}`;
            const isSelected = selectedTimes.includes(slot);

            return (
              <Paper
                key={slot}
                onClick={() => handleSlotClick(day, hour)}
                sx={{
                  width: '100%',
                  height: 30,
                  backgroundColor: isSelected ? 'purple' : 'white',
                  cursor: 'pointer',
                  border: '1px solid grey',
                }}
              />
            );
          })}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default TimePreferencesGrid;
