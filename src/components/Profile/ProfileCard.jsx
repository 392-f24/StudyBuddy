import React from 'react';

import { useCopyToClipboard } from '@hooks/utils/useCopyToClipboard';
import { Avatar, Box, Card, CardContent, CardHeader, Modal, Typography } from '@mui/material';
import { useTheme, lighten } from '@mui/system';

export default function ProfileCard({ profileData, open, onClose }) {
  const theme = useTheme();
  const { handleCopyToClipboard, SnackbarComponent } = useCopyToClipboard();

  // Helper function to render profile details fields with better styling
  const renderProfileDetail = (label, value, isCopyable = false) => (
    <Box sx={{ mb: 1 }}>
      <Typography
        variant="subtitle2"
        color="textPrimary"
        sx={{ display: 'inline', fontWeight: 500 }}
      >
        {label}:
      </Typography>{' '}
      <Typography
        variant="body1"
        sx={{
          display: 'inline',
          color: theme.palette.text.secondary,
          textDecoration: isCopyable ? 'underline' : 'none',
        }}
        onClick={() => isCopyable && value && handleCopyToClipboard(value)}
      >
        {value || 'N/A'}
      </Typography>
    </Box>
  );

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="profile-modal-title"
        aria-describedby="profile-modal-description"
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 2 }}
      >
        <Card
          sx={{
            backgroundColor: lighten(theme.palette.primary.light, 0.8),
            borderRadius: 2,
            width: '100%',
            maxWidth: 500,
            boxShadow: 3,
            overflow: 'hidden',
            paddingY: 1,
            paddingX: 3,
          }}
        >
          <CardHeader
            avatar={
              <Avatar
                sx={{ width: 56, height: 56 }}
                src={profileData?.profilePic || ''}
                alt={profileData?.name || 'Profile Picture'}
              >
                {profileData?.name?.[0] || ''}
              </Avatar>
            }
            title={
              <Typography variant="h5" fontWeight="600">
                {profileData?.name || 'Unknown User'}
              </Typography>
            }
          />
          <CardContent sx={{ padding: 2 }}>
            {renderProfileDetail('Email', profileData?.email, true)}
            {renderProfileDetail('Phone Number', profileData?.phoneNumber, true)}
            {renderProfileDetail('Major', profileData?.major)}
            {renderProfileDetail('Year', profileData?.year)}
            {renderProfileDetail('Bio', profileData?.description)}
          </CardContent>
        </Card>
      </Modal>

      {/* Snackbar for copy confirmation */}
      <SnackbarComponent />
    </>
  );
}
