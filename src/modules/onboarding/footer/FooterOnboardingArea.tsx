import React from 'react';
import { Box } from '@mui/system';
import { Link } from '@mui/material';
import { Typography } from '@mui/material';

export const FooterOnboarding = () => {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box component="div" sx={{ display: 'flex', justifyContent: 'space-between', width: 'fit-content' }}>
          <Box sx={{ pr: 6 }}>
            <Link href="/terms-and-conditions" sx={{ textDecoration: 'none', color: '#131336' }}>
              <Typography variant="body1">Terms & Conditions</Typography>
            </Link>
          </Box>
          <Box sx={{ pr: 6 }}>
            <Link href="/privacy-policy" sx={{ textDecoration: 'none', color: '#131336' }}>
              <Typography variant="body1">Privacy Policy</Typography>
            </Link>
          </Box>
          <Box sx={{ pr: 6 }}>
            <Link href="/help" sx={{ textDecoration: 'none', color: '#131336' }}>
              <Typography variant="body1">Help</Typography>
            </Link>
          </Box>
        </Box>
      </Box>
    </>
  );
};
