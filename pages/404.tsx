import Link from 'next/link';
import { useRouter } from 'next/router';
import { Typography } from '@mui/material';
import { Box, Container } from '@mui/system';

import { ROUTE } from '~/config/routes';
import { Logo, PageNotFoundIcon } from '~/icons';
import { PrimaryButton } from '~/modules/_core/bits/buttons/PrimaryButton';

export default function FourOhFour() {
  const router = useRouter();

  return (
    <>
      <Box
        sx={{
          background: '#F4F5FC',
          height: '100vh',
          overflowY: 'hidden',
        }}
        className="hide-scrollbar"
      >
        <Container maxWidth="xl" sx={{ pt: 4 }}>
          <Link href="/user/signin">
            <a>
              <Logo />
            </a>
          </Link>
        </Container>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <PageNotFoundIcon />
          <Typography variant="h5" sx={{ mt: 4 }}>
            404 error{' '}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, color: '#5A5A72' }}>
            Ooops, Page not found. This page doesn’t exist or was removed!
          </Typography>
          <PrimaryButton
            onClick={() => router.push(ROUTE.HOME)}
            sx={{
              backgroundColor: 'transparent',
              borderRadius: '32px',
              color: '#147AE9',
              border: '1px solid #147AE9',
              mt: 3,
              '&:hover': {
                color: '#FFF',
              },
            }}
          >
            Back to Home
          </PrimaryButton>
        </Box>
      </Box>
    </>
  );
}
