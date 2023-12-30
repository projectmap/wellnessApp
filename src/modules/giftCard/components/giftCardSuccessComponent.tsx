import React from 'react';
import Link from 'next/link';
import { Logo } from '~/icons';
import { Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import { CommunityFooterLinks } from '~/modules/community/CommunityFooterLinks';

export default function GiftCardSuccessComponent() {
  return (
    <Box className="BGforGiftCard">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          maxWidth: 'xl',
          paddingLeft: '137px',
          paddingTop: '48px',
          height: '100vh',
        }}
      >
        <Box>
          <Link href="/">
            <Box sx={{ cursor: 'pointer' }}>
              <Logo />
            </Box>
          </Link>
          <Box sx={{ width: '495px', mt: '120px' }}>
            <Typography sx={{ mb: '12px' }} variant="h5">
              Thank you!
            </Typography>
            <Typography variant="body1">
              {` Thank you for your purchase! We have sent the gift certificate code to the recipient's email. We hope you
            and your recipient enjoy the journey toward a healthier lifestyle.`}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mt: '32px' }}>
          <CommunityFooterLinks />
        </Box>
      </Box>
    </Box>
  );
}
