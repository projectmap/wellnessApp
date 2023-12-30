import React from 'react';
import Image from 'next/image';
import { Box } from '@mui/system';
import { Modal, Paper, Typography } from '@mui/material';
import { useUpdateUserByTokenMutation } from '@newstart-online/sdk';

import { useAppDispatch } from '~/state/app/hooks';
import { ModalWrapper } from './styles/ModalWrapper';
import { setOpenMultiForm, setUserOnboardingLocation } from '~/state/services/onboarding/onboardingSlice';

interface IQuestionsModalProps {
  handleClose: () => void;
  username: string | undefined;
  open: boolean;
  setOpen: (status: boolean) => void;
}

export const GatherInformationModal = ({ username, open, setOpen }: IQuestionsModalProps) => {
  const dispatch = useAppDispatch();

  const [updateUserInfo] = useUpdateUserByTokenMutation();

  const handleUserInfo = () => {
    //set firsttimelogin to false is a user skips the modal
    updateUserInfo({
      isFirstLogin: false,
    });
    dispatch(setUserOnboardingLocation(true));
  };

  const handleContinue = () => {
    setOpen(false);
    dispatch(setOpenMultiForm(true));
    dispatch(setUserOnboardingLocation(false));
  };

  return (
    <Modal open={open}>
      <ModalWrapper>
        <Paper
          sx={{
            borderRadius: '12px',
            position: 'absolute',
            left: '50%',
            top: '50%',
            height: 'fit-content',
            pb: 4,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 4 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                pt: 4,
                width: '80%',
                margin: 'auto',
                alignItems: 'center',
              }}
            >
              <Image src="/assets/images/illustrationOnboadingUserInfo.svg" width={168} height={168} alt="onboarding" />
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              px: 7,
            }}
          >
            <Typography variant="h5" sx={{ pt: 2, textAlign: 'center', textTransform: 'capitalize' }}>
              Hi {username},
            </Typography>
            <Typography variant="subtitle1" sx={{ width: '100%', textAlign: 'center', pb: 3 }}>
              Got your healthy lifestyle goals? Share a bit to make this a truly YOU-experience.
            </Typography>
            <div className="button-wrapper">
              <button className="button-filled" onClick={handleContinue} type="button">
                Continue
              </button>
            </div>
            <Typography variant="body2" sx={{ pt: 3.5, width: '85%', textAlign: 'center', pb: 0 }}>
              Want to just get started? No problem! Come back to this any time you want.
            </Typography>
          </Box>
        </Paper>
      </ModalWrapper>
    </Modal>
  );
};
