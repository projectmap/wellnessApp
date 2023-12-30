import React from 'react';
import { Box, Theme } from '@mui/system';
import { Typography, SxProps } from '@mui/material';

import { OnlineStatusCircle } from '~/icons';
import { useGetUser } from '~/utils/useGetUser';
import UserOnlineAvartar, { OnlineBadge } from './UserOnlineStatusAvatar';
import { DEACTIVATING_USER_IMAGE } from '~/state/constants';

interface IDefaultUserPhoto {
  sx?: SxProps<Theme> | undefined;
  userName?: string;
  fontNewSize?: SxProps<Theme> | undefined;
  isUserOnline?: boolean;
  isActive?: boolean;
}
export const DefaultUserPhoto = ({ fontNewSize, sx, userName, isUserOnline, isActive = true }: IDefaultUserPhoto) => {
  const user = useGetUser();

  if (!isActive) {
    return <UserOnlineAvartar sx={{ width: '46px', height: '46px' }} src={DEACTIVATING_USER_IMAGE} />;
  }

  return (
    <OnlineBadge isUserOnline={true}>
      <Box
        sx={{
          width: '36px',
          height: '36px',
          backgroundColor: '#4CC4D9',
          borderRadius: '50%',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          ...sx,
        }}
      >
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#E5FBFF',
            textTransform: 'capitalize',
            ...fontNewSize,
          }}
        >
          {userName ? userName?.slice(0, 1) : user?.name?.slice(0, 1)}
        </Typography>
        {isUserOnline && <OnlineStatusCircle style={{ position: 'absolute', top: '5%', right: '0' }} />}
      </Box>
    </OnlineBadge>
  );
};
