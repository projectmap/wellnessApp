import * as React from 'react';
import { styled, SxProps } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import { Theme } from '@mui/system';

interface IUserOnlineAvatar {
  src: string;
  sx?: SxProps<Theme> | undefined;
  isUserOnline?: boolean;
}

type styleProps = {
  isUserOnline?: boolean;
};

export const OnlineBadge = styled(Badge)<styleProps>(({ theme, isUserOnline }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#75BC37',
    color: '#75BC37',
    display: `${isUserOnline ? 'block' : 'none'}`,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',

      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

export default function UserOnlineAvartar({ src, sx, isUserOnline }: IUserOnlineAvatar) {
  return (
    <OnlineBadge
      overlap="circular"
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      variant="dot"
      isUserOnline={isUserOnline}
    >
      <Avatar alt="Remy Sharp" src={src} sx={{ ...sx }} />
    </OnlineBadge>
  );
}
