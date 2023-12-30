import { SxProps } from '@mui/system';

export const StartMealPlanStyles: { [key: string]: SxProps } = {
  backdrop: {
    color: 'common.white',
    background: 'backgound.dark',
    top: '54px',
  },
  startMealContainer: { width: '500px', height: '555px', pt: '54px', position: 'relative' },
  heading: { width: '307px' },
  closeButton: { position: 'absolute', right: '24px', top: '24px', cursor: 'pointer' },
  buttonContainer: { display: 'flex', justifyContents: 'center', with: '100%' },
  primaryButton: {
    borderRadius: '32px',
    p: '13px 71px',
    width: 'fit-content',
    ml: 'auto',
    mr: 'auto',
  },
};
