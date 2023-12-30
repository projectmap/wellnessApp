import React from 'react';

import { Box } from '@mui/system';
import { Grid, Paper, Stack, Typography } from '@mui/material';
import { useGetCurrentUserEnrolledCourseByCourseIdQuery } from '@newstart-online/sdk';

import { getDurationHMS } from '~/utils/getDurationHMS';
import { SessionsCountGreen, TimeIconYellow } from '~/icons';

const CourseStats: React.FC<{
  sessionCount: number;
  courseId: string;
}> = ({ sessionCount, courseId }) => {
  const { data: courseStats } = useGetCurrentUserEnrolledCourseByCourseIdQuery(courseId, { skip: !courseId });
  const courseDurationsHMS = courseStats?.data?.hoursCompleted
    ? getDurationHMS(parseInt(courseStats?.data?.hoursCompleted, 10))
    : 0;

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6">Your course stats</Typography>
      <Box>
        <Grid container xs={7} sx={{ mt: '23px', pb: '20px' }}>
          <Grid item xs={5}>
            <Paper
              elevation={0}
              sx={{ background: '#FFFF', borderRadius: '4px', border: '1px solid #27AE60', p: '29px 27px' }}
            >
              <Stack spacing={'26px'}>
                <SessionsCountGreen />
                <Box component="div">
                  <Stack direction="row">
                    <Typography variant="h5">{courseStats?.data?.completedSessionCount ?? 0}</Typography>
                    <Typography variant="h5" sx={{ opacity: '0.5' }}>
                      /{sessionCount}
                    </Typography>
                  </Stack>
                  <Typography variant="subtitle2" sx={{ pt: 1 }}>
                    Sessions completed
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper
              elevation={0}
              sx={{ background: '#FFFF', borderRadius: '4px', border: '1px solid #FDE078', p: '29px 27px', ml: '24px' }}
            >
              <Stack spacing={'26px'}>
                <TimeIconYellow />

                <Box component="div">
                  <Stack direction="row">
                    <Typography variant="h5">
                      {courseDurationsHMS ? (
                        <>
                          {courseDurationsHMS?.hour}
                          {courseDurationsHMS?.min}
                          {courseDurationsHMS?.sec}
                        </>
                      ) : (
                        0
                      )}
                    </Typography>
                  </Stack>
                  <Typography variant="subtitle2" sx={{ pt: 1 }}>
                    Hours completed
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export { CourseStats };
