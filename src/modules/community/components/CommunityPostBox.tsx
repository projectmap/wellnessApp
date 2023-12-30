import Image from 'next/image';
import React, { useState } from 'react';
import { Box, Modal, Stack } from '@mui/material';

import { useGetProfileQuery } from '@newstart-online/sdk';

import { PostImage } from '~/icons';
import { CommunityPostBoxProps } from '../Types';
import { Card } from '~/modules/_core/bits/cards';
import { StyledInputBase, StyledPost } from '../styles/PostInput';
import { PostModelPopup } from '~/modules/_core/bits/modals/PostModel';
import { ButtonWithIcon } from '~/modules/_core/bits/buttons/IconButton';
import { CommunityPostStyles } from '~/modules/community/styles/CommunityPostStyles';
import { DefaultUserPhoto } from './Chat/DefaultUserPhoto';

const CommunityPostBox = ({ setFeeds }: CommunityPostBoxProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { data } = useGetProfileQuery();

  const profileData = data?.data;
  const profilePhoto = profileData?.photo?.completedUrl;

  return (
    <>
      <Card cardContentSxProps={CommunityPostStyles?.communityPostStylesContainer}>
        <StyledPost onClick={handleOpen}>
          <Box sx={CommunityPostStyles?.inputAndAvatar}>
            {profilePhoto ? (
              <Box sx={{ position: 'relative', height: '48px', width: '48px' }}>
                <Image
                  src={profilePhoto}
                  alt={profileData?.name}
                  width="100%"
                  height="100%"
                  objectFit="cover"
                  style={{ borderRadius: '50%' }}
                />
              </Box>
            ) : (
              <DefaultUserPhoto
                userName={profileData?.name}
                fontNewSize={{ fontSize: '18px' }}
                sx={{ backgroundColor: `${profileData?.color}`, height: '48px', width: '48px' }}
              />
            )}
            <StyledInputBase
              placeholder="What’s on your mind?"
              inputProps={{ 'aria-label': 'What’s on your mind? ' }}
            />
          </Box>
        </StyledPost>
        <Stack sx={CommunityPostStyles?.buttonContainer} spacing={2} direction="row" justifyContent="left">
          <ButtonWithIcon icon={<PostImage />} onClick={handleOpen}>
            Image
          </ButtonWithIcon>
          {/* TODO: Video Upload Implementaion */}
          {/* <ButtonWithIcon icon={<PostVideo />}>Video</ButtonWithIcon> */}
        </Stack>
      </Card>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-post" aria-describedby="post something">
        <PostModelPopup closeModal={handleClose} setFeeds={setFeeds} />
      </Modal>
    </>
  );
};

export default CommunityPostBox;
