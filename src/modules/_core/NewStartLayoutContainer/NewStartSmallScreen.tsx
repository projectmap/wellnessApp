import React from 'react';
import { Logo } from '~/icons';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import { PrimaryButton } from '../bits/buttons/PrimaryButton';

export default function NewStartSmallScreen() {
  return (
    <Box
      className="BgWrapperSmallScreen"
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: '240px',
          height: 'fit-content',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: '120px',
        }}
      >
        <Logo />
        <Typography variant="subtitle1" sx={{ mt: '96px', mb: '8px', fontWeight: 700 }}>
          Download the NEWSTART app
        </Typography>
        <Typography variant="subtitle2" sx={{ textAlign: 'center' }}>
          For a better user experience, download our mobile app.
        </Typography>
        <PrimaryButton sx={{ borderRadius: '100px', mt: '8px', p: '10px 24px' }}>Coming Soon!</PrimaryButton>
      </Box>
    </Box>
  );
}
