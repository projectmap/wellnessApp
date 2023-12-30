import { SxProps } from '@mui/system';

export const CustomMealModalStyles: { [key: string]: SxProps } = {
  customMealModalContainer: {
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    p: '72px 40px 52px 32px',
  },
  switchModalContainer: {
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    p: '72px 40px 52px 32px',
    width: '75%',
  },
  closeButton: { position: 'absolute', right: '30px', top: '30px', cursor: 'pointer' },
  startDateLabel: { mt: '24px', mb: '8px' },
  cycleNoLabel: { mt: '24px', mb: '8px' },
  cycleNoFieldWrapper: { display: 'flex', flexDirection: 'column' },
  textField: { width: '440px' },
  errorMessage: { color: 'error.main', marginTop: '8px' },
  primaryButtonModify: { width: '100%', pt: '10px', pb: '10px', borderRadius: '90px', mt: '24px' },
  switchButton: {
    pt: '10px',
    pb: '10px',
    borderRadius: '90px',
    mt: '24px',
  },
};
