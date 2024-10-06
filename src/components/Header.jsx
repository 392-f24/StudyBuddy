import * as React from 'react';

import { AppBar, Toolbar, Typography, IconButton, Avatar, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { useAuthState, handleSignIn, handleSignOut } from '../utils/firebase'; // Firebase functions

export default function Header() {
  const [user] = useAuthState();
  const navigate = useNavigate(); // Initialize the navigate hook

  const handleProfileClick = () => {
    if (user) {
      navigate(`/profile/${user.uid}`); // Navigate to the profile page with the user's uid
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#f5f5f5', color: '#000' }}>
      <Toolbar>
        {/* App Name */}
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          StudyBuddy
        </Typography>

        {/* Conditional rendering for user authentication */}
        {user ? (
          <>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleSignOut} // Navigate to profile page on click
            >
              <Avatar alt={user.displayName} src={user.photoURL} />
            </IconButton>
          </>
        ) : (
          <Button color="inherit" onClick={handleSignIn}>
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
