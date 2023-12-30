import { SxProps } from '@mui/system';

export const CourseStyles: { [key: string]: SxProps } = {
  courseContainer: { borderRadius: '16px', mt: '10px', py: '12px', px: '48', mb: '32px' },
  courseVideoNLectureContainer: { borderRadius: '12px' },
  courseLectureContainer: {
    backgroundColor: 'text.primary',
    borderRadius: '0px 0px 8px 8px',
    mb: 2,
    p: '20px 24px 24px 24px',
  },
  courseLectureGrid: { justifyContent: 'space-between' },
  currentLectureTitle: { color: 'background.default', mb: '4x' },
  videoLength: {
    color: 'secondary.secondary30',
    ml: '4px',
  },
  courseAccordionContainer: { background: 'common.white', borderRadius: '12px' },
  courseAccordion: {
    flexGrow: 0,
    paddingX: '24px',
    mb: '12px',
    backgroundColor: 'background.default',
    border: '1px solid #E7E7EB',
    borderRadius: '8px',
    '&.MuiPaper-root.MuiAccordion-root::before': {
      backgroundColor: 'white',
      flexGrow: 0,
      justifyContent: 'start',
    },
    '&.Mui-expanded': {
      backgroundColor: 'white',
    },
  },
  courseAccordionSummary: { padding: 0 },
  courseSessionTitle: { fontWeight: '700' },
  courseAccordionDetails: {
    p: 0,
    '& .MuiAccordionDetails-root': {
      p: 0,
    },
  },
  courseSkeletonVideo: {
    display: 'flex',
    flexDirection: 'column',

    mt: '24px',
  },
  courseSkeletonTab: { display: 'flex', justifyContent: 'space-between', mb: '32px', width: '60%' },
  courseSkeletonTabTitle: { mb: '16px' },
  fontSizeSkeleton14: { fontSize: '14px' },
  courseSkeletonAccordion: { borderRadius: '12px', mb: '12px' },
  courseSkeletonAccordionSmall: { borderRadius: '12px', mb: '12px' },
};
