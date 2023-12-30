import Image from 'next/image';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { Box, Stack } from '@mui/system';
import { useForm } from 'react-hook-form';
import { Button, MobileStepper, Modal, Paper, Typography } from '@mui/material';

import { ChangeAvatar } from '~/icons';
import { useGetUser } from '~/utils/useGetUser';
import { ModalWrapper } from '../styles/ModalWrapper';
import { useAppDispatch, useAppSelector } from '~/state/app/hooks';
import { IMultiFormModalInputs } from './MuiltiformModalInputs.interface';
import { DEFAULT_AVATAR, useUploadUserPhotoMutation } from '@newstart-online/sdk';
import {
  setOpenMultiForm,
  setActiveStepInMultiForm,
  setUserOnboardingLocation,
} from '~/state/services/onboarding/onboardingSlice';
import { USER_ONBOARDING_STEPS } from '~/state/constants';
import { LoadingBtn } from '~/modules/_core/bits/buttons/LoadingBtn';
import { getImageExtensionFileOnlyAndCheckIfFileisOtherThanImage } from '~/utils/fileValidator';

export const UserAvatarModal = () => {
  const [userProfileImg, setUserProfileImg] = useState<Blob | MediaSource>();
  const dispatch = useAppDispatch();
  const user = useGetUser();
  const activeStep = useAppSelector((state) => state.onboarding.activeStep);
  const MultiformModal = useAppSelector((state) => state.onboarding.openMultiForm);

  const handleFileUpload = async () => {
    document.getElementById('image-file')?.click();
  };

  const [uploadAvatar, isLoading] = useUploadUserPhotoMutation();

  const handleUserCourseLocation = () => {
    dispatch(setUserOnboardingLocation(true));
    dispatch(setOpenMultiForm(false));
  };

  const uploadUserPicture = () => {
    uploadAvatar({ file: userProfileImg })
      .unwrap()
      .then(() => {
        dispatch(setUserOnboardingLocation(true));
        dispatch(setOpenMultiForm(false));
        dispatch(setActiveStepInMultiForm(USER_ONBOARDING_STEPS.REMOVE_ACTIVE_STEP));
        toast.success('Photo saved successfully');
      })
      .catch((err: any) => {
        toast.error(err.data?.message);
      });
  };

  const {
    register,
    formState: { errors },
  } = useForm<IMultiFormModalInputs>();

  const handleBack = () => {};

  return (
    <Modal open={MultiformModal}>
      <ModalWrapper>
        <Paper
          sx={{
            width: '557px',
            pb: '12px',
            position: 'absolute',
            left: '50%',
            top: '50%',
            height: 'fit-content',
            borderRadius: '12px',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 4 }}>
            <Typography variant="subtitle1">{activeStep} of 3</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'right', cursor: 'pointer' }}>
              {activeStep !== USER_ONBOARDING_STEPS.USER_AVATAR && (
                <button
                  className="skip-btn"
                  onClick={() => dispatch(setActiveStepInMultiForm(USER_ONBOARDING_STEPS.REMOVE_ACTIVE_STEP))}
                >
                  Skip
                </button>
              )}
            </Box>
          </Box>
          <MobileStepper //progress bar
            variant="progress"
            steps={4}
            position="static"
            activeStep={activeStep}
            sx={{
              maxWidth: '100%',
              flexGrow: 1,
              '& .MuiLinearProgress-root': {
                width: '100%',
                backgroundColor: 'rgba(0,0,0, 0.2)',
                height: '2px',
              },
              background: 'none',
              padding: '0',
            }}
            nextButton={
              //hidden but only needed for mui typesafe needs
              <Button
                size="small"
                onClick={() => dispatch(setActiveStepInMultiForm(USER_ONBOARDING_STEPS.HEALTH_INFO))}
                disabled={activeStep === USER_ONBOARDING_STEPS.USER_AVATAR}
                sx={{ display: 'none' }}
              >
                Next
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={handleBack}
                disabled={activeStep === USER_ONBOARDING_STEPS.GENERAL_INFO}
                sx={{ display: 'none' }}
              >
                Back
              </Button>
            }
          />
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
            <Stack direction="column" alignItems="center" gap={2}>
              <Box>
                {userProfileImg ? (
                  <Box sx={{ position: 'relative', borderRadius: '50%', width: '165px', height: '165px' }}>
                    <Image
                      src={userProfileImg ? URL.createObjectURL(userProfileImg) : DEFAULT_AVATAR}
                      width={165}
                      height={165}
                      alt="avatar"
                      onClick={handleFileUpload}
                      style={{ borderRadius: '50%' }}
                    />
                    <Box
                      sx={{
                        width: '165px',
                        height: '165px',
                        borderRadius: '50%',
                        backgroundColor: '#000',
                        opacity: '0.5',
                        position: 'absolute',
                        zIndex: 9,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                      }}
                    ></Box>
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
                  </Box>
                ) : (
                  <Box
                    sx={{
                      cursor: 'pointer',
                      width: '165px',
                      height: '165px',
                      backgroundColor: `${user?.color}`,
                      borderRadius: '50%',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                    }}
                    onClick={() => handleFileUpload()}
                  >
                    <Typography
                      sx={{
                        fontSize: '42px',
                        fontWeight: 500,
                        color: '#E5FBFF',
                        textTransform: 'capitalize',
                      }}
                    >
                      {user?.name?.slice(0, 1)}
                    </Typography>
                  </Box>
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
                        toast.error('Can accept only image file');

                        return;
                      }
                      setUserProfileImg(e.target.files?.[0]);
                    }
                  }}
                />
              </Box>
              <Typography variant="h6">Add profile picture</Typography>
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
                <LoadingBtn
                  onClick={uploadUserPicture}
                  disabled={userProfileImg === undefined}
                  loading={isLoading?.isLoading}
                  sx={{ borderRadius: '32px' }}
                >
                  Add a photo
                </LoadingBtn>
              )}
            </div>
            <div className="button-wrapper">
              <button className="button-outline" onClick={handleUserCourseLocation} type="button">
                Skip
              </button>
            </div>
          </Box>
        </Paper>
      </ModalWrapper>
    </Modal>
  );
};
