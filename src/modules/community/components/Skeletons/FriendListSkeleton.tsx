import React from 'react';
import { Box } from '@mui/system';
import { Skeleton } from '@mui/material';
import { FollowUserStyles } from '~/modules/_core/styles/FollowUserStyles';

const FriendListSkeleton = () => {
  const dummyDataForSkeleton = [1, 1, 1, 1];

  return (
    <Box sx={FollowUserStyles?.followUserContainer}>
      <Skeleton variant="text" width={100} />
      <Box sx={FollowUserStyles?.skeletonListContainer}>
        {dummyDataForSkeleton?.map((item, idx) => {
          return (
            <Box sx={FollowUserStyles?.photoAndNameContainer} key={idx}>
              <Skeleton variant="circular" height={72} width={72} />
              <Box sx={FollowUserStyles?.skeletonNameNbutton}>
                <Skeleton variant="text" width={100} />
                <Skeleton variant="rectangular" width={100} height={24} sx={{ mt: 2 }} />
              </Box>
            </Box>
          );
        })}
      </Box>
      <Box sx={FollowUserStyles?.buttonContainer}>
        <Skeleton variant="text" width={40} />
      </Box>
    </Box>
  );
};

export default FriendListSkeleton;
