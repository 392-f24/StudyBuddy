import { useEffect } from 'react';

import { Box } from '@mui/material';

import GroupsList from './GroupsList';

export default function HomePage({ user }) {
  return (
    <Box>
      <h1 style={{ textAlign: 'center' }}>Groups</h1>
      <GroupsList user={user} />
    </Box>
  );
}
