import { useEffect, useState } from 'react';

import { NextPage } from 'next';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

import { Box } from '@mui/system';
import { Container, Grid, Stack } from '@mui/material';
import { useGetFeedsDetailsQuery, useGetProfileQuery } from '@newstart-online/sdk';

import { PostObj } from '~/modules/community/Types';
import { PostFeed } from '~/modules/community/PostFeed';
import { LayoutArea } from '~/modules/_core/layout/LayoutArea';

const PublicProfile: NextPage = () => {
  const router = useRouter();

  const { feedId: _feedId } = router.query;
  const feedId = _feedId as string;

  const { data: feedData, isError, error } = useGetFeedsDetailsQuery(feedId);
  const feedDetailData = feedData?.data;
  const { data: profileData } = useGetProfileQuery();
  const [feeds, setFeeds] = useState<PostObj[]>([]);
  const [isAuthor, setIsAuthor] = useState<boolean>(false);

  useEffect(() => {
    if (feedDetailData !== undefined) {
      setFeeds([feedDetailData]);
    }
  }, [feedDetailData, feedId]);

  useEffect(() => {
    if (isError && error) {
      toast.error(error.data.message);
      router.push('/');
    }
  }, [isError]);

  useEffect(() => {
    setIsAuthor(profileData?.data?._id === feedDetailData?.author?._id);
  }, [feedDetailData?.author?._id, profileData?.data?._id]);

  return (
    <LayoutArea>
      <Box sx={{ background: '#E4E8F1', pt: 4, minHeight: `calc(100vh - 120px)` }}>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid item xs={3}></Grid>
            <Grid item xs={6}>
              <Stack direction="column" spacing={2}>
                {feeds.map((postObj) => {
                  return (
                    <>
                      <PostFeed
                        key={postObj._id}
                        postObj={postObj}
                        setFeeds={setFeeds}
                        currentUser={isAuthor ? profileData?.data?._id : null}
                        isFeedSinglePage
                      />
                    </>
                  );
                })}
              </Stack>
            </Grid>
            <Grid item xs={3}></Grid>
          </Grid>
        </Container>
      </Box>
    </LayoutArea>
  );
};

export default PublicProfile;
