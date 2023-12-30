import React, { useEffect } from 'react';

import { Box } from '@mui/system';

import {
  Accordion,
  Typography,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Paper,
  Grid,
  Container,
  Button,
  useMediaQuery,
} from '@mui/material';

import {
  useGetCurrentUserEnrolledCourseByCourseIdQuery,
  useGetSessionsByCourseIdQuery,
  ISessionsResponse,
  ILecturesResponse,
  IPresentersResponse,
  useCreateOrUpdateUserCourseEnrollMutation,
  useCreateOrUpdateUserLectureActivityByLectureIdMutation,
  useLazyGetNextLectureByCourseIdAndLectureIdQuery,
  useGetLectureQuery,
  useGetListsOfCurrentUserLectureActivityQuery,
  useGetCourseQuery,
  useGetProfileQuery,
  useGetSessionsDetailsByCourseIdQuery,
  ENUM_ROLE_ACCESS_FOR,
} from '@newstart-online/sdk';

import Quiz from './Quiz';
import CourseLists from './CourseLists';
import VimeoPlayer from './VimeoPlayer';
import { useRouter } from 'next/router';
import { QuizModal } from './QuizModal';
import { ClockIconWhite } from '~/icons';
import CourseActions from './CourseActions';
import CourseLectureTabs from './CourseLectureTabs';
import { getDurationHMS } from '~/utils/getDurationHMS';
import CourseCompletedModal from './CourseCompletedModal';
import ChevronDownAccordian from '~/icons/downArrowIcon.svg';
import LearnCourseSkeleton from '../skeletons/LearnCourseSkeleton';
import { LearnCourses } from '~/modules/_core/styles/LearnCourses';
import { CourseStyles } from '~/modules/learn/styles/LearnCourseStyles';
import GenericUpgradeModal from '~/modules/_core/bits/modals/GenericUpgradeModal';
import { PolicyLinkArea } from '~/modules/_core/components/policyLink/PolicyLinkArea';
import { ENUM_LECTURE_ACCESS_FOR } from '~/utils/enums';

