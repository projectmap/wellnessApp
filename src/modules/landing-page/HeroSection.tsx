import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Typography } from '@mui/material';

import Button from '@mui/material/Button';
import { NewstartLogoIcon } from '~/icons';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ROUTE } from '~/config/routes';

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

const drawerWidth = 240;
const navItems = ['Home', 'Contact', 'About', 'Program', 'Give Certificate', 'Give'];

export default function HeroSection(props: Props) {
  const router = useRouter();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ bgcolor: '#0E1238', position: 'relative' }}>
      <Box position="absolute" bottom={'-8px'} right="0">
        <Image
          src="/assets/images/homepage/campus-tour.png"
          style={{ border: '1px solid red' }}
          height="455px"
          width="1512"
        />
      </Box>
      <Container maxWidth="xl" sx={{ pt: 4 }}>
        <CssBaseline />
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <NewstartLogoIcon />
          </Box>

          {/* <Box sx={{ display: 'flex', gap: '40px' }}>
            {navItems.map((item) => (
              <Button key={item} sx={{ color: '#fff', textTransform: 'unset', fontSize: '18px' }}>
                {item}
              </Button>
            ))}
          </Box> */}

          <Box sx={{ display: 'flex', gap: '24px' }}>
            <Button
              sx={{
                color: '#fff',
                border: '1px solid white',
                borderRadius: '120px',
                paddingY: '14px',
                paddingX: '24px',
                textTransform: 'unset',
                fontSize: '18px',
              }}
              onClick={() => router.push(ROUTE.SIGN_IN)}
            >
              Login
            </Button>

            <Button
              sx={{
                color: '#fff',
                backgroundColor: '#4187F7',
                borderRadius: '120px',
                paddingY: '14px',
                paddingX: '24px',
                textTransform: 'unset',
                fontSize: '18px',
                '&.MuiButtonBase-root:hover': {
                  bgcolor: '#4187F7',
                },
              }}
              onClick={() => router.push(ROUTE.SIGN_UP)}
            >
              Sign Up
            </Button>
          </Box>
        </Box>

        <Box sx={{ marginTop: '183px', paddingBottom: '162px' }}>
          <Typography sx={{ color: 'white', fontSize: '72px', lineHeight: '86.4px' }}>Record -Analyze-Share</Typography>

          <Typography sx={{ color: 'white', fontSize: '25px', lineHeight: '40.4px', width: '47%' }}>
            Gift the NEWSTART Online course to promote health and wellbeing. Access to comprehensive program on core
            elements of health.
          </Typography>

          <Button
            sx={{
              color: '#fff',
              backgroundColor: '#4187F7',
              borderRadius: '120px',
              paddingY: '14px',
              paddingX: '24px',
              textTransform: 'unset',
              fontSize: '18px',
              marginTop: '30px',
              '&.MuiButtonBase-root:hover': {
                bgcolor: '#4187F7',
              },
            }}
            onClick={() => router.push(ROUTE.SIGN_IN)}
          >
            Get Started
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
