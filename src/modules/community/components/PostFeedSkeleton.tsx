import React from 'react';

import { Skeleton } from '@mui/material';
import { Box, Stack } from '@mui/system';

import { Card } from '~/modules/_core/bits/cards';

const PostFeedSkeleton = () => {
  return (
    <Card cardSxProps={{ border: '1px solid #F4F5FC', boxShadow: '0px 6px 18px 2px #0000000A' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', mb: 2 }}>
          <Skeleton variant="circular" width={48} height={48} />
          <Stack sx={{ pl: 1.5 }}>
            <Skeleton variant="text" width={200} />
            <Skeleton variant="text" width={100} />
          </Stack>
        </Box>
      </Box>
      <Skeleton variant="text" width={'70%'} />

      <Box
        sx={{
          height: '350px',
          width: '700px',
          borderRadius: '4px',
          border: '2px solid #f5f8ff',
          padding: '1rem',
          marginTop: '1rem',
        }}
      >
        <Skeleton variant="rounded" width={'100%'} height={'100%'} />
      </Box>

      <Box component="div" sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Skeleton variant="text" width={100} />
        <Skeleton variant="text" width={100} />
        <Skeleton variant="text" width={100} />
      </Box>
    </Card>
  );
};

export default PostFeedSkeleton;
