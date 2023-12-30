import { Typography, Container, Box, Button } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import { ROUTE } from '~/config/routes';
import { NewstartOnlineFooterLogo } from '~/icons';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: '#0E1238' }}>
      <Container maxWidth="xl" sx={{ pt: '99px', pb: '66px' }}>
        <Box display="flex" gap="25px" justifyContent="space-between">
          <Box width="33%">
            <Box>
              <NewstartOnlineFooterLogo />
            </Box>
            <Typography color="white" sx={{ fontSize: '18px', lineHeight: '28px', marginTop: '28px' }}>
              NEWSTART is a physician monitored, scientifically researched lifestyle change program based on eight
              fundamental principles proven to help you achieve optimum health: Nutrition, Exercise, Water, Sunlight,
              Temperance, Air, Rest and Trust.
            </Typography>
          </Box>

          <Box width="33%">
            <Typography color="white" sx={{ fontSize: '28px' }}>
              Contact Us
            </Typography>
            <ul style={{ color: 'white', marginTop: '32px' }}>
              <li style={{ lineHeight: '44px', fontSize: '20px' }}>+1 (800) 525-9192+1 (530) 422-7955</li>
              <li style={{ lineHeight: '44px', fontSize: '20px' }}>info@newstart.com</li>
              <li style={{ lineHeight: '44px', fontSize: '20px' }}>
                20601 W Paoli Lane, Weimar, CA 95736PO Box 486, Weimar, CA 95736
              </li>
              <li style={{ lineHeight: '44px', fontSize: '20px' }}>NEWSTART ONLINE</li>
              <li style={{ lineHeight: '44px', fontSize: '20px' }}>online@newstart.com</li>
            </ul>
          </Box>

          <Box width="33%">
            <Typography color="white" sx={{ fontSize: '28px' }}>
              NEWSTART Newsletter
            </Typography>
            <Typography sx={{ lineHeight: '28px' }} color="white">
              Monthly tips, testimonies, recipes, and much more.
            </Typography>
            <Box sx={{ marginTop: '32px' }}>
              <input
                placeholder="Email"
                style={{
                  color: '#FFFFFF99',
                  border: '1px solid #FFFFFF99',
                  paddingRight: '8px',
                  paddingLeft: '8px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  borderRadius: '3px',
                  width: '100%',
                }}
              />
            </Box>
            <Button
              sx={{
                color: '#fff',
                backgroundColor: '#4187F7',
                borderRadius: '120px',
                paddingY: '14px',
                paddingX: '24px',
                textTransform: 'unset',
                fontSize: '18px',
                marginY: '30px',
                '&.MuiButtonBase-root:hover': {
                  bgcolor: '#4187F7',
                },
              }}
            >
              Subscribe
            </Button>
          </Box>
        </Box>

        <Typography color="white" marginTop="82px">
          Copyright © 2023 NEWSTART™. All Rights Reserved
        </Typography>

        <Box display="flex" gap="10px">
          <Link href={ROUTE.PRIVACY_POLICY}>
            <Typography color="white" style={{ cursor: 'pointer' }}>
              Privacy and Policy
            </Typography>
          </Link>

          <Link href={ROUTE.TERMS_AND_CONDITIONS}>
            <Typography color="white" style={{ cursor: 'pointer' }}>
              Terms and Conditions
            </Typography>
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
