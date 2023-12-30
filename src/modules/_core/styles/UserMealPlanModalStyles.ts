import { SxProps } from '@mui/system';

export const UserMealPlanModalStyles: { [key: string]: SxProps } = {
  userMealPlanModalContainer: {
    backgroundColor: 'background.paper',
    position: 'fixed',
    left: '50%',
    top: '50%',
    bottom: '0',
    transform: 'translate(-50%, -50%)',
    width: '463px',
    height: 'fit-content',
    p: '24px',
    borderRadius: '4px',
  },
  closeButton: { position: 'absolute', right: '24px', top: '24px', cursor: 'pointer' },
  searchMessage: { mt: '24px', color: 'error.main' },
  suggestionsTitle: { mt: '24px' },
  suggestedMealItemHolder: { mt: '24px', mb: '32px', minHeight: '200px' },
  suggestedMealItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: '12px',
  },
  suggestedMealItemTitleImage: { display: 'flex', alignItems: 'center' },
  suggestedMealItemTitle: { ml: '24px' },
  saveButtonHolder: { display: 'flex', justifyContent: 'center', mt: '24px' },
  saveButton: {
    borderRadius: '32px',
    background: 'white',
    border: '1px solid #D0D0D7 ',
    p: '10px 24px',
    backgroundColor: 'primary.dark',
    '&:hover': {
      boxShadow: 'none',
    },
  },
};
