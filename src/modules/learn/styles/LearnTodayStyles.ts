import { SxProps } from '@mui/system';

export const LearnTodayStyles: { [key: string]: SxProps } = {
  learnTodayContainer: { borderRadius: '16px', mt: '16px', pt: '58px', px: '48px', pb: '40px' },
  learnTodaySkeletonOutermost: { m: '8px auto 16px auto', padding: '16px 24px 0 24px' },
  firstTimeVisitGrid: { background: '#E8F2FD', pb: 4, borderRadius: '12px', padding: '0' },
  firstVisitDataTitle: { width: '100%', pt: '16px' },
  firstVisitSessionTitle: { mt: '24px' },
  firstVisitLectureTitle: { mt: '8px' },
  firstVisitLinkContainer: { my: '32px' },
  firstVisitImageContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    cursor: 'pointer',
    mb: '32px',
  },
  playIconStyle: { position: 'absolute' },
  topicsTitle: {},
  topicsButtonContainer: { mt: '24px' },
  recipesContainer: { display: 'flex', justifyContent: 'space-between', my: '34px' },
  seeAllButton: {
    textTransform: 'none',
    fontSize: '16px',
    padding: '0',
    fontWeight: 'bold',
    '&.MuiButtonBase-root:hover': {
      bgcolor: 'transparent',
    },
  },
  recipesCardContainer: { display: 'flex', alignitems: 'center', gap: '12px' },
  recipesCardContainerSkeleton: {
    height: '300px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  recipesCardSkeleton: {
    width: '24%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    justifyContent: 'flex-end',
  },
  cardSkeletonText: {
    mt: '16px',
  },
  cardSkeletonPhoto: {
    height: '80%',
    borderRadius: '7px',
  },
  cardSkeletonTitle: {
    fontSize: '24px',
    mt: '34px',
    mb: '34px',
  },
  skeletonOptionContainer: { display: 'flex', justifyContent: 'space-between', width: '400px' },
  skeletonOptions: { width: '80px', borderRadius: '12px', height: '32px' },
};
