import React from 'react';

import { useAuthState } from '@auth/useAuthState';
import useEditProfileForm from '@hooks/useEditProfileForm';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  TextField,
  Button,
  CircularProgress,
  Autocomplete,
  IconButton,
  MenuItem,
  Checkbox,
  FormLabel,
  FormGroup,
  FormControlLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const [user] = useAuthState();
  const {
    formData,
    majorsList,
    selectedMajors,
    setSelectedMajors,
    coursesList,
    selectedCourses,
    setSelectedCourses,
    handleInputChange,
    errors,
    isFormValid,
    firstTimeUser,
    loading,
    handleSubmit,
  } = useEditProfileForm(user);
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const success = await handleSubmit(user.uid);
    if (success) {
      navigate(`/profile/${user.uid}`, { state: { fromEditProfile: true } });
    }
  };

  const years = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Master', 'PhD'];

  if (loading) return <CircularProgress />;

  return (
    <div style={{ position: 'relative', padding: '5px' }}>
      {firstTimeUser && (
        <IconButton
          style={{ position: 'absolute', top: '2px', left: '2px', zIndex: 10 }}
          onClick={() => navigate(`/profile/${user.uid}`, { state: { fromEditProfile: true } })}
        >
          <ArrowBackIcon />
        </IconButton>
      )}
      <div style={{ marginTop: '40px' }}>
        <form onSubmit={handleFormSubmit}>
          {renderTextField('Name', 'name', formData.name, handleInputChange, errors.name)}
          {renderTextField(
            'Email',
            'email',
            formData.email,
            handleInputChange,
            errors.email,
            'email',
          )}
          {renderTextField(
            'Phone Number',
            'phoneNumber',
            formData.phoneNumber,
            handleInputChange,
            errors.phoneNumber,
            'tel',
          )}

          {/* Major Selection */}
          <Autocomplete
            multiple
            options={majorsList}
            getOptionLabel={(option) => option}
            value={selectedMajors}
            onChange={(event, newValue) => {
              if (newValue.length <= 3) setSelectedMajors(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Major"
                error={errors.major}
                helperText={errors.major && 'Please select your major(s)'}
                margin="normal"
                fullWidth
              />
            )}
          />

          {/* Course Selection */}
          <Autocomplete
            multiple
            options={coursesList}
            getOptionLabel={(option) => option}
            value={selectedCourses}
            onChange={(event, newValue) => setSelectedCourses(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Courses"
                error={!!errors.courses}
                helperText={errors.courses && 'Please select your course(s)'}
                margin="normal"
                fullWidth
              />
            )}
            filterOptions={(options, { inputValue }) => {
              // Convert inputValue to lowercase for case-insensitive matching
              const lowercasedInput = inputValue.toLowerCase();

              // Only include options that start with the input
              return options.filter((option) => option.toLowerCase().startsWith(lowercasedInput));
            }}
            sx={{ flex: 1, minWidth: 200, maxWidth: '100%' }}
            freeSolo
          />

          {/* Year Selection */}
          {renderSelectField('Year', 'year', years, formData.year, handleInputChange, errors.year)}

          {/* Description Field */}
          {renderTextField('Description', 'description', formData.description, handleInputChange)}

          {/* Location Preference */}
          <FormLabel component="legend">Location Preference</FormLabel>
          <FormGroup row sx={{ mb: 2 }}>
            {renderCheckbox('In Person', 'inPerson', !!formData.inPerson, handleInputChange)}
            {renderCheckbox('Online', 'online', !!formData.online, handleInputChange)}
          </FormGroup>

          <Button variant="contained" color="primary" type="submit" disabled={!isFormValid}>
            Save Profile
          </Button>
        </form>
      </div>
    </div>
  );
};

const renderTextField = (label, name, value, onChange, error = false, type = 'text') => (
  <TextField
    label={label}
    name={name}
    type={type}
    value={value}
    onChange={(e) => onChange(name, e.target.value)}
    error={error}
    helperText={error ? `${label} is required` : ''}
    fullWidth
    margin="normal"
  />
);

const renderSelectField = (label, name, options, value, onChange, error = false) => (
  <TextField
    label={label}
    name={name}
    select
    value={value}
    onChange={(e) => onChange(name, e.target.value)}
    error={error}
    helperText={error ? `${label} is required` : ''}
    fullWidth
    margin="normal"
  >
    {options.map((option) => (
      <MenuItem key={option} value={option}>
        {option}
      </MenuItem>
    ))}
  </TextField>
);

const renderCheckbox = (label, name, value, onChange) => (
  <FormControlLabel
    control={
      <Checkbox name={name} checked={value} onChange={(e) => onChange(name, e.target.checked)} />
    }
    label={label}
  />
);

export default EditProfile;
