import { useState, useEffect } from 'react';

import { useAuthState } from '@auth/useAuthState';
import ProfileCard from '@components/Profile/ProfileCard';
import StudentCard from '@components/Profile/UserCard';
import useUserProfile from '@data/useUserProfile';
import {
  resolveMatchRequest,
  getUserMatches,
  removeMatch,
  getMatchedUserUids,
} from '@firestore/matches';
import { fetchUserProfile } from '@firestore/userProfile';
import { Box, Stack, Typography } from '@mui/material';

function GroupsPage() {
  const [user] = useAuthState();
  const { userProfile, loading } = useUserProfile(user);
  const [incomingRequestProfiles, setIncomingRequestProfiles] = useState([]);
  const [outgoingRequestProfiles, setOutgoingRequestProfiles] = useState([]);
  const [matchProfiles, setMatchProfiles] = useState([]);
  // State for selected user profile
  const [selectedProfile, setSelectedProfile] = useState(null);
  // State for modal visibility
  const [openProfileModal, setOpenProfileModal] = useState(false);
  // Modal visibility state
  const [openAvailabilityModal, setOpenAvailabilityModal] = useState(false);
  // State to store time preferences
  const [selectedTimePreferences, setSelectedTimePreferences] = useState([]);


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

  const handleRemoveMatch = async (profile) => {
    try {
      // Get the matched user IDs for the current user
      const matchedUserUids = await getMatchedUserUids(userProfile.uid);

      // Check if this profile is one of the matches
      const sharedMatchId = profile.currentMatches.find((matchId) =>
        matchedUserUids.includes(profile.uid),
      );

      if (!sharedMatchId) {
        console.error('Match not found for the given profile');
        return;
      }

      await removeMatch(sharedMatchId);

      // Update the matchProfiles state by filtering out the removed match
      setMatchProfiles((prevProfiles) =>
        prevProfiles.filter((matchProfile) => matchProfile.uid !== profile.uid),
      );
    } catch (error) {
      console.error('Error handling match removal:', error);
    }
  };

  const handleOpenProfileModal = (profile) => {
    setSelectedProfile(profile);
    setOpenProfileModal(true);
  };

  const handleCloseProfileModal = () => {
    setOpenProfileModal(false);
  };

  const handleOpenAvailabilityModal = async (userId) => {
    try {
      const { profile } = await fetchUserProfile(userId); // Fetch user profile for the matched user
      const fetchedTimes = profile?.timePreferences || []; // Extract time preferences
      setSelectedTimePreferences(fetchedTimes); // Set the fetched time preferences in state
      setOpenAvailabilityModal(true); // Open the modal
    } catch (err) {
      console.error('Failed to load time preferences', err);
    }
  };

  const handleCloseAvailabilityModal = () => {
    setOpenAvailabilityModal(false); // Close the modal
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
              {
<<<<<<< HEAD
                label: 'Unmatch',
                onClick: () => handleRemoveMatch(profile),
                variant: 'outlined',
                color: 'secondary',
=======
                label: 'View Availability', // New button for viewing time preferences
                onClick: () => handleOpenAvailabilityModal(profile.uid), // We'll define this function below
>>>>>>> bea9a87 (testing view time availability)
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
                onClick: () => { }, // No functionality
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
      <Modal
        open={openAvailabilityModal}
        onClose={handleCloseAvailabilityModal}
        aria-labelledby="time-preferences-modal"
        aria-describedby="time-preferences-description"
      >
        <Box sx={{ ...modalStyle }}>
          <Typography id="time-preferences-modal" variant="h6" component="h2">
            Time Preferences
          </Typography>
          {selectedTimePreferences.length > 0 ? (
            <ul>
              {selectedTimePreferences.map((time, index) => (
                <li key={index}>{time}</li>
              ))}
            </ul>
          ) : (
            <Typography>No time preferences available.</Typography>
          )}
          <Button onClick={handleCloseAvailabilityModal}>Close</Button>
        </Box>
      </Modal>

    </Box>
  );
}

export default GroupsPage;
