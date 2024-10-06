import { useEffect, useState } from 'react';

import { Box, Stack, Typography } from '@mui/material';
import { format } from 'date-fns';

import GroupCard from './GroupCard';
import { useAuthState } from '../utils/firebase';
import {
  getOpenGroups,
  getUserProfile,
  getOutgoingRequests,
  requestToJoinGroup,
} from '../utils/firestore'; // Import necessary functions

export default function GroupsList() {
  const [user, error] = useAuthState();

  const [openGroups, setOpenGroups] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);

  useEffect(() => {
    const fetchOpenGroups = async () => {
      try {
        setOpenGroups([]);
        setOutgoingRequests([]);

        const groups = await getOpenGroups();
        const filteredGroups = user
          ? groups.filter((group) => {
              group.owner !== user.uid;
            })
          : groups;

        const groupsWithOwnerDetails = await Promise.all(
          filteredGroups.map(async (group) => {
            const ownerProfile = await getUserProfile(group.owner);
            return {
              ...group,
              ownerName: ownerProfile.name,
              profilePic: ownerProfile.profilePic,
            };
          }),
        );

        setOpenGroups(groupsWithOwnerDetails);

        // Fetch outgoing requests if the user is logged in
        if (user) {
          const requests = await getOutgoingRequests(user.uid);
          setOutgoingRequests(requests || []); // Ensure it's an object
        }
      } catch (error) {
        console.error('Error fetching open groups:', error);
      }
    };

    fetchOpenGroups();
  }, [user]);

  const handleJoinGroup = async (groupId) => {
    try {
      if (user) {
        await requestToJoinGroup(groupId, user.uid);
        // Update the local state to reflect the request
        setOutgoingRequests((prev) => ({ ...prev, [groupId]: true }));
      }
    } catch (error) {
      console.error('Error requesting to join group:', error);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Stack spacing={2}>
        {openGroups.length > 0 ? (
          openGroups.map((group) => {
            const meetingTime = format(new Date(group.meetingTime.seconds * 1000), 'h:mm a');
            const subtext = `${group.meetingLocation} @ ${meetingTime}`;
            const isRequested = outgoingRequests.includes(group.id);

            return (
              <GroupCard
                key={group.id}
                id={group.id}
                name={group.ownerName || 'Unnamed Group'}
                subtext={subtext}
                profilePic={group.profilePic}
                bodyText={group.description || 'No description available'}
                requested={isRequested}
                onJoin={() => handleJoinGroup(group.id)}
              />
            );
          })
        ) : (
          <Typography variant="h6" color="text.secondary">
            No open groups available.
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
