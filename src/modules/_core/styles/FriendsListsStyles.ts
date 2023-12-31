import { SxProps } from '@mui/system';

export const FriendsListsStyles: { [key: string]: SxProps } = {
  friendListContainer: {
    px: 2,
    py: 3,
    borderRadius: '12px',
    border: '1px solid #F3F3F5',
    boxShadow: '0px 6px 18px 2px rgba(0, 0, 0, 0.04)',
  },
  searchBarContainer: { display: 'flex', alignItems: 'center', mb: '24px' },
  searchBar: {
    padding: '16px',
    background: '#FFFF',
    width: '100%',
  },
  listItemContainer: { display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' },
  photoNname: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  profileName: { marginLeft: 2, color: '#131336' },
  waitingText: { color: 'primary.main', display: 'flex', alignItems: 'center', fontWeight: '400' },
  rejectedFriendInfoText: {
    color: 'error.main',
    display: 'flex',
    alignItems: 'center',
    fontWeight: '400',
    mb: '12px',
  },
  friendStatusText: { color: '#131336', fontWeight: 500 },
  respondButtonContainer: { width: 'fit-content', mt: '8px' },
  respondButton: { textTransform: 'capitalize' },
  deleteButton: { textTransform: 'capitalize', ml: '8px' },
  addCancelButton: { textTransform: 'capitalize', height: '36px' },
  showAllButtonContainer: { display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' },
  showAllButton: { textTransform: 'capitalize' },
  friendTitle: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 },
  friendList: { display: 'flex', justifyContent: 'space-between', mb: 2 },
  imageNname: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  loadMoreButtonContainer: { display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' },
  errorMessage: { color: 'error.main' },
};
