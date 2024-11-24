import React from 'react';

import { useAuthNavigation } from '@auth/useAuthNavigation';
import { ArrowBack } from '@mui/icons-material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Button, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header({ onFilterToggle, isFilterOpen, showFilter }) {
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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {showFilter && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={onFilterToggle}
              sx={{ marginRight: 1 }}
            >
              <FilterAltIcon color={isFilterOpen ? 'secondary' : 'inherit'} />
            </IconButton>
          )}
          {!isRootPage ? (
            <IconButton edge="start" color="inherit" onClick={handleBackButtonClick}>
              <ArrowBack />
            </IconButton>
          ) : (
            <Box sx={{ width: '48px' }} /> // Placeholder if no back button is needed
          )}
        </Box>

        <Typography
          variant="h6"
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            fontWeight: '600',
            fontSize: '1.4rem',
          }}
          data-cy="title"
        >
          StudyBuddy
        </Typography>

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
