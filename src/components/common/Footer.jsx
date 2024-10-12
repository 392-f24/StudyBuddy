import React from 'react';

import GroupsIcon from '@mui/icons-material/Groups';
import HomeIcon from '@mui/icons-material/Home';
import { Box, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { navigateToPage } from '@utils/navigateToPage';
import { useNavigate } from 'react-router-dom';

// import MessageIcon from '@mui/icons-material/Message';

export default function Footer({ currentPage, setCurrentPage }) {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box className="footer">
      <BottomNavigation
        showLabels
        value={currentPage}
        onChange={(event, newValue) => {
          setCurrentPage(newValue);
          navigateToPage(navigate, newValue);
        }}
        sx={{ backgroundColor: theme.palette.primary.light }}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Matches" icon={<GroupsIcon />} />
        {/* <BottomNavigationAction label="Messages" icon={<MessageIcon />} /> */}
      </BottomNavigation>
    </Box>
  );
}
