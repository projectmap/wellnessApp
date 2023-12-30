import { useRouter } from 'next/router';
import { Typography, Grid, Box, useMediaQuery } from '@mui/material';
import { Button, Container } from '@mui/material';
import {
  useListPaginatedBlogsQuery,
  IBlogsResponse,
  useListPaginatedRecipeQuery,
  useGetCurrentUserRunningLectureQuery,
  useGetCurrentUserCompletedCourseQuery,
  BLOGS_STATUS,
} from '@newstart-online/sdk';

import { ChevronBlueRight, CloseBtnGray, Play } from '~/icons';
import BlogCard from '~/modules/learn/BlogCard';
import { LearnResources } from '~/modules/_core/styles/LearnResources';
import { CommunityFooterLinks } from '~/modules/community/CommunityFooterLinks';

import Congratulations from '~/modules/learn/today/Congratulations';
import { LearnTodayStyles } from '~/modules/learn/styles/LearnTodayStyles';
import { DefaultLink } from '~/modules/_core/components/links/DefaultLink';
import { useAppDispatch, useAppSelector } from '~/state/app/hooks';
import Image from 'next/image';
import { setShowCurrentLectureProgress } from '~/state/services/learn/learnSlice';

const Resources = () => {
  const router = useRouter();
  const matchesSmallScreen = useMediaQuery('(max-width:1024px)');

  const showCurrentLectureProgress = useAppSelector((state) => state.learn.showCurrentLectureProgress);
  const dispatch = useAppDispatch();
  const { data: isFirstTimeVisitByUser, isLoading } = useGetCurrentUserRunningLectureQuery();
  const { data: isUsersCourseCompleted } = useGetCurrentUserCompletedCourseQuery();

  const currentSession = isFirstTimeVisitByUser?.data?.lectures?.sessions;

  const currentLecture = isFirstTimeVisitByUser?.data?.lectures;

  const { data: featureLists } = useListPaginatedBlogsQuery({
    page: 1,
    perPage: 4,
    featured: 'true',
    status: BLOGS_STATUS.PUBLISHED,
  });
  const { data: recommendedBlogs } = useListPaginatedBlogsQuery({
    page: 1,
    perPage: 4,
    featured: 'false',
    status: BLOGS_STATUS.PUBLISHED,
  });
  const { data: latestBlogs } = useListPaginatedBlogsQuery({
    page: 1,
    perPage: matchesSmallScreen ? 3 : 4,
    status: BLOGS_STATUS.PUBLISHED,
  });
  const { data: paginatedRecipeLists } = useListPaginatedRecipeQuery({
    page: 1,
    perPage: matchesSmallScreen ? 3 : 4,
    status: BLOGS_STATUS.PUBLISHED,
  });

  const blogsWithSubSections = [
    {
      title: 'Featured',
      data: featureLists,
    },
    {
      title: 'More Recommendations',
      data: recommendedBlogs,
    },
    {
      title: 'Latest Resources',
      data: latestBlogs,
      allLink: '/user/learn/resources/all',
    },
    // {
    //   title: 'Latest Videos',
    //   data: latestVideos,
    //   allLink: '/user/learn/resources/videos',
    // },
    {
      title: 'Recipes',
      data: paginatedRecipeLists,
      allLink: '/user/learn/resources/recipes/',
    },
  ];

  return (
    <>
      {isFirstTimeVisitByUser?.data &&
        showCurrentLectureProgress &&
        (isUsersCourseCompleted?.data?.[0]?.isCourseCompleted ? (
          <Congratulations
            certificate={isUsersCourseCompleted?.data?.[0]?.certificate?.completedUrl}
            courseID={isUsersCourseCompleted?.data?.[0]?.course}
          />
        ) : (
          <Container maxWidth={matchesSmallScreen ? 'md' : 'xl'} sx={LearnTodayStyles?.learnTodayContainer}>
            <Grid container spacing={4} sx={LearnTodayStyles?.firstTimeVisitGrid}>
              <Grid item xs={matchesSmallScreen ? 4 : 3}>
                <Box>
                  <Typography variant={matchesSmallScreen ? 'h5' : 'h4'} sx={LearnTodayStyles?.firstVisitDataTitle}>
                    Pick up from where you left off
                  </Typography>
                  <Typography variant="body2" sx={LearnTodayStyles?.firstVisitSessionTitle}>
                    {currentSession?.title}
                  </Typography>
                  <Typography variant="h6" sx={LearnTodayStyles?.firstVisitLectureTitle}>
                    {currentLecture?.title}
                  </Typography>
                  <Box sx={LearnTodayStyles?.firstVisitLinkContainer}>
                    <DefaultLink
                      to={`/user/learn/course/${currentLecture?.sessions?.course}/?lecture=${currentLecture?._id}`}
                    >
                      Continue
                    </DefaultLink>
                  </Box>
                </Box>
              </Grid>
              <Grid
                onClick={() =>
                  router.push(
                    `/user/learn/course/${isFirstTimeVisitByUser?.data?.lectures?.sessions?.course}/?lecture=${currentLecture?._id}`,
                  )
                }
                item
                xs={matchesSmallScreen ? 6 : 5}
                sx={LearnTodayStyles?.firstVisitImageContainer}
              >
                <Box sx={{ width: '478px', height: '272px', position: 'relative' }}>
                  <Image
                    src={
                      isFirstTimeVisitByUser?.data?.lectures?.vimeoDetails?.thumbNailImage ||
                      isFirstTimeVisitByUser?.data?.lectures?.featuredImage?.completedUrl
                    }
                    alt={isFirstTimeVisitByUser?.data?.lectures?.featuredImage?.filename}
                    layout="fill"
                  />
                </Box>
                <Box sx={LearnTodayStyles?.playIconStyle}>
                  <Play />
                </Box>
              </Grid>
              <Grid item xs={matchesSmallScreen ? 2 : 4}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mr: '38px' }}>
                  <CloseBtnGray
                    onClick={() => dispatch(setShowCurrentLectureProgress(false))}
                    className="cursor-pointer"
                  />
                </Box>
              </Grid>
            </Grid>
          </Container>
        ))}
      <LearnResources>
        {blogsWithSubSections.map((item, index) => {
          return (
            <Box key={index} sx={{ backgroundColor: !(index % 2) ? '#F6F8F9' : '#FFFFFF' }}>
              <Container maxWidth="xl" sx={{ borderRadius: '16px', mt: '16px', py: '32px', px: '48', mb: '32px' }}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', my: '24px' }}>
                    <Typography variant="h5">{item.title}</Typography>
                    {item.allLink && (
                      <Button
                        endIcon={<ChevronBlueRight />}
                        sx={{
                          textTransform: 'none',
                          fontSize: '16px',
                          padding: '0',
                          fontWeight: 'bold',
                          '&.MuiButtonBase-root:hover': {
                            bgcolor: 'transparent',
                          },
                        }}
                        onClick={() => router.push(item.allLink)}
                      >
                        See all
                      </Button>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', alignitems: 'center', gap: '12px' }}>
                    {item?.data?.data?.map((blog: IBlogsResponse) => {
                      const categoryTitle = blog?.categories;

                      return (
                        <div key={blog._id} className="card-item" style={{ maxWidth: '375px' }}>
                          <BlogCard
                            title={blog.title}
                            imgSrc={blog?.vimeoDetails?.thumbNailImage || blog.featuredImage}
                            author={blog.author}
                            catTitle={categoryTitle}
                            id={blog._id}
                            onClick={() => {
                              if (item?.title === 'Recipes') {
                                router.push(`/user/learn/recipe/${blog._id}`);
                              } else {
                                router.push(`/user/learn/resources/detail/${blog._id}`);
                              }
                            }}
                          />
                        </div>
                      );
                    })}
                  </Box>
                </Box>
              </Container>
            </Box>
          );
        })}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CommunityFooterLinks />
        </Box>
      </LearnResources>
    </>
  );
};

export default Resources;
