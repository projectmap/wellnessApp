import React from 'react';
import { Box } from '@mui/system';
import { Skeleton } from '@mui/material';

export default function ChatHeaderSkeleton() {
  return (
    <Box sx={{ display: 'flex', py: '18px', paddingX: 2, alignItems: 'center', borderBottom: '1px solid #E7E7EB' }}>
      <Skeleton variant="circular" width={'48px'} height={'48px'} sx={{ mr: 1.3 }} />
      <Box>
        <Skeleton variant="text" width={100} />
        <Skeleton variant="text" width={100} />
      </Box>
    </Box>
  );
}
