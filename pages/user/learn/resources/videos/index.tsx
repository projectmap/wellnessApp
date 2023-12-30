import Image from 'next/image';
import { useRouter } from 'next/router';
import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Box, Container } from '@mui/system';
import { NextPage, GetServerSideProps } from 'next';

import { HalfLeftArrow, Play } from '~/icons';
import { LayoutArea } from '~/modules/_core/layout/LayoutArea';
import { LearnResources } from '~/modules/_core/styles/LearnResources';
import { ButtonWithIcon } from '~/modules/_core/bits/buttons/IconButton';
import { PrimaryButton } from '~/modules/_core/bits/buttons/PrimaryButton';
import { LoaderArea } from '~/modules/_core/components/loaderPage/LoaderArea';
import { useListPaginatedBlogsQuery, IBlogsResponse, BLOGS_STATUS } from '@newstart-online/sdk';

const LatestVideos: NextPage<{ query: { category: string; page: string } }> = ({ query }) => {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data: latestVideos, isLoading } = useListPaginatedBlogsQuery({
    page: query.page || page,
    perPage: 4,
    category: 'Videos',
    status: BLOGS_STATUS.PUBLISHED,
  });

  const [videoList, setVideoList] = useState<any>([]);

  const handleLoadMore = () => {
    setPage((prevState) => prevState + 1);
  };

  useEffect(() => {
    latestVideos?.data?.length && setVideoList((prevState: any) => [...prevState, ...(latestVideos?.data || [])]);
  }, [latestVideos?.data]);

  if (isLoading) {
    return <LoaderArea />;
  }

  return (
    <LearnResources>
      <LayoutArea>
        <Container maxWidth="xl" sx={{ borderRadius: '16px', mt: '16px', py: '32px', px: '48', mb: '32px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 6.5, mt: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 6.5, mt: 4 }}>
              <ButtonWithIcon
                icon={<HalfLeftArrow />}
                onClick={() => router.back()}
                sx={{ fontSize: '32px', fontWeight: 700 }}
              >
                Latest Videos
              </ButtonWithIcon>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', my: '24px', flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignitems: 'center', gap: '12px', flexWrap: 'wrap', width: '100%' }}>
              {videoList?.map((video: IBlogsResponse) => (
                <Box
                  sx={{ width: '24%', position: 'relative' }}
                  key={video._id}
                  onClick={() => router.push(`/user/learn/resources/detail/${video._id}`)}
                >
                  <Image
                    width="281px"
                    height="212px"
                    layout="responsive"
                    src={video?.featuredImage?.length ? video?.featuredImage[0].completedUrl : ''}
                    alt="title"
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      height: '54px',
                      width: '54px',
                      top: '38%',
                      left: '50%',
                      transform: 'translate(-50%,-50%)',
                    }}
                  >
                    <Play />
                  </Box>
                  <Typography className="card-desc" variant="subtitle1" sx={{ mt: '16px', width: '90%' }}>
                    {video.title}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: '0.5', mt: '12px' }}>
                    {video.author}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
          {latestVideos?.totalData > videoList?.length && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: '48px' }}>
              <PrimaryButton onClick={handleLoadMore} sx={{ borderRadius: '32px' }}>
                Load More
              </PrimaryButton>
            </Box>
          )}
        </Container>
      </LayoutArea>
    </LearnResources>
  );
};

export default LatestVideos;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const query = ctx.query as { category: string; page: string };

  return {
    props: {
      query,
    },
  };
};
