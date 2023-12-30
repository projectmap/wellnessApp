import React, { useState } from 'react';

import {
  TwitterIcon,
  FacebookIcon,
  LinkedinIcon,
  WhatsappIcon,
  TwitterShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
} from 'react-share';
import { Box } from '@mui/system';
import { IconButton, Menu, MenuItem, Typography } from '@mui/material';

import { PostShareIcon, PostShare } from '~/icons';
import { ButtonWithIcon } from '~/modules/_core/bits/buttons/IconButton';

import { ShareMenuProps } from './CommentMenu.Types';
import GenericShareModal from '../modals/GenericShareModal';

const ShareMenu = ({
  shareModalType,
  currentPostDetails,
  shareUrl,
  title,
  postId,
  authorDetails,
  description,
  imageUrlToShare,
  isSharedPostAsBadge,
}: ShareMenuProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [showGenericShareModal, setShowGenericShareModal] = useState(false);

  return (
    <Box>
      <ButtonWithIcon onClick={handleClick} icon={<PostShareIcon />}>
        Share
      </ButtonWithIcon>
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
        <MenuItem onClick={() => setShowGenericShareModal(true)}>
          <Box sx={{ mb: '16px', display: 'flex', alignItems: 'center' }}>
            <PostShare fontSize="small" />
            <Typography sx={{ ml: '12px' }}>Share Now</Typography>
          </Box>
        </MenuItem>

        <MenuItem>
          <FacebookShareButton url={shareUrl} title={title}>
            <Box sx={{ mb: '16px', display: 'flex', alignItems: 'center' }}>
              <FacebookIcon size={18} bgStyle={{ fill: 'GrayText', backgroundColor: 'red' }} />

              <Typography sx={{ ml: '12px' }}>Share to Facebook</Typography>
            </Box>
          </FacebookShareButton>
        </MenuItem>

        <MenuItem>
          <TwitterShareButton url={shareUrl} title={title}>
            <Box sx={{ mb: '16px', display: 'flex', alignItems: 'center' }}>
              <TwitterIcon size={18} bgStyle={{ fill: 'GrayText', backgroundColor: 'red' }} />

              <Typography sx={{ ml: '12px' }}>Share to Twitter</Typography>
            </Box>
          </TwitterShareButton>
        </MenuItem>

        <MenuItem>
          <LinkedinShareButton url={shareUrl} title={title}>
            <Box sx={{ mb: '16px', display: 'flex', alignItems: 'center' }}>
              <LinkedinIcon size={18} bgStyle={{ fill: 'GrayText', backgroundColor: 'red' }} />

              <Typography sx={{ ml: '12px' }}>Share to LinkedIn</Typography>
            </Box>
          </LinkedinShareButton>
        </MenuItem>

        {/* TODO: Need Facebook App Id */}
        {/* <MenuItem>
          <FacebookMessengerShareButton url={shareUrl} title={title}>
            <Box sx={{ mb: '16px', display: 'flex', alignItems: 'center' }}>
              <FacebookMessengerIcon size={18} bgStyle={{fill:'GrayText', backgroundColor:'red'}}  />

              <Typography  sx={{ ml: '12px' }}>
                Share to Messenger
              </Typography>
            </Box>
          </FacebookMessengerShareButton>
        </MenuItem>
        <Divider /> */}

        <MenuItem>
          <WhatsappShareButton url={shareUrl} title={title}>
            <Box sx={{ mb: '16px', display: 'flex', alignItems: 'center' }}>
              <WhatsappIcon size={18} bgStyle={{ fill: 'GrayText', backgroundColor: 'red' }} />

              <Typography sx={{ ml: '12px' }}>Share to WhatsApp</Typography>
            </Box>
          </WhatsappShareButton>
        </MenuItem>
      </Menu>
      <GenericShareModal
        isBadge={isSharedPostAsBadge}
        showModal={showGenericShareModal}
        setShowGenericShareModal={setShowGenericShareModal}
        imageUrl={imageUrlToShare}
        title={title}
        description={description}
        shareModalType={shareModalType}
        id={postId}
        authorDetails={authorDetails}
        isRepostedFromFeed={true}
      />
    </Box>
  );
};

export default ShareMenu;
