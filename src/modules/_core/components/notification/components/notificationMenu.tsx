import React, { useCallback } from 'react';

import { IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material';

import { CheckIcon, MoreOptionsIcon } from '~/icons';
import { useMarkAllReadNotification } from '../services/services';

const NotificationMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { onSubmit } = useMarkAllReadNotification();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onCheckAllNotificationHandler = useCallback(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <IconButton>
      <MoreOptionsIcon onClick={handleClick} />

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            borderRadius: '12px',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={onCheckAllNotificationHandler}>
          <ListItemIcon>
            <CheckIcon fontSize="small" />
          </ListItemIcon>
          Mark all as read
        </MenuItem>
      </Menu>
    </IconButton>
  );
};

export default NotificationMenu;
