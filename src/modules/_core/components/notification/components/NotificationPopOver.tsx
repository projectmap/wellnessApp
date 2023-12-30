import React, { useCallback } from 'react';

import { Box, Link as MuiLink, Popover, useMediaQuery } from '@mui/material';

import NotificationPopOverContent from './NotificationPopOverContent';
import { NotificationPopOverProps } from '~/modules/_core/components/notification/NotificationTypes';
import { useGetUnSeenNotificationCount } from '~/modules/_core/components/notification/services/services';

const NotificationPopOver = (props: NotificationPopOverProps) => {
  const { icon, activeIcon, title, to, isActive } = props;
  const { unSeenNotificationCount } = useGetUnSeenNotificationCount();

  const [anchorEl, setAnchorEl] = React.useState<HTMLAnchorElement | null>(null);

  const handleClick = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const matchesSmallTB960 = useMediaQuery('(max-width:960px)');

  const dynamicStylesForNavLink = {
    ...(matchesSmallTB960 && { fontSize: '12px' }),
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <MuiLink
        onClick={handleClick}
        variant="subtitle1"
        underline="none"
        className="nav--link"
        sx={{
          textTransform: 'capitalize',
          color: `${open || isActive ? 'primary.main' : '#AFB1BC'}`,
          ...dynamicStylesForNavLink,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            cursor: 'pointer',
          }}
        >
          <Box sx={{ height: '24px', position: 'relative' }}>
            {open || isActive ? activeIcon : icon}
            {unSeenNotificationCount !== 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-4px',
                  background: '#F18164',
                  width: '20px',
                  height: '20px',
                  borderRadius: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.525rem',
                  color: '#ffffff',
                }}
              >
                {unSeenNotificationCount > 99 ? '99+' : unSeenNotificationCount}
              </Box>
            )}
          </Box>
          {title}
        </Box>
      </MuiLink>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 65,
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          sx: {
            padding: '1rem',
            borderRadius: '8px',
            boxShadow: '0px 6px 18px 2px rgba(0, 0, 0, 0.04)',
            border: '1px solid #F3F3F5',
          },
        }}
      >
        <NotificationPopOverContent to={to} />
      </Popover>
    </>
  );
};

export default NotificationPopOver;
