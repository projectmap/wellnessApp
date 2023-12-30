import React from 'react';
import { Box } from '@mui/system';
import { Skeleton } from '@mui/material';

export default function MessageSentByUserSkeleton() {
  return (
    <Box sx={{ mb: '6px', display: 'flex', justifyContent: 'flex-end' }}>
      <Skeleton variant="text" width={100} height={60} sx={{ borderRadius: 2 }} />
    </Box>
  );
}
