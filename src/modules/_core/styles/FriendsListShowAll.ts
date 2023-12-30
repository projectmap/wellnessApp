import { SxProps } from '@mui/system';

export const FriendListShowAllStyles: { [key: string]: SxProps } = {
  friendListContainer: { backgroundColor: '#FFFFFF', borderRadius: '12px', p: '42px 34px 34px 34px' },
  titleContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 },
  listContainer: { mb: 3 },
  friendListItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 },
  photoNName: { display: 'flex', alignItems: 'center' },
  profileName: { mb: 1, ml: '12px', color: '#131336' },
  buttonContainer: { ml: 2 },
  confirmButton: { textTransform: 'capitalize' },
  deleteButton: { textTransform: 'capitalize', ml: '8px' },
  loadMoreButton: { borderRadius: '42px' },
};
