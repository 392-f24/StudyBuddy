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
  getIncomingRequests,
} from '../utils/firestore';

export default function GroupsList({
  filter,
  emtpyMessage = 'No groups available',
  joinable = true,
}) {
  if (filter == undefined) {
    filter = () => true;
  }

  const [user] = useAuthState();

  const [openGroups, setOpenGroups] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);

  useEffect(() => {
    setOpenGroups([]);
    setOutgoingRequests([]);

    if (!user) {
      return;
    }

    const fetchOpenGroups = async () => {
      try {
        setOpenGroups([]);
        setOutgoingRequests([]);

        const outgoing = await getOutgoingRequests(user.uid);
        setOutgoingRequests(outgoing || []);

        const incoming = await getIncomingRequests(user.uid);

        const groups = await getOpenGroups();
        let filteredGroups = groups.filter((group) => {
          return filter(group, user, outgoing, incoming);
        });

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
        setOutgoingRequests((prev) => [...prev, groupId]);
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
                joinable={joinable}
              />
            );
          })
        ) : (
          <Typography variant="h6" color="text.secondary">
            {emtpyMessage}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
