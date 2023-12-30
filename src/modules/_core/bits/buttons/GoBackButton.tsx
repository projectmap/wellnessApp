import { Box } from '@mui/system';
import React from 'react';
import { HalfLeftArrow } from '~/icons';
import { useRouter } from 'next/router';

export const GoBackButton = () => {
  const router = useRouter();

  return (
    <Box
      onClick={() => router.back()}
      className="goback-btn"
      sx={{
        width: '100px',
        display: 'flex',
        cursor: 'pointer',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontWeight: 600,
        mb: 4,
      }}
    >
      <HalfLeftArrow />
      Go back
    </Box>
  );
};
