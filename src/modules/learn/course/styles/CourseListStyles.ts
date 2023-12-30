import { SxProps } from '@mui/system';

export const CourseListsStyles: { [key: string]: SxProps } = {
  listItemButton: {
    p: 0,
    textTransform: 'none',
    '&.MuiButtonBase-root:hover': {
      background: 'transparent',
    },
    '& &.MuiButtonBase-root': {
      p: 0,
    },
    pl: 0,

    '& .MuiListItem-root': {
      p: 0,
      py: '12px',
    },
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    px: 0,
  },
  lectureTitle: {
    pl: 0,
    fontWeight: '400',
  },
  videoDuration: {
    color: 'rgba(19, 19, 54, 0.7)',
    fontSize: '12px',
    fontWeight: '400',
  },
  sideBar: { width: '2px', height: '14px', border: '2px solid #0C72E0' },
  pauseIcon: { display: 'flex', justifyContent: 'space-between', width: '12px' },
  capitalizeText: { textTransform: 'capitalize', display: 'inline', fontSize: '32px' },
};
