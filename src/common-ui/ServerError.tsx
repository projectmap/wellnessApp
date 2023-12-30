import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { Typography } from '@mui/material';
import { Box, Container } from '@mui/system';

import { ROUTE } from '~/config/routes';
import { Logo, ServerErrorIcon } from '~/icons';
import { clearTokens } from '@newstart-online/sdk';
import { clearAllTokens } from '~/utils/authStore';
import { setLoading } from '~/state/services/loader/globalLoaderSlice';
import { PrimaryButton } from '~/modules/_core/bits/buttons/PrimaryButton';

export default function ServerError() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      dispatch(setLoading(true));
      clearAllTokens();
      dispatch(clearTokens());
      router.push(ROUTE.SIGN_IN);
      dispatch(setLoading(false));
    } catch (e) {
      console.error('[MePage] ', e);
    }
  };

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
          <ServerErrorIcon />
          <Typography variant="h5" sx={{ mt: 4 }}>
            Oops! server error occurred
          </Typography>
          <Typography variant="body1" sx={{ mt: 4 }}>
            Try again after a while...
          </Typography>
          <PrimaryButton
            onClick={handleLogout}
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
            Logout
          </PrimaryButton>
        </Box>
      </Box>
    </>
  );
}
