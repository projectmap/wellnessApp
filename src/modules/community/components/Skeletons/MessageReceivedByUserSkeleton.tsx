import React from 'react';
import { Box } from '@mui/system';
import { Skeleton } from '@mui/material';

export default function MessageReceivedByUserSkeleton() {
  return (
    <Box sx={{ display: 'flex', mt: '6px', paddingX: '18.4px', alignItems: 'center' }}>
      <Skeleton variant="circular" width={'40px'} height={'40px'} sx={{ mr: 1 }} />
      <Box>
        <Skeleton variant="text" width={100} height={60} sx={{ borderRadius: 2, p: 1.5 }} />
      </Box>
    </Box>
  );
}
