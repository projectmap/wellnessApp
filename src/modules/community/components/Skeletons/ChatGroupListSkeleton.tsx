import React from 'react';
import { Box } from '@mui/system';
import { Skeleton } from '@mui/material';

export default function ChatGroupListSkeleton() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', py: '18px', paddingX: 2, alignItems: 'center' }}>
        <Skeleton variant="circular" width={'48px'} height={'48px'} sx={{ mr: 1.3 }} />
        <Box>
          <Skeleton variant="text" width={100} />
          <Skeleton variant="text" width={100} />
        </Box>
      </Box>
      <Skeleton variant="text" width={25} />
    </Box>
  );
}
