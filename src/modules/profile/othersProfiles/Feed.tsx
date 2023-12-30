import React, { useEffect, useState } from 'react';

import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { Box } from '@mui/system';
import { Stack, Modal, Typography, useMediaQuery } from '@mui/material';

import { EmptyFeedScreenIcon } from '~/icons';
import { removeDuplicates } from '~/utils/helpers';
import { PostObj } from '~/modules/community/Types';
import { PostFeed } from '~/modules/community/PostFeed';
import { FollowUser } from '~/modules/community/FollowUser';
import InfiniteScroll from 'react-infinite-scroll-component';
import { SendPrayers } from '~/modules/community/SendPrayers';
import { UserProfile } from '~/modules/community/UserProfile';
import { QRCodeModel } from '~/modules/_core/bits/modals/QrCodeModel';
import { ME_PAGE_ROUTING, USER_TYPE_FOR_BADGES } from '~/state/constants';
import NewStartBadges from '~/modules/_core/components/badges/NewStartBadges';
import PostFeedSkeleton from '~/modules/community/components/PostFeedSkeleton';
import { CommunityFooterLinks } from '~/modules/community/CommunityFooterLinks';
import NewStartContainer from '~/modules/_core/NewStartLayoutContainer/NewStartContainer';

import { useGetProfileQuery, useListPaginatedFeedsOfUsersByUserIdQuery } from '@newstart-online/sdk';

const Feed: NextPage = () => {
  const router = useRouter();
  const { userId: _userId } = router.query;
  const userId = _userId as string;

  const [openQRModal, setOpenQRModal] = useState<boolean>(false);

  const handleCloseQR = () => setOpenQRModal(false);

  const [page, setPage] = useState<number>(1);

  const { data: profileData } = useGetProfileQuery();
  const { data: currentUserPostQuery, isFetching: currentUserPostQueryLoading } =
    useListPaginatedFeedsOfUsersByUserIdQuery(
      {
        userId,
        perPage: 4,
        page,
      },
      { skip: !userId },
    );
  const currentUserPostData = currentUserPostQuery?.data;
  const [feeds, setFeeds] = useState<PostObj[]>([]);
  const nextPage = () => {
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (userId === profileData?.data?._id) {
      router.push(ME_PAGE_ROUTING.ME);
    }
  }, [profileData, userId]);

  useEffect(() => {
    currentUserPostData?.map((curUserPostData: PostObj) => {
      setFeeds((prev) => {
        let updatedFeeds = [...prev, curUserPostData];

        return removeDuplicates(updatedFeeds);
      });
    });
  }, [currentUserPostData]);

  const matchesScreen900 = useMediaQuery('(max-width:900px)');

  return (
    <>
      <NewStartContainer
        leftItem={
          <Box>
            <UserProfile showCameraIcon={false} userProfileShowStatus={true} userId={userId} />
            <NewStartBadges userType={USER_TYPE_FOR_BADGES.OTHER_USER} id={userId} />
          </Box>
        }
        praySection={<SendPrayers />}
        rightItemSticky={<FollowUser />}
        midItem={
          <Box>
            {matchesScreen900 && (
              <Box sx={{ mb: '24px' }}>
                <UserProfile showCameraIcon={false} userProfileShowStatus={true} userId={userId} />
                <NewStartBadges userType={USER_TYPE_FOR_BADGES.OTHER_USER} id={userId} />
              </Box>
            )}
            <Stack direction="column" spacing={2}>
              {!currentUserPostQuery && currentUserPostQueryLoading ? (
                <>
                  <PostFeedSkeleton />
                </>
              ) : (
                <>
                  {currentUserPostQuery &&
                    (feeds.length === 0 ? (
                      <>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            border: '1px solid #F4F5FC',
                            width: '100%',
                            borderRadius: 3,
                            px: '92px',
                            py: '60px',
                          }}
                        >
                          <EmptyFeedScreenIcon />
                          <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
                            No post to view.
                          </Typography>
                        </Box>
                      </>
                    ) : (
                      <InfiniteScroll
                        dataLength={feeds.length}
                        next={() => nextPage()}
                        hasMore={page !== currentUserPostQuery.totalPage}
                        loader={<PostFeedSkeleton />}
                      >
                        <Stack direction="column" spacing={2}>
                          {feeds.map((postObj) => (
                            <PostFeed key={postObj._id} postObj={postObj} setFeeds={setFeeds} isProfilePage />
                          ))}
                        </Stack>
                      </InfiniteScroll>
                    ))}
                </>
              )}
            </Stack>
          </Box>
        }
        footerSection={<CommunityFooterLinks />}
      />

      <Modal open={openQRModal} onClose={handleCloseQR} aria-labelledby="qrcode" aria-describedby="scan qrcode">
        <QRCodeModel onClick={handleCloseQR} />
      </Modal>
    </>
  );
};

export default Feed;
