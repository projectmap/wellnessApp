import { SxProps } from '@mui/system';

export const CourseActionsStyles: { [key: string]: SxProps } = {
  courseActionContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '33px',
  },
  iconButton: { display: 'flex', flexDirection: 'col', alignSelf: 'center' },
  quizTitle: { fontSize: '11px', textAlign: 'center', color: 'secondary.secondary30' },
  shareButton: { fontSize: '11px', textAlign: 'center', color: 'secondary.secondary30' },
};
