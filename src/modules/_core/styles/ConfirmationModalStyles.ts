import { SxProps } from '@mui/system';

export const ConfirmationModalStyle: { [key: string]: SxProps } = {
  confirmationModalOutermost: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modalContainer: {
    position: 'relative',
    width: '460px',
    p: '48px 32px 24px 32px',
    borderRadius: '12px',
    outline: 'none',
  },
  modalMessage: { mt: 2, textAlign: 'center' },
  modalMessageInfoOnly: { mt: 2, textAlign: 'left' },
  buttonContainer: {
    width: '260px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    mt: '32px',
    ml: 'auto',
    mr: 'auto',
  },
  okButton: { borderRadius: '24px', p: '8px 16px' },
  closeButton: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    display: 'flex',
    justifyContent: 'flex-end',
    cursor: 'pointer',
  },
  title: { textAlign: 'center' },
};
