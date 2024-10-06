import { useEffect, useState } from 'react';

import { Box, Stack, Typography } from '@mui/material';
import { format } from 'date-fns'; // Import date-fns for formatting

import GroupCard from './GroupCard';
import { getOpenGroups, getUserProfile } from '../utils/firestore'; // Make sure to import getUserProfile

export default function GroupsList({ user }) {
  const [openGroups, setOpenGroups] = useState([]);

  useEffect(() => {
    const fetchOpenGroups = async () => {
      try {
        setOpenGroups([]);

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
      } catch (error) {
        console.error('Error fetching open groups:', error);
      }
    };

    fetchOpenGroups();
  }, [user]);

  return (
    <Box sx={{ padding: 2, display: 'flex', justifyContent: 'center' }}>
      <Stack spacing={2} sx={{ width: '100%', maxWidth: 600 }}>
        {openGroups.length > 0 ? (
          openGroups.map((group) => {
            const meetingTime = format(new Date(group.meetingTime.seconds * 1000), 'h:mm a');
            const subtext = `${group.meetingLocation} @ ${meetingTime}`;

            return (
              <GroupCard
                key={group.id}
                name={group.ownerName || 'Unnamed Group'}
                subtext={subtext}
                profilePic={group.profilePic}
                bodyText={group.description || 'No description available'}
                actions={[
                  { label: 'Join', onClick: () => console.log(`Join ${group.ownerName} clicked`) },
                ]}
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
