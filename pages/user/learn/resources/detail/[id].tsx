import Image from 'next/image';
import Slider from 'react-slick';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { Box, Container, Stack, Typography } from '@mui/material';
import {
  IBlogsResponse,
  useGetBlogsQuery,
  useGetProfileQuery,
  ENUM_ROLE_ACCESS_FOR,
  useGetRelatedBlogsByBlogsIdQuery,
} from '@newstart-online/sdk';

import { ShareBox } from '~/modules/learn/recipe';
import VideoPlayer from '~/modules/learn/recipe/VideoPlayer';
import { LearnToday } from '~/modules/_core/styles/LearnToday';
import { LayoutArea } from '~/modules/_core/layout/LayoutArea';
import { COMMUNITY_SHARE_MODAL_TYPE } from '~/state/constants';
import { FIREBASE_EVENTS_ENUM } from '~/config/firebase.config';
import { LearnResources } from '~/modules/_core/styles/LearnResources';
import { GoBackButton } from '~/modules/_core/bits/buttons/GoBackButton';
import GoogleAnalytics from '~/common-ui/GoogleAnalytics/GoogleAnalytics';
import { LoaderArea } from '~/modules/_core/components/loaderPage/LoaderArea';
import RelatedSection from '~/modules/learn/resources/DetailPageRelatedSection';
import GenericUpgradeModal from '~/modules/_core/bits/modals/GenericUpgradeModal';
import { PolicyLinkArea } from '~/modules/_core/components/policyLink/PolicyLinkArea';

const Article: NextPage<{
  id: string;
}> = ({ id }) => {
  const router = useRouter();

  const { data: userAccessStatus } = useGetProfileQuery();
  const [updatePlanModal, setUpdatePlanModal] = React.useState(
    userAccessStatus?.data?.role?.accessFor === ENUM_ROLE_ACCESS_FOR.FREE_USER,
  );

  const { data: relatedBlogs } = useGetRelatedBlogsByBlogsIdQuery(id, { skip: !id });
  const { data: blogsDetails, isLoading } = useGetBlogsQuery(id, { skip: !id });

  useEffect(() => {
    setUpdatePlanModal(userAccessStatus?.data?.role?.accessFor === ENUM_ROLE_ACCESS_FOR.FREE_USER);
  }, [userAccessStatus?.data?.role?.accessFor]);

  const settings = {
    nav: true,
    dots: true,
    infinite: true,
    speed: 500,
    centerPadding: '10px',
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
  };

  if (isLoading) return <LoaderArea />;

  return (
    <GoogleAnalytics firebaseEvent={FIREBASE_EVENTS_ENUM.RESOURCE_DETAIL}>
      <LayoutArea>
        <GenericUpgradeModal setModalStatus={setUpdatePlanModal} modalStatus={updatePlanModal} />
        <Container maxWidth="lg" sx={{ borderRadius: '16px', mt: '16px', py: '32px', px: '48', mb: '32px' }}>
          <GoBackButton />

          <Box mt="10px">
            <Box>
              <Box sx={{ width: '100%', mb: '32px' }}>
                {blogsDetails?.videoUrl ? (
                  <VideoPlayer url={blogsDetails?.videoUrl} />
                ) : (
                  <Slider {...settings}>
                    {blogsDetails?.featuredImage?.map((item, index: number) => (
                      <Box sx={{ position: 'relative', height: '546px' }} key={item?.id}>
                        <Image
                          className="slider-image"
                          key={index}
                          src={item.completedUrl}
                          objectFit="contain"
                          layout="fill"
                          alt={item.originalName}
                        />
                      </Box>
                    ))}
                  </Slider>
                )}
              </Box>
            </Box>
            <Typography variant="h4" sx={{ width: '75%', py: 5 }}>
              {blogsDetails?.title}
            </Typography>
            <LearnResources>
              <Box sx={{ display: 'flex' }}>
                <Box sx={{ width: '80%' }}>
                  <Stack direction="row" alignItems="center" sx={{ mb: 6 }}>
                    <Typography sx={{ fontSize: '16px', color: '#131336', opacity: '0.8' }}>
                      {blogsDetails?.author}
                    </Typography>
                    <Typography sx={{ fontSize: '16px', color: '#131336', opacity: '0.8' }}>
                      • {blogsDetails?.readDuration} read
                    </Typography>
                  </Stack>
                  {blogsDetails?.content && (
                    <Typography dangerouslySetInnerHTML={{ __html: blogsDetails?.content }} variant="body1" />
                  )}
                </Box>
                {blogsDetails && (
                  <ShareBox
                    contentId={blogsDetails._id || ''}
                    articleContent={blogsDetails?.content}
                    title={blogsDetails?.title}
                    imageUrl={
                      blogsDetails?.vimeoDetails?.thumbNailImage || blogsDetails?.featuredImage[0]?.completedUrl || ''
                    }
                    description={blogsDetails?.content}
                    shareModalType={COMMUNITY_SHARE_MODAL_TYPE.sharedResource}
                  />
                )}
              </Box>
            </LearnResources>
          </Box>
        </Container>
        <LearnToday>
          <Box sx={{ background: '#F0F0F0', py: 4, mt: 8 }}>
            <Container>
              <Typography variant="h5" sx={{ mb: 6 }}>
                {' Related Videos'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {relatedBlogs?.data
                  ?.filter((item: IBlogsResponse) => item?._id !== router?.query?.id)
                  ?.slice(0, 4)
                  .map((relatedVideo: IBlogsResponse) => (
                    <RelatedSection relatedBlog={relatedVideo} key={relatedVideo._id} />
                  ))}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: '32px', height: '52px' }}>
                <PolicyLinkArea />
              </Box>
            </Container>
          </Box>
        </LearnToday>
      </LayoutArea>
    </GoogleAnalytics>
  );
};

export default Article;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = ctx.query.id as string;

  return {
    props: {
      id,
    },
  };
};
