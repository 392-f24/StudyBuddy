import React, { useState } from 'react';

import useUserProfile from '@data/useUserProfile';
import { Email, Phone, School, CalendarToday, ListAlt } from '@mui/icons-material';
import {
  Avatar,
  Typography,
  Divider,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  useTheme,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

import SignOutDialog from './SignOutDialog';

export default function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userProfile: profileData, loading } = useUserProfile({ uid: id });
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);

  const handleEditClick = () => {
    navigate('/edit-profile');
  };

  const handleSignOutDialogOpen = () => {
    setSignOutDialogOpen(true);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ maxWidth: 700, margin: 'auto', padding: 1.5 }}>
      <ProfileHeader name={profileData?.name} profilePic={profileData?.profilePic} />

      <InfoSection title="Contact Info">
        <ContentBox icon={Email} title="Email" content={profileData?.email} />
        <CustomDivider />
        <ContentBox icon={Phone} title="Phone" content={profileData?.phoneNumber} />
      </InfoSection>

      <InfoSection title="Bio">
        <Typography variant="body2" color="textSecondary">
          {profileData?.description}
        </Typography>
      </InfoSection>

      <InfoSection title="Study Info">
        <ContentBox icon={CalendarToday} title="Year" content={profileData?.year} />
        <CustomDivider />
        <ContentBox icon={School} title="Major" content={profileData?.major} />
        <CustomDivider />
        <ContentBox icon={ListAlt} title="Courses" content={profileData?.listOfCourses} isCourses />
      </InfoSection>

      <ActionButtons onEditClick={handleEditClick} onSignOutClick={handleSignOutDialogOpen} />

      <SignOutDialog open={signOutDialogOpen} onClose={() => setSignOutDialogOpen(false)} />
    </Box>
  );
}

const ProfileHeader = ({ name, profilePic }) => {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', mb: 4 }}>
      <Avatar
        sx={{ width: 100, height: 100, bgcolor: theme.palette.primary.main, mb: 2 }}
        src={profilePic || ''}
        alt={name}
      >
        {name?.[0]}
      </Avatar>
      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
        {name}
      </Typography>
    </Box>
  );
};

const InfoSection = ({ title, children }) => (
  <>
    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
      {title}
    </Typography>
    <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
      <CardContent>{children}</CardContent>
    </Card>
  </>
);

const ContentBox = ({ icon: IconComponent, title, content, isCourses = false }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <IconComponent sx={{ mr: 1, color: 'grey.600' }} />
      <Typography variant="body2" color="textSecondary" sx={{ mr: 1 }}>
        {title}
      </Typography>
    </Box>
    {isCourses && Array.isArray(content) ? (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {content.map((course, index) => (
          <Chip key={index} label={course} />
        ))}
      </Box>
    ) : (
      <Typography variant="body2">{content}</Typography>
    )}
  </Box>
);

const CustomDivider = () => <Divider sx={{ my: 1 }} />;

const ActionButtons = ({ onEditClick, onSignOutClick }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center',
      mt: 4,
    }}
  >
    <Button variant="contained" onClick={onEditClick} sx={{ mb: 2, width: '150px' }}>
      Edit Profile
    </Button>
    <Button
      variant="contained"
      color="secondary"
      sx={{ width: '150px', backgroundColor: 'secondary.main' }}
      onClick={onSignOutClick}
    >
      Sign Out
    </Button>
  </Box>
);
