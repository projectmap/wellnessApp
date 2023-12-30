import React from 'react';
import { Box } from '@mui/system';
import { Skeleton } from '@mui/material';
import { LearnTodayStyles } from '~/modules/learn/styles/LearnTodayStyles';

const LearnTodaySkeleton = () => {
  const dummyDataForSkeleton = [1, 1, 1, 1];

  return (
    <Box maxWidth="xl" sx={LearnTodayStyles?.learnTodaySkeletonOutermost}>
      <Skeleton variant="text" width={100} sx={LearnTodayStyles?.cardSkeletonTitle} />
      <Box sx={LearnTodayStyles?.skeletonOptionContainer}>
        {dummyDataForSkeleton.map((item, index) => (
          <Skeleton key={index} variant="rectangular" sx={LearnTodayStyles?.skeletonOptions} />
        ))}
      </Box>

      {dummyDataForSkeleton?.map((item, idx) => {
        return (
          <Box key={idx}>
            <Skeleton variant="text" width={100} sx={LearnTodayStyles?.cardSkeletonTitle} />
            <Box sx={LearnTodayStyles?.recipesCardContainerSkeleton}>
              {dummyDataForSkeleton?.map((item, idx) => {
                return (
                  <Box sx={LearnTodayStyles?.recipesCardSkeleton} key={idx}>
                    <Skeleton variant="rectangular" width="100%" sx={LearnTodayStyles?.cardSkeletonPhoto} />
                    <Skeleton variant="text" width="60%" sx={LearnTodayStyles?.cardSkeletonText} />
                    <Skeleton variant="text" width="50%" sx={LearnTodayStyles?.cardSkeletonText} />
                  </Box>
                );
              })}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default LearnTodaySkeleton;
