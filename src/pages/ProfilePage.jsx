import React, { useState, useEffect } from 'react';

import { TextField, Button, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';

import { getUserProfile, updateUserProfile } from '../utils/firestore';

export default function ProfilePage() {
  const { id } = useParams(); // Get the user's UID from the URL
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    major: '',
    year: '',
    description: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getUserProfile(id); // Fetch user data by uid
      if (data) {
        setProfileData(data);
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          major: data.major || '',
          year: data.year || '',
          description: data.description || '',
        });
      }
      setLoading(false);
    };

    fetchProfile();
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async () => {
    try {
      await updateUserProfile(id, formData); // Update user profile in Firestore
      setEditMode(false); // Disable edit mode after saving
      console.log('Profile updated successfully');
      // refresh the page
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <h2>Profile Page</h2>
      {editMode ? (
        <div>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Major"
            name="major"
            value={formData.major}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Year"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleUpdateProfile}>
            Save
          </Button>
          <Button variant="outlined" onClick={() => setEditMode(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <div>
          <p>
            <strong>Name:</strong> {profileData.name}
          </p>
          <p>
            <strong>Email:</strong> {profileData.email}
          </p>
          <p>
            <strong>Phone Number:</strong> {profileData.phoneNumber}
          </p>
          <p>
            <strong>Major:</strong> {profileData.major}
          </p>
          <p>
            <strong>Year:</strong> {profileData.year}
          </p>
          <p>
            <strong>Description:</strong> {profileData.description}
          </p>
          <Button variant="contained" onClick={() => setEditMode(true)}>
            Edit Profile
          </Button>
        </div>
      )}
    </div>
  );
}
