import React from 'react';
import { Box } from '@mui/system';
import { Skeleton } from '@mui/material';

export default function MessageLogSkeleton() {
  return (
    <Box sx={{ mb: '6px', display: 'flex', justifyContent: 'center', alignItems: 'center', mt: '6px' }}>
      <Skeleton variant="text" width={80} height={21} />
    </Box>
  );
}