const Course: React.FC<{ courseId: string }> = ({ courseId }) => {
  const router = useRouter();
  const matchesSmallScreen = useMediaQuery('(max-width:1024px)');

  const { data: userProfileData } = useGetProfileQuery();
  const { data: currentLectureData, isFetching: currentLectureFetching } = useGetLectureQuery(
    (router?.query?.lecture as string) || '',
    {
      skip: !router.query.lecture,
    },
  );

  const currentLecture = currentLectureData as any;
  const { data: courseDetails } = useGetCourseQuery(courseId, { skip: !courseId });
  const [createOrUpdateUserCourseEnroll, { isLoading }] = useCreateOrUpdateUserCourseEnrollMutation();
  const [createOrUpdateUserLectureActivityByLectureId] = useCreateOrUpdateUserLectureActivityByLectureIdMutation();
  const [getNextLectureToPlay, { data: nextLecture, isError, error: nextLectureError, status }] =
    useLazyGetNextLectureByCourseIdAndLectureIdQuery();

  const { data: currentUserLectureActivity } = useGetListsOfCurrentUserLectureActivityQuery();
  const {
    data: courseStats,
    isLoading: currentUserCourseDetailLoading,
    data,
  } = useGetCurrentUserEnrolledCourseByCourseIdQuery(courseId, { skip: !courseId });

  const { data: sessions } = useGetSessionsDetailsByCourseIdQuery(courseId);
  const [quizModal, setQuizModal] = React.useState(false);
  const [autoPlay, setAutoPlay] = React.useState(false);

  const [updatePlanModal, setUpdatePlanModal] = React.useState(false);
  const [openCourseCompletedModal, setOpenCourseCompletedModal] = React.useState(false);

  const currentSelectedLectureUserActivity = currentUserLectureActivity?.data?.find(
    (activity: any) => activity.lectures?._id === router.query.lecture,
  );
  useEffect(() => {
    if (
      (currentLecture?.availableFor === ENUM_LECTURE_ACCESS_FOR.FREE_TRAIL_USER ||
        currentLecture?.availableFor === ENUM_LECTURE_ACCESS_FOR.PREMIUM_USER) &&
      userProfileData?.data?.role?.accessFor === ENUM_ROLE_ACCESS_FOR.FREE_USER
    ) {
      setUpdatePlanModal(true);
    }
  }, [currentLecture, userProfileData]);
  useEffect(() => {
    if (userProfileData?.data?.role?.accessFor === ENUM_ROLE_ACCESS_FOR.PREMIUM_USER && updatePlanModal === true) {
      setUpdatePlanModal(false);
      getNextLectureToPlay({
        courseId,
        params: {
          lectureId: router.query.lecture as string,
        },
      }).then((lectureData) => {
        lectureData?.data?.data?._id &&
          router.push(`/user/learn/courses/${courseId}?lecture=${lectureData?.data?.data?._id}`);
      });
    } else if (userProfileData?.data?.role?.accessFor === ENUM_ROLE_ACCESS_FOR.FREE_USER && updatePlanModal === true) {
      setUpdatePlanModal(false);
      getNextLectureToPlay({
        courseId,
      })
        .unwrap()
        .then((lectureData) => {
          lectureData?.data?._id && router.push(`/user/learn/courses/${courseId}?lecture=${lectureData?.data?._id}`);
        });
    }
  }, [userProfileData]);

  const isCourseCompletedModalShown = localStorage.getItem('isCourseCompletedModalShown');
  const courseCompletedByUserWithId = localStorage.getItem('courseCompletedByUserWithId');

  React.useEffect(() => {
    if (userProfileData !== undefined) {
      if (courseCompletedByUserWithId === userProfileData?.data?._id) {
        localStorage.setItem('isCourseCompletedModalShown', 'yes');
      } else {
        localStorage.setItem('isCourseCompletedModalShown', 'no');
      }
    }
  }, [userProfileData?.data, courseCompletedByUserWithId]);

  React.useEffect(() => {
    if (!courseStats?.data && !currentUserCourseDetailLoading) {
      createOrUpdateUserCourseEnroll({ courseId });
    }
  }, [courseStats]);

  React.useEffect(() => {
    if (sessions?.data?.length !== undefined && courseStats?.data?.completedSessionCount !== undefined) {
      if (isCourseCompletedModalShown === 'no' && sessions?.data?.length === courseStats?.data?.completedSessionCount) {
        setOpenCourseCompletedModal(true);
        localStorage.setItem('isCourseCompletedModalShown', 'yes');
        localStorage.setItem('courseCompletedByUserWithId', userProfileData?.data?._id || '');
      }
    }
  }, [courseStats?.data, sessions?.data, userProfileData?.data, isCourseCompletedModalShown]);

  React.useEffect(() => {
    if (router.query.lecture) {
      !currentSelectedLectureUserActivity &&
        createOrUpdateUserLectureActivityByLectureId({ lectureId: router.query.lecture as string });
    }
  }, [currentSelectedLectureUserActivity]);

  React.useEffect(() => {
    if (router?.query?.lecture) {
      getNextLectureToPlay({
        courseId,
        params: {
          lectureId: router.query.lecture as string,
        },
      });
    }
  }, [router?.query?.lecture]);

  const handleVideoPlayback = (lecture: ILecturesResponse) => {
    router.push(`/user/learn/courses/${courseId}?lecture=${lecture?._id}`);
  };

  const playNextLecture = () => {
    if (
      nextLectureError?.data.statusCode === 403 &&
      userProfileData?.data?.role?.accessFor !== ENUM_ROLE_ACCESS_FOR.PREMIUM_USER
    ) {
      setUpdatePlanModal(true);

      return;
    }
    if (!currentSelectedLectureUserActivity?.isCompleted) {
      currentLecture?._id &&
        createOrUpdateUserLectureActivityByLectureId({
          lectureId: currentLecture?._id,
          isCompleted: true,
          isQuizCompleted: !!currentLecture?.quiz,
        });
    }

    nextLecture?.data?._id && router.push(`/user/learn/courses/${courseId}?lecture=${nextLecture?.data?._id}`);
  };

  const toggleQuizModal = () => {
    setQuizModal(!quizModal);
  };

  if (currentLectureFetching) {
    return <LearnCourseSkeleton />;
  }
  const currentLectureDurationHMS = getDurationHMS(parseInt(currentLecture?.vimeoDetails?.duration, 10));

  return (
    <LearnCourses>
      <GenericUpgradeModal setModalStatus={setUpdatePlanModal} modalStatus={updatePlanModal} />
      <CourseCompletedModal setModalStatus={setOpenCourseCompletedModal} modalStatus={openCourseCompletedModal} />
      <QuizModal
        onCloseModal={() => {
          setQuizModal(false);
          playNextLecture();
        }}
        title="Quiz"
        isOpen={quizModal}
        closeModalText={'Skip Quiz'}
        showCloseButton={false}
      >
        <Quiz
          currentLecture={currentLecture}
          onSkipQuiz={() => {
            toggleQuizModal();
            playNextLecture();
          }}
        />
      </QuizModal>
      <Container maxWidth="xl" sx={CourseStyles?.courseContainer}>
        <Grid container spacing={3} direction={matchesSmallScreen ? 'column' : 'row'}>
          <Grid item xs={8}>
            <Paper sx={CourseStyles?.courseVideoNLectureContainer} elevation={0}>
              <div>
                <div className="reactPlayer">
                  <>
                    <VimeoPlayer
                      courseId={courseId}
                      autoPlay={autoPlay}
                      playNextLecture={
                        currentLecture?.quiz && !currentSelectedLectureUserActivity?.isQuizCompleted
                          ? toggleQuizModal
                          : playNextLecture
                      }
                      nextLecture={nextLecture?.data}
                      nextLectureError={nextLectureError}
                      url={currentLecture?.vimeoDetails?.playerEmbedUrl}
                      durations={currentLecture?.vimeoDetails?.duration}
                    />
                  </>
                </div>
                <Paper sx={CourseStyles?.courseLectureContainer} elevation={0}>
                  <Grid container sx={CourseStyles?.courseLectureGrid}>
                    <Grid item xs={10}>
                      <Stack direction="row" spacing={1}>
                        <Typography variant="h5" sx={CourseStyles?.currentLectureTitle}>
                          {currentLecture?.title} | {currentLecture?.sessions?.title}
                        </Typography>
                      </Stack>

                      {currentLecture?.description && (
                        <Grid container>
                          <Grid container xs={4} alignItems="center">
                            <ClockIconWhite />
                            <Typography sx={CourseStyles?.videoLength} variant="subtitle2">
                              {currentLectureDurationHMS?.hour}
                              {currentLectureDurationHMS?.min}
                              {currentLectureDurationHMS?.sec}
                            </Typography>
                          </Grid>
                        </Grid>
                      )}
                    </Grid>

                    {currentLecture && (
                      <CourseActions
                        lectureTitle={currentLecture?.title}
                        imageUrl={
                          currentLecture.vimeoDetails?.thumbNailImage || currentLecture?.featuredImage?.completedUrl
                        }
                        id={currentLecture?._id}
                        description={currentLecture?.description}
                        onQuizClicked={() => setQuizModal(true)}
                        currentSelectedLectureUserActivity={currentSelectedLectureUserActivity}
                      />
                    )}
                  </Grid>
                </Paper>
                <CourseLectureTabs
                  allPresenters={currentLecture?.presenters || []}
                  sessionCount={sessions?.data?.length || 0}
                  courseId={courseId || ''}
                  aboutDescriptions={courseDetails?.descriptions}
                  currentSelectedLectureUserActivity={currentSelectedLectureUserActivity}
                />
              </div>
            </Paper>
          </Grid>
          <Grid item xs={4} sx={{ mt: matchesSmallScreen ? '130px' : '0px' }}>
            <Paper sx={CourseStyles?.courseAccordionContainer} elevation={0}>
              <Box>
                {sessions &&
                  sessions?.data?.map((session, idx: number) => {
                    const durationHMS = getDurationHMS(parseInt(session.sessionDurationsInSeconds, 10));

                    return (
                      <Accordion
                        defaultExpanded={currentLecture?.sessions?._id === session?._id}
                        key={idx}
                        elevation={0}
                        sx={CourseStyles?.courseAccordion}
                      >
                        <AccordionSummary
                          expandIcon={<ChevronDownAccordian />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                          arai-session={session._id}
                          sx={CourseStyles?.courseAccordionSummary}
                        >
                          <Box>
                            <Typography key={idx} sx={CourseStyles?.courseSessionTitle}>
                              {session.title}
                            </Typography>

                            <Typography
                              variant="subtitle2"
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                fontWeight: '400',
                                fontSize: '14px',
                                color: '#5A5A72',
                              }}
                            >
                              {session?.completedLecturesCount}/{session?.lecturesCount}
                              <Box
                                sx={{
                                  background: '#A1A1AF',
                                  height: '5px',
                                  width: '5px',
                                  borderRadius: '50%',
                                  mx: '5px',
                                }}
                              />
                              {durationHMS?.hour}
                              {durationHMS?.min}
                              {durationHMS?.sec}
                            </Typography>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={CourseStyles?.courseAccordionDetails}>
                          <CourseLists
                            lectures={session?.lectures}
                            handleVideoPlayback={handleVideoPlayback}
                            sessionId={session._id || ''}
                            sessionTitle={session.title}
                          />
                        </AccordionDetails>
                      </Accordion>
                    );
                  })}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F3F3F5', pb: 3 }}>
        <PolicyLinkArea />
      </Box>
    </LearnCourses>
  );
};

export default Course;
