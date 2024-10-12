import React from 'react';

import useCourses from '@data/useCourses';
import useMajors from '@data/useMajors';
import {
  Box,
  Autocomplete,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
} from '@mui/material';

export default function StudentFilter({
  selectedMajors,
  setSelectedMajors,
  selectedCourses,
  setSelectedCourses,
  selectedYears,
  setSelectedYears,
}) {
  const majorsList = useMajors();
  const coursesList = useCourses();

  return (
    <Box sx={{ display: { xs: 'block', md: 'flex' }, gap: 2, mb: 2 }}>
      {/* 1. Major filter */}
      <Autocomplete
        multiple
        options={majorsList}
        getOptionLabel={(option) => option}
        value={selectedMajors}
        onChange={(event, newValue) => setSelectedMajors(newValue)}
        renderInput={(params) => (
          <TextField {...params} label="Filter by Major(s)" variant="outlined" />
        )}
        sx={{ flex: 1, mb: 2, minWidth: 200, maxWidth: '100%' }}
      />

      {/* 2. Course filter */}
      <Autocomplete
        multiple
        options={coursesList}
        getOptionLabel={(option) => option}
        value={selectedCourses}
        onChange={(event, newValue) => setSelectedCourses(newValue)}
        renderInput={(params) => (
          <TextField {...params} label="Filter by Course(s)" variant="outlined" />
        )}
        filterOptions={(options, { inputValue }) => {
          // Convert inputValue to lowercase for case-insensitive matching
          const lowercasedInput = inputValue.toLowerCase();

          // Only include options that start with the input
          return options.filter((option) => option.toLowerCase().startsWith(lowercasedInput));
        }}
        sx={{ flex: 1, mb: 2, minWidth: 200, maxWidth: '100%' }}
        freeSolo
      />

      {/* 3. Year filter */}
      <FormControl sx={{ flex: 1, mb: 2, minWidth: 200, maxWidth: '100%' }}>
        <InputLabel>Filter by Year(s)</InputLabel>
        <Select
          multiple
          value={selectedYears}
          onChange={(event) => setSelectedYears(event.target.value)}
          input={<OutlinedInput label="Filter by Year(s)" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {['Freshman', 'Sophomore', 'Junior', 'Senior', 'Master', 'PhD'].map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
