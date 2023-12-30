import Image from 'next/image';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Box, Stack } from '@mui/system';
import { useForm } from 'react-hook-form';
import { Modal, Paper, Typography } from '@mui/material';

import { ChangeAvatar, CloseBlue } from '~/icons';
import { ModalWrapper } from '../styles/ModalWrapper';
import { LoadingBtn } from '~/modules/_core/bits/buttons/LoadingBtn';
import { IMultiFormModalInputs } from './MuiltiformModalInputs.interface';
import { DefaultUserPhoto } from '~/modules/community/components/Chat/DefaultUserPhoto';
import { getImageExtensionFileOnlyAndCheckIfFileisOtherThanImage } from '~/utils/fileValidator';
import { DEFAULT_AVATAR, useGetProfileQuery, useUploadUserPhotoMutation } from '@newstart-online/sdk';

interface IUserPhotoUploadModal {
  showModal: boolean;
  setShowImageUploadModal: (status: boolean) => void;
  width?: string;
  height?: string;
}

export const UserPhotoUploadModal = ({ setShowImageUploadModal, showModal, width, height }: IUserPhotoUploadModal) => {
  const router = useRouter();
  const [userProfileImg, setUserProfileImg] = useState<Blob | MediaSource | null>();
  const { data } = useGetProfileQuery();
  const profileData = data?.data;

  const handleFileUpload = async () => {
    document.getElementById('image-file')?.click();
  };

  let urlToPush = '';
  if (typeof window !== 'undefined' && window.location) {
    urlToPush = window.location.pathname;
  }

  const [uploadAvatar, isLoading] = useUploadUserPhotoMutation();

  const uploadUserPicture = () => {
    uploadAvatar({ file: userProfileImg })
      .unwrap()
      .then(() => {
        toast.success('Photo saved successfully');
        setShowImageUploadModal(false);
        urlToPush && router.push(urlToPush);
      })
      .catch((err: any) => {
        toast.error(err.data?.message);
      });
  };

  const {
    register,
    formState: { errors },
  } = useForm<IMultiFormModalInputs>();

  return (
    <Modal
      open={showModal}
      onClose={() => {
        setShowImageUploadModal(false);
        setUserProfileImg(null);
      }}
      aria-labelledby="modal-upload-image-title"
      aria-describedby="modal-upload-image-description"
    >
      <ModalWrapper>
        <Paper
          sx={{
            width: '480px',
            pb: '12px',
            position: 'absolute',
            left: '50%',
            top: '50%',
            height: 'fit-content',
            borderRadius: '12px',
            transform: 'translate(-50%, -50%)',
            p: '42px 32px 52px 32px',
          }}
        >
          <Box
            sx={{
              mb: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              p: 4,
            }}
          >
            <Box
              onClick={() => {
                setShowImageUploadModal(false);
              }}
              sx={{ position: 'absolute', right: '24px', top: '24px', cursor: 'pointer' }}
            >
              <CloseBlue />
            </Box>
            <Stack direction="column" alignItems="center" gap={2}>
              <Box sx={{ position: 'relative' }} className="cursor-pointer" onClick={handleFileUpload}>
                {userProfileImg ? (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 10,
                      cursor: 'pointer',
                    }}
                  >
                    <ChangeAvatar onClick={handleFileUpload} />
                  </Box>
                ) : null}
                {(userProfileImg !== null && userProfileImg !== undefined) || profileData?.photo?.completedUrl ? (
                  <Image
                    className="avatar"
                    src={userProfileImg ? URL.createObjectURL(userProfileImg) : profileData?.photo?.completedUrl}
                    height={height}
                    width={width}
                    alt={profileData?.name || 'user profile'}
                  />
                ) : (
                  <DefaultUserPhoto
                    userName={profileData?.name}
                    fontNewSize={{ fontSize: '24px' }}
                    sx={{ backgroundColor: `${profileData?.color}`, width: '96px', height: '96px' }}
                  />
                )}
                <input
                  id="image-file"
                  type="file"
                  accept="image/png, image/jpeg" // not to accept svg or any other file format
                  {...register('avatar')}
                  hidden
                  onChange={(e) => {
                    if (e?.target?.files) {
                      const { containsInvalidFormatFile } = getImageExtensionFileOnlyAndCheckIfFileisOtherThanImage(
                        (e?.target?.files as any) || [],
                      );
                      if (containsInvalidFormatFile) {
                        toast.error('Can accept any image file');

                        return;
                      }
                      setUserProfileImg(e.target.files?.[0]);
                    }
                  }}
                />
              </Box>

              <Typography variant="h6">Add profile photo</Typography>
              <Typography variant="body2">{`Track your progress by updating your photo as you reach your health goals.`}</Typography>
            </Stack>
          </Box>
          <Box sx={{ marginX: 'auto', mt: 3 }}>
            <div className="button-wrapper">
              {userProfileImg ? (
                <LoadingBtn onClick={uploadUserPicture} loading={isLoading.isLoading} sx={{ borderRadius: '32px' }}>
                  Continue
                </LoadingBtn>
              ) : (
                <LoadingBtn onClick={handleFileUpload} loading={false}>
                  {profileData?.photo?.completedUrl ? 'Update your photo' : 'Add photo'}
                </LoadingBtn>
              )}
            </div>
          </Box>
        </Paper>
      </ModalWrapper>
    </Modal>
  );
};
