import React from 'react';

import { useAuthNavigation } from '@auth/useAuthNavigation';
import { ArrowBack } from '@mui/icons-material';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Button, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
  const { user, handleProfileClick, signInAndCheckFirstTimeUser } = useAuthNavigation();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const isProfilePage = location.pathname.includes('/profile/');
  const isRootPage =
    location.pathname === '/' ||
    location.pathname === '/groups' ||
    location.pathname === '/messages';

  const handleBackButtonClick = () => {
    // If we came from edit-profile or a similar page, navigate home instead of going back.
    if (location.state?.fromEditProfile) {
      navigate('/'); // Redirect to the home page
    } else if (window.history.length > 2) {
      navigate(-1); // Go back to the previous page in the history stack if available
    } else {
      navigate('/'); // Otherwise, redirect to the home page
    }
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: theme.palette.primary.light, color: '#000' }}>
      <Toolbar sx={{ position: 'relative', justifyContent: 'space-between' }}>
        {/* Left side: Back button or placeholder */}
        {!isRootPage ? (
          <IconButton edge="start" color="inherit" onClick={handleBackButtonClick}>
            <ArrowBack />
          </IconButton>
        ) : (
          <Box sx={{ width: '48px' }} />
        )}

        {/* Centered text */}
        <Typography
          variant="h6"
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            fontWeight: '600',
            fontSize: '1.4rem',
          }}
        >
          StudyBuddy
        </Typography>

        {/* Right side: Sign In button or user avatar */}
        {!isProfilePage ? (
          user ? (
            <IconButton edge="end" color="inherit" onClick={handleProfileClick}>
              <Avatar alt={user.displayName} src={user.photoURL} />
            </IconButton>
          ) : (
            <Button color="inherit" onClick={signInAndCheckFirstTimeUser}>
              Sign In
            </Button>
          )
        ) : (
          <Box sx={{ width: '48px' }} />
        )}
      </Toolbar>
    </AppBar>
  );
}
