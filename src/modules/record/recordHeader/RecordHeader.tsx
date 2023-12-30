import React from 'react';
import { Box, Container, Typography } from '@mui/material';

export const RecordHeader = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        pt: 1,
        pb: 1,
        borderBottom: '0.5px solid  #D0D0D7',
        background: '#fff',
        paddingLeft: '11px',
      }}
    >
      <Container maxWidth="xl">
        <Typography variant="h5">Record</Typography>
      </Container>
    </Box>
  );
};
