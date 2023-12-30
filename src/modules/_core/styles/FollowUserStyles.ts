import { SxProps } from '@mui/system';

export const FollowUserStyles: { [key: string]: SxProps } = {
  followUserContainer: {
    pt: 3,
    pl: 3,
    pb: 4,
    borderRadius: '12px',
    background: '#FFFF',
    mt: 3,
    mb: 3,
    border: '1px solid #F3F3F5',
  },
  suggestionContainer: { pt: 3, pl: 3, pb: 4 },
  followUserContainerSuggestion: {
    display: 'flex',
  },
  titleFollow: { mb: 4 },
  photoAndNameContainer: { display: 'flex', alignItems: 'center', mb: 3 },
  buttonContainer: { display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' },
  capitalize: { textTransform: 'capitalize' },
  followName: { mb: 1, color: '#131336' },
  friendListContainer: { mb: 3 },
  suggestionTitleContainer: { mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  suggestionCard: { padding: '6px !important' },
  suggestionImageNameButtonContainer: { border: '1px solid #E8F2FD', p: 1, borderRadius: '4px' },
  suggestionCloseButton: { display: 'flex', justifyContent: 'flex-end' },
  suggestionAvatarAndName: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileNameNbutton: { ml: 2 },
  suggestionLink: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  suggestionName: { mt: 1.5, mb: 1, color: '#131336' },
  suggestionButton: { textTransform: 'capitalize', mb: 2 },
  skeletonNameNbutton: { mt: 2, ml: 2 },
  skeletonListContainer: { mb: 3, mt: 3 },
  photoAndNameContainerSuggestion: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '200px',
    borderRadius: '12px',
    background: '#FFFF',
    border: '1px solid #F3F3F5',
    ml: '8px',
    p: '16px ',
  },
  skeletonNameNbuttonSuggestion: { mt: '24px' },
  followUserContainerSuggestionTitle: { fontSize: '24px', mb: '24px' },
};