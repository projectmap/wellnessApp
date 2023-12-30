import React from 'react';
import { Box } from '@mui/system';
import { Modal, Paper, Typography } from '@mui/material';

import { CloseBlue } from '~/icons';
import { PrimaryButton } from '~/modules/_core/bits/buttons/PrimaryButton';
import { ConfirmationModalStyle } from '~/modules/_core/styles/ConfirmationModalStyles';

interface IConfirmationModal {
  showModal: boolean;
  setShowModal: (status: boolean) => void;
  message?: string;
  messageInfo1?: string;
  messageInfo2?: string;
  title?: string;
  hideCancelButton?: boolean;
  modalAction: () => void;
  buttonName?: string;
  cancelButtonName?: string;
}
const ConfirmationModal = ({
  buttonName,
  cancelButtonName,
  hideCancelButton = false,
  title,
  messageInfo1,
  messageInfo2,
  showModal,
  setShowModal,
  message,
  modalAction,
}: IConfirmationModal) => {
  return (
    <Modal
      open={showModal}
      onClose={setShowModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={ConfirmationModalStyle.confirmationModalOutermost}
    >
      <Paper sx={ConfirmationModalStyle.modalContainer}>
        <Box onClick={() => setShowModal(false)} sx={ConfirmationModalStyle.closeButton}>
          <CloseBlue />
        </Box>
        {title && (
          <Typography sx={ConfirmationModalStyle.title} variant="h6">
            {title}
          </Typography>
        )}
        {message && (
          <Typography id="modal-modal-description" sx={ConfirmationModalStyle.modalMessage}>
            {message}
          </Typography>
        )}
        {messageInfo1 && (
          <Typography id="modal-modal-description" sx={ConfirmationModalStyle.modalMessageInfoOnly}>
            {messageInfo1}
          </Typography>
        )}
        {messageInfo2 && (
          <Typography id="modal-modal-description" sx={ConfirmationModalStyle.modalMessageInfoOnly}>
            {messageInfo2}
          </Typography>
        )}

        <Box sx={ConfirmationModalStyle.buttonContainer}>
          {!hideCancelButton && (
            <Typography
              className="cursor-pointer"
              onClick={() => setShowModal(false)}
              sx={{ color: '#147AE9', width: '60px', mr: '49px' }}
              variant="subtitle2"
            >
              {cancelButtonName ? cancelButtonName : 'Cancel'}
            </Typography>
          )}
          <PrimaryButton
            onClick={() => {
              setShowModal(false);
              modalAction();
            }}
            sx={ConfirmationModalStyle.okButton}
          >
            {buttonName ? buttonName : 'Ok'}
          </PrimaryButton>
        </Box>
      </Paper>
    </Modal>
  );
};

export default ConfirmationModal;
