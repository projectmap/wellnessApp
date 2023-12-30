import React from 'react';
import { Box } from '@mui/system';
import { Container, Grid, Skeleton } from '@mui/material';

import { CourseStyles } from '~/modules/learn/styles/LearnCourseStyles';

const LearnCourseSkeleton = () => {
  const dummyDataForSkeleton = [1, 1, 1, 1];

  return (
    <Container maxWidth="xl" sx={CourseStyles?.courseContainer}>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <Skeleton variant="rectangular" height={660} />
          <Box sx={CourseStyles?.courseSkeletonVideo}>
            <Box sx={CourseStyles?.courseSkeletonTab}>
              {dummyDataForSkeleton?.map((item, idx) => {
                return (
                  <Skeleton variant="text" width={100} height={32} sx={CourseStyles?.fontSizeSkeleton14} key={idx} />
                );
              })}
            </Box>
            <Box>
              <Skeleton variant="text" width={150} height={32} sx={CourseStyles?.courseSkeletonTabTitle} />
              <Skeleton variant="rectangular" width="100%" height={200} />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Skeleton variant="rectangular" height={200} sx={CourseStyles?.courseSkeletonAccordion} />
          {dummyDataForSkeleton?.map((item, idx) => {
            return (
              <Skeleton variant="rectangular" height={48} sx={CourseStyles?.courseSkeletonAccordionSmall} key={idx} />
            );
          })}
        </Grid>
      </Grid>
    </Container>
  );
};

export default LearnCourseSkeleton;
