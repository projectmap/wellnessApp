import { SxProps } from '@mui/system';

export const RecentMessagesStyles: { [key: string]: SxProps } = {
  recentMessageContainer: { border: '1px solid #E7E7EB', borderRadius: '8px', mt: '36px', p: '24px 8px 24px 16px' },
  rencentMessageGroup: {
    display: 'flex',
    alignItems: 'center',
    mt: '16px',
    justifyContent: 'space-between',
    cursor: 'pointer',
  },
  defaultPhoto: { height: '48px', width: '48px' },
  messageAndGroupName: { display: 'flex', flexDirection: 'column', ml: '16px' },
  photoMessageAndGroup: { display: 'flex', alignItems: 'center' },
  groupName: { fontWeight: '500', fontSize: '14px', textTransform: 'capitalize', color: '#43494D' },
  groupMessage: {
    fontWeight: '400',
    fontSize: '14px',
    opacity: '0.8',
    color: '#5A5A72',
    maxWidth: '170px',
  },
  messageTime: { fontWeight: '400', fontSize: '12px', opacity: '0.8', color: '#5A5A72' },
  seeAllButton: { display: 'flex', justifyContent: 'center', cursor: 'pointer', mt: '16px' },
  skeletonWidth80: { width: '80px' },
  skeletonWidth40: { width: '40px' },
  buttonText: { color: 'primary.main' },
};
