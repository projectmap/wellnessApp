import React from 'react';
import { Box, Container } from '@mui/system';
import { Stack, Typography } from '@mui/material';
import { LoaderArea } from '../_core/components/loaderPage/LoaderArea';

export const NoPermission = () => {
  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <Stack spacing={3}>
          <LoaderArea />
        </Stack>
      </Box>
    </Container>
  );
};
