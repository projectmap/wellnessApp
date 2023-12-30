import React, { FC, ReactNode } from 'react';
import { Box, Paper, Typography, Modal, SxProps, Theme } from '@mui/material';

import { CloseIcon } from '~/icons';
import { Button } from '~/modules/_core/bits/buttons/Button';

export type OnCloseModal = {
  status?: boolean;
  (event?: {}, reason?: 'backdropClick' | 'escapeKeyDown'): void;
};

interface Model {
  onCloseModal: OnCloseModal;
  title?: string;
  children: ReactNode;
  isOpen: boolean;
  closeModalText?: string;
  closeModalCross?: boolean;
  showCloseButton?: boolean;
  sx?: SxProps<Theme> | undefined;
}
const GenericOnboardingSectionModal: FC<Model> = ({
  onCloseModal,
  title,
  children,
  isOpen,
  closeModalText = 'Close',
  showCloseButton = true,
  closeModalCross,
  sx,
}) => {
  return (
    <Modal open={isOpen} onClose={onCloseModal} disableEscapeKeyDown>
      <Paper
        sx={{
          pt: 3,
          pb: 6,
          pr: 4,
          pl: 4,
          borderRadius: '12px',
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          '&.MuiPaper-root:focus-visible': {
            outline: 'none',
            border: 'transparent',
          },
          ...sx,
        }}
        elevation={0}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '24px' }}>
          <Typography variant="h5">{title}</Typography>
          {closeModalCross ? <CloseIcon onClick={() => onCloseModal(false)} style={{ cursor: 'pointer' }} /> : null}
        </Box>
        {children}

        {showCloseButton && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: '24px' }}>
            <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Button onClick={() => onCloseModal(false)}>{closeModalText}</Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Modal>
  );
};
export { GenericOnboardingSectionModal };
