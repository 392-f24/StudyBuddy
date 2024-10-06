import { Box } from '@mui/material';

import GroupsList from '../components/GroupsList';

export default function HomePage() {
  return (
    <Box>
      <GroupsList
        filter={(group, user) => {
          return group.owner !== user.uid;
        }}
        emtpyMessage="No open groups available."
      />
    </Box>
  );
}
