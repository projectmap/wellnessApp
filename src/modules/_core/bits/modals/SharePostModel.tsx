import Image from 'next/image';
import React, { FC, MouseEventHandler } from 'react';
import { FacebookShareButton, FacebookIcon } from 'react-share';
import { Box, IconButton, Paper, Stack, Typography } from '@mui/material';

import { CloseBtnModel } from '~/icons';
import { frontendUrl } from '~/config/variables';
import { useAppSelector } from '~/state/app/hooks';
import { DEFAULT_AVATAR } from '~/state/constants';

interface Model {
  handleClose?: MouseEventHandler;
  content?: string;
  postID?: string;
}
const SharePostModal: FC<Model> = ({ handleClose, content, postID }) => {
  const user = useAppSelector((state) => state.user.user);
  if (!user) return null;

  const ShareUrl: string = `${frontendUrl}/user/community/feed/${postID}`;

  return (
    <Paper
      sx={{
        pt: 3,
        pb: 6,
        pr: 4,
        pl: 4,
        borderRadius: '12px',
        width: '455px',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
      elevation={0}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={handleClose}>
          <CloseBtnModel />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Image
            className="avatar"
            src={user.photo || DEFAULT_AVATAR}
            height={48}
            width={48}
            alt={user?.name || 'user profile'}
          />
          <Stack direction="column" sx={{ pl: 2 }}>
            <Typography variant="h5">{user?.name}</Typography>
          </Stack>
        </Box>
        <Typography>{content}</Typography>
        <FacebookShareButton url={ShareUrl}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
      </Box>
    </Paper>
  );
};
export { SharePostModal };
