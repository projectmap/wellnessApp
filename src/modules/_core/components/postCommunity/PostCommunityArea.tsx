import React from 'react';
import { Box, TextField } from '@mui/material';

import { ContestIcon, PhotoIcon } from '~/icons';
import { CreatePostArea } from '../post/CreatePostArea';
import { Modal, useModal } from '~/modules/_core/bits/commonModal';
import { ButtonWithIcon } from '~/modules/_core/bits/buttons/IconButton';
import { PostCommunityWrapper } from '~/modules/_core/styles/PostCommunityWrapper';
import { useGetProfileQuery } from '@newstart-online/sdk';

export const PostCommunityArea = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const userinfo = useGetProfileQuery();
  const user = userinfo.data?.data;

  return (
    <PostCommunityWrapper>
      <h3 className="title">
        Good afternoon, <br />
        <span>{user?.name}.</span>
      </h3>
      <Box className="post__form" onClick={openModal}>
        <TextField size="small" fullWidth placeholder="Post to community" variant="outlined" />
      </Box>
      <Box className="post__bottom">
        <ButtonWithIcon icon={<PhotoIcon />}>Photo</ButtonWithIcon>
        <span className="slash"></span>
        <ButtonWithIcon icon={<ContestIcon />}>Contest</ButtonWithIcon>
      </Box>
      <Modal isOpen={isOpen} closeIcon={true} closeModal={closeModal} content={<CreatePostArea />} />
    </PostCommunityWrapper>
  );
};
