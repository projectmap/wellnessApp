import Image from 'next/image';
import React, { FC, MouseEventHandler } from 'react';
import { Box, IconButton, Paper, Stack, Typography } from '@mui/material';

import { CloseBtnModel } from '~/icons';
import { frontendUrl } from '~/config/variables';
import { useAppSelector } from '~/state/app/hooks';
import { DEFAULT_AVATAR } from '~/state/constants';
import { LearnResources } from '~/modules/_core/styles/LearnResources';
import { deactivateUserName } from '~/utils/helpers';

interface BlogModel {
  handleClose?: MouseEventHandler;
  content?: any;
  blogID?: string;
  blogImg?: string;
}
const ShareBlogToCommunityModal: FC<BlogModel> = ({ handleClose, content, blogID, blogImg }) => {
  const user = useAppSelector((state) => state.user.user);
  if (!user) return null;

  const ShareUrl: string = `${frontendUrl}/user/learn/resources/${blogID}`;

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Share To Community
        </Typography>
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
            <Typography variant="h5">{user?.name || deactivateUserName}</Typography>
          </Stack>
        </Box>

        <Typography
          dangerouslySetInnerHTML={content}
          variant="body1"
          sx={{
            whiteSpace: 'nowrap',
            width: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        />
      </Box>
      <LearnResources>
        <div className="amplify-image-container">
          <img src={blogImg} alt={'img'} />
        </div>

        <div className="post-to-community-button">
          <button>Post</button>
        </div>
      </LearnResources>
    </Paper>
  );
};
export { ShareBlogToCommunityModal };
