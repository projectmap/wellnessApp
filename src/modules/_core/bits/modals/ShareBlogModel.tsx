import Image from 'next/image';
import React, { FC, MouseEventHandler } from 'react';
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterIcon,
  TwitterShareButton,
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
} from 'react-share';
import { Box, IconButton, Paper, Stack, Typography } from '@mui/material';

import { CloseBtnModel } from '~/icons';
import { useGetUser } from '~/utils/useGetUser';
import { frontendUrl } from '~/config/variables';
import { DEFAULT_AVATAR } from '~/state/constants';

interface BlogModel {
  handleClose?: MouseEventHandler;
  content?: any;
  blogID?: string;
  blogTitle?: string;
}
const ShareBlogModal: FC<BlogModel> = ({ handleClose, content, blogID, blogTitle }) => {
  const user = useGetUser();

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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={handleClose}>
          <CloseBtnModel />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Image
            className="avatar"
            src={user?.photo?.completedUrl || DEFAULT_AVATAR}
            height={48}
            width={48}
            alt={user?.name || 'user profile'}
          />
          <Stack direction="column" sx={{ pl: 2 }}>
            <Typography variant="h5">{user?.name}</Typography>
          </Stack>
        </Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {blogTitle}
        </Typography>
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
        <Stack direction="row" sx={{ mt: 2, gap: 1 }} alignContent="center" justifyContent="center">
          <FacebookShareButton url={ShareUrl}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <TwitterShareButton url={ShareUrl}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          <WhatsappShareButton url={ShareUrl}>
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
          <LinkedinShareButton url={ShareUrl}>
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>
        </Stack>
      </Box>
    </Paper>
  );
};
export { ShareBlogModal };
