import { SxProps } from '@mui/system';

export const FollowUserAllStyles: { [key: string]: SxProps } = {
  followUserAllContainer: {
    borderRadius: '12px',
    background: '#FFFF',
    mt: 3,
    p: '42px 34px 34px 34px',
    border: '1px solid #F3F3F5',
    boxShadow: '0px 6px 18px 2px rgba(0, 0, 0, 0.04)',
  },
  title: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 },
  listContainer: { mb: 3 },
  listItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 },
  photoNName: { display: 'flex', alignItems: 'center' },
  profileName: { mb: 1, ml: '12px', color: '#131336' },
  buttonContainer: { ml: 2 },
  cancelOrAddButton: {
    textTransform: 'capitalize',
    backgroundColor: '#0C72E0',
    color: '#FFFFFF',
    '&:hover': { color: '#0C72E0' },
  },
  removeButton: { textTransform: 'capitalize', backgroundColor: '#FFFF', ml: '8px' },
  loadMoreButtonContainer: { display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' },
  loadMoreButton: { textTransform: 'capitalize' },
};
