import { useEffect, useState } from 'react';

import { NextPage } from 'next';
import { useRouter } from 'next/router';
import InfiniteScroll from 'react-infinite-scroll-component';

import { Card } from '~/modules/_core/bits/cards';

import { removeDuplicates } from '~/utils/helpers';
import { PostFeed } from '~/modules/community/PostFeed';
import { FollowUser } from '~/modules/community/FollowUser';
import { SendPrayers } from '~/modules/community/SendPrayers';
import { LayoutArea } from '~/modules/_core/layout/LayoutArea';
import { StickyDiv } from '~/modules/community/styles/StickyDiv';
import { FeedsRootObject, PostObj } from '~/modules/community/Types';
import { QRCodeModel } from '~/modules/_core/bits/modals/QrCodeModel';

import { EditProfileModel } from '~/modules/_core/bits/modals/EditProfileModel';

import { Box } from '@mui/system';
import { Container, Grid, Modal, Stack } from '@mui/material';

import { UserProfile } from '../community/UserProfile';
import CommunityPostBox from '../community/components/CommunityPostBox';

import { IPaginatedResponse, useGetCurrentUserPostsQuery, useGetProfileQuery } from '@newstart-online/sdk';

const Posts: NextPage = () => {
  const router = useRouter();
  const { userId: _userId } = router.query;

  const { data } = useGetProfileQuery();

  const profileData = data?.data;

  const userId = _userId as string;

  const [openQRModal, setOpenQRModal] = useState<boolean>(false);
  const [openProfileModal, setOpenProfileModal] = useState<boolean>(false);

  const handleCloseQR = () => setOpenQRModal(false);

  const handleCloseProfile = () => setOpenProfileModal(false);

  const isCurrentLoggedInUser = userId === profileData?._id;

  const [page, setPage] = useState<number>(1);
  const { data: currentUserPostQuery } = useGetCurrentUserPostsQuery<IPaginatedResponse<FeedsRootObject>>({
    perPage: 5,
    page,
  });
  const currentUserPostData = currentUserPostQuery?.data;
  const [feeds, setFeeds] = useState<PostObj[]>([]);
  const nextPage = () => {
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    currentUserPostData?.map((curUserPostData) => {
      setFeeds((prev) => {
        let updatedFeeds = [...prev, curUserPostData];

        return removeDuplicates(updatedFeeds);
      });
    });
  }, [currentUserPostData]);

  return (
    <LayoutArea>
      <Box sx={{ background: '#FFFF', pt: 4 }}>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <UserProfile userProfileShowStatus={true} />
            </Grid>
            <Grid item xs={6}>
              <Stack direction="column" spacing={2}>
                <CommunityPostBox setFeeds={setFeeds} />
                {currentUserPostQuery &&
                  (feeds.length === 0 ? (
                    <Card>
                      <h3>No Feeds</h3>
                    </Card>
                  ) : (
                    <InfiniteScroll
                      dataLength={feeds.length}
                      next={() => nextPage()}
                      hasMore={page !== currentUserPostQuery.totalPage}
                      loader={<h4>Loading...</h4>}
                    >
                      <Stack direction="column" spacing={2}>
                        {feeds.map((postObj) => (
                          <PostFeed
                            key={postObj._id}
                            postObj={postObj}
                            currentUser={profileData?._id}
                            setFeeds={setFeeds}
                            isProfilePage
                          />
                        ))}
                      </Stack>
                    </InfiniteScroll>
                  ))}
              </Stack>
            </Grid>
            <Grid item xs={3}>
              <SendPrayers />
              <StickyDiv>
                <FollowUser />
              </StickyDiv>
            </Grid>
          </Grid>
          <Modal open={openQRModal} onClose={handleCloseQR} aria-labelledby="qrcode" aria-describedby="scan qrcode">
            <QRCodeModel onClick={handleCloseQR} />
          </Modal>

          {isCurrentLoggedInUser && profileData && (
            <Modal
              open={openProfileModal}
              onClose={handleCloseProfile}
              aria-labelledby="edit-profile"
              aria-describedby="edit your profile"
            >
              <EditProfileModel user={profileData} handleCloseProfile={handleCloseProfile} />
            </Modal>
          )}
        </Container>
      </Box>
    </LayoutArea>
  );
};

export default Posts;
