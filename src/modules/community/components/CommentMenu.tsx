import React from 'react';
import { Box } from '@mui/system';

import DeleteIcon from '@mui/icons-material/Delete';
import { Divider, IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material';

import { EditIcon, MoreOptionsIcon } from '~/icons';

import { CommentMenuProps } from './CommentMenu.Types';

const CommentMenu = ({
  handleEdit,
  handleDelete,
  commentIdOrReplyCommentId = '',
  commentText = '',
}: CommentMenuProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box className="cursor-pointer">
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
        <MenuItem onClick={() => handleEdit(commentIdOrReplyCommentId, commentText)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleDelete(commentIdOrReplyCommentId)}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default CommentMenu;
