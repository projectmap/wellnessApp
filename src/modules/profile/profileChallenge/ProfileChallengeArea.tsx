import React from 'react';
import { Box } from '@mui/system';
import IconButton from '@mui/material/IconButton';

import { DownloadIcon } from '~/icons';
import { ProfileChallengeWrapper } from '../styles/ProfileChallengeWrapper';

export const ProfileChallengeArea = () => {
  return (
    <ProfileChallengeWrapper>
      <Box className="challenge__title">
        <h3>
          Challenges
          <span>4</span>
        </h3>
        <IconButton>
          <DownloadIcon />
        </IconButton>
      </Box>
      <Box>
        <ul>
          <li></li>
        </ul>
      </Box>
    </ProfileChallengeWrapper>
  );
};
