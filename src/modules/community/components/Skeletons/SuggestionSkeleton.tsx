import React from 'react';
import { Box } from '@mui/system';
import { Skeleton } from '@mui/material';
import { FollowUserStyles } from '~/modules/_core/styles/FollowUserStyles';

const SuggestionSkeleton = () => {
  const dummyDataForSkeleton = [1, 1, 1];

  return (
    <Box sx={FollowUserStyles?.suggestionContainer}>
      <Skeleton variant="text" width={150} sx={FollowUserStyles?.followUserContainerSuggestionTitle} />
      <Box sx={FollowUserStyles?.followUserContainerSuggestion}>
        {dummyDataForSkeleton?.map((item, idx) => {
          return (
            <Box sx={FollowUserStyles?.photoAndNameContainerSuggestion} key={idx}>
              <Skeleton variant="circular" height={72} width={72} />
              <Box sx={FollowUserStyles?.skeletonNameNbuttonSuggestion}>
                <Skeleton variant="text" width={100} />
                <Skeleton variant="rectangular" width={100} height={24} sx={{ mt: 2 }} />
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default SuggestionSkeleton;
