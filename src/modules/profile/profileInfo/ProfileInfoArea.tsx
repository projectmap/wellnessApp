import React from 'react';
import Image from 'next/image';
import { Box } from '@mui/system';
import { IconButton } from '@mui/material';

import { EditIcon, QRICon } from '~/icons';
import { ProfileInfoWrapper } from '../styles/ProfileInfoWrapper';

export const ProfileInfoArea = () => {
  return (
    <ProfileInfoWrapper>
      <Box className="profile__wrapper">
        <Box className="profile__name">
          <picture>
            <Image src="/assets/images/profile/user.png" width={128} height={128} alt="profile image" />
          </picture>
          <Box className="content">
            <h4>Brooklyn Simmons</h4>
            <Box className="btn__wrap">
              <IconButton className="btn--qr">
                <QRICon />
              </IconButton>
            </Box>
          </Box>
        </Box>
        <IconButton>
          <EditIcon />
        </IconButton>
      </Box>
    </ProfileInfoWrapper>
  );
};
