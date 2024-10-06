import { Box } from '@mui/material';

import GroupsList from '../components/GroupsList';
import { useAuthState } from '../utils/firebase';

export default function GroupsPage() {
  const [user, error] = useAuthState();

  return (
    <>
      {user != undefined ? (
        <Box>
          <h1 style={{ textAlign: 'center' }}>My Groups</h1>
          <GroupsList
            filter={(group, user) => {
              return group.owner == user.uid;
            }}
            joinable={false}
          />

          <h1 style={{ textAlign: 'center' }}>Incoming Requests</h1>
          <GroupsList
            filter={(group, user, outgoing, incoming) => {
              return incoming.some((request) => request.groupId === group.id);
            }}
            joinable={false}
          />

          <h1 style={{ textAlign: 'center' }}>Outgoing Requests</h1>
          <GroupsList
            filter={(group, user, outgoing, incoming) => {
              return outgoing.includes(group.id);
            }}
          />
        </Box>
      ) : (
        <h1>Log in to see your groups.</h1>
      )}
    </>
  );
}
