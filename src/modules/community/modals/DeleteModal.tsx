import React, { ReactElement } from 'react';

import { Box } from '@mui/system';

import Close from '@mui/icons-material/Close';
import { Button } from '~/modules/_core/bits/buttons/Button';
import { IconButton, Paper, Typography } from '@mui/material';
import { LoadingBtn } from '~/modules/_core/bits/buttons/LoadingBtn';

interface Props {
  closeModal: () => void;
  onDelete: () => void;
  loading?: boolean;
  buttonText?: string;
  deleteMessage?: string | undefined;
  deteteModalTitle?: string | undefined;
}

export function DeleteModal({
  closeModal,
  onDelete,
  deteteModalTitle,
  deleteMessage,
  buttonText,
  loading,
}: Props): ReactElement {
  return (
    <Paper
      sx={{
        pt: 3,
        pb: 4,
        pr: 3,
        pl: 4,
        borderRadius: '12px',
        width: '560px',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <>
        <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
          <IconButton onClick={() => closeModal()}>
            <Close />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Typography variant="h5" sx={{ marginBottom: '8px', textAlign: 'center' }}>
            {deteteModalTitle ? deteteModalTitle : 'Delete Post?'}
          </Typography>
          <Typography sx={{ fontSize: '14px' }}>
            {deleteMessage ? deleteMessage : 'Are you sure you want to delete this post?'}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '24px' }}>
            <Button
              sx={{
                marginRight: '4px',
                background: 'none',
                color: '#0C72E0',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
              onClick={() => closeModal()}
            >
              Cancel
            </Button>
            <LoadingBtn sx={{ borderRadius: '32px' }} onClick={() => onDelete()} loading={loading}>
              {buttonText ? buttonText : 'Delete'}
            </LoadingBtn>
          </Box>
        </Box>
      </>
    </Paper>
  );
}
