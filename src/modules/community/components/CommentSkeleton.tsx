import React from 'react';

import { Box } from '@mui/system';
import { Skeleton } from '@mui/material';

const CommentSkeleton = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', marginTop: 1.5, marginBottom: 1.5 }}>
      <Skeleton variant="circular" width={40} height={40} />
      <Box sx={{ marginLeft: 1, width: '100%' }}>
        <Box
          sx={{
            background: '#F3F3F5',
            borderRadius: 2,
            padding: 1,
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Skeleton variant="text" width={'20%'} sx={{ fontSize: '1.25rem' }} />
            <Skeleton variant="text" width={'80%'} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CommentSkeleton;
