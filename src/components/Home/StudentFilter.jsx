import React from 'react';

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
  selectedYears,
  setSelectedYears,
}) {
  const majorsList = useMajors();

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

      {/* 2. Year filter */}
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

      {/* 3. Course filter */}
    </Box>
  );
}
