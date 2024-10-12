import { useState, useEffect } from 'react';

import { useAuthState } from '@auth/useAuthState';
import ProfileCard from '@components/Profile/ProfileCard';
import StudentCard from '@components/Profile/UserCard';
import useUserProfile from '@data/useUserProfile';
import { resolveMatchRequest, getUserMatches } from '@firestore/matches';
import { fetchUserProfile } from '@firestore/userProfile';
import { Box, Stack, Typography } from '@mui/material';

function GroupsPage() {
  const [user] = useAuthState();
  const { userProfile, loading } = useUserProfile(user);
  const [incomingRequestProfiles, setIncomingRequestProfiles] = useState([]);
  const [outgoingRequestProfiles, setOutgoingRequestProfiles] = useState([]);
  const [matchProfiles, setMatchProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null); // State for selected user profile
  const [openProfileModal, setOpenProfileModal] = useState(false); // State for modal visibility

  // Combined useEffect for fetching incoming, outgoing, and current matches
  useEffect(() => {
    const fetchRequestProfiles = async () => {
      if (!userProfile) return;

      try {
        // Fetch incoming request profiles
        const incomingProfilesPromise = Promise.all(
          (userProfile.incomingMatches || []).map(async (req) => {
            const { profile } = await fetchUserProfile(req.requestingUser);
            return { ...profile, matchId: req.matchId };
          }),
        );

        // Fetch outgoing request profiles
        const outgoingProfilesPromise = Promise.all(
          (userProfile.outgoingMatches || []).map(async (req) => {
            const { profile } = await fetchUserProfile(req.requestedUser);
            return profile;
          }),
        );

        // Fetch current match profiles
        const matchProfilesPromise = getUserMatches(userProfile.uid);

        // Wait for all profiles to be fetched
        const [incomingProfiles, outgoingProfiles, matches] = await Promise.all([
          incomingProfilesPromise,
          outgoingProfilesPromise,
          matchProfilesPromise,
        ]);

        setIncomingRequestProfiles(incomingProfiles);
        setOutgoingRequestProfiles(outgoingProfiles);
        setMatchProfiles(matches);
      } catch (error) {
        console.error('Error fetching request profiles:', error);
      }
    };

    fetchRequestProfiles();
  }, [userProfile]);

  const handleRequestResolution = async (requestingUserUid, matchId, accept) => {
    try {
      await resolveMatchRequest(userProfile.uid, requestingUserUid, matchId, accept);
      // Update the UI after resolving the request
      setIncomingRequestProfiles((prevProfiles) =>
        prevProfiles.filter((profile) => profile.matchId !== matchId),
      );
      setMatchProfiles((prevProfiles) =>
        prevProfiles.filter((profile) => profile.uid !== requestingUserUid),
      );
    } catch (error) {
      console.error(`Error ${accept ? 'accepting' : 'denying'} request:`, error);
    }
  };

  const handleOpenProfileModal = (profile) => {
    setSelectedProfile(profile);
    setOpenProfileModal(true);
  };

  const handleCloseProfileModal = () => {
    setOpenProfileModal(false);
  };

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  if (!user) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Please log in to view your groups.
        </Typography>
      </Box>
    );
  }

  // Render the StudentFilter and StudentList only if the userProfile is complete
  if (!userProfile || !userProfile.major || !userProfile.year || !userProfile.phoneNumber) {
    return null;
  }

  return (
    <Box>
      <h1>Matches</h1>
      <Stack spacing={2}>
        {matchProfiles.length > 0 ? (
          matchProfiles.map((profile, index) => {
            const actions = [
              {
                label: 'View Profile',
                onClick: () => handleOpenProfileModal(profile),
              },
            ];
            return <StudentCard key={index} studentUserProfile={profile} actions={actions} />;
          })
        ) : (
          <Typography variant="body1" color="textSecondary">
            You don't currently have any matches.
          </Typography>
        )}
      </Stack>

      <h1>Incoming Requests</h1>
      <Stack spacing={2}>
        {incomingRequestProfiles.length > 0 ? (
          incomingRequestProfiles.map((profile, index) => {
            const actions = [
              {
                label: 'Accept',
                onClick: () => handleRequestResolution(profile.uid, profile.matchId, true),
              },
              {
                label: 'Deny',
                onClick: () => handleRequestResolution(profile.uid, profile.matchId, false),
                variant: 'outlined',
                color: 'secondary',
              },
            ];
            return <StudentCard key={index} studentUserProfile={profile} actions={actions} />;
          })
        ) : (
          <Typography variant="body1" color="textSecondary">
            You don't have any incoming requests.
          </Typography>
        )}
      </Stack>

      <h1>Outgoing Requests</h1>
      <Stack spacing={2}>
        {outgoingRequestProfiles.length > 0 ? (
          outgoingRequestProfiles.map((profile, index) => {
            const actions = [
              {
                label: 'Requested',
                variant: 'outlined',
                color: 'default',
                onClick: () => {}, // No functionality
              },
            ];
            return <StudentCard key={index} studentUserProfile={profile} actions={actions} />;
          })
        ) : (
          <Typography variant="body1" color="textSecondary">
            You don't have any outgoing requests.
          </Typography>
        )}
      </Stack>

      {/* Modal for displaying the selected profile */}
      <ProfileCard
        profileData={selectedProfile}
        open={openProfileModal}
        onClose={handleCloseProfileModal}
      />
    </Box>
  );
}

export default GroupsPage;
