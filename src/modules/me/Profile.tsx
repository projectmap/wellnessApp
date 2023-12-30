import Image from 'next/image';
import { useEffect, useState } from 'react';

import { NextPage } from 'next';
import { useRouter } from 'next/router';

import InfiniteScroll from 'react-infinite-scroll-component';

import {
  useGetProfileQuery,
  useGetCurrentUserPostsQuery,
  useListPendingFriendsRequestToRespondQuery,
  useGetCurrentUserBadgesQuery,
} from '@newstart-online/sdk';
import { Box } from '@mui/system';
import { IconButton, Paper, Skeleton, Stack, Typography, useMediaQuery } from '@mui/material';

import { EmptyFeedScreenIcon } from '~/icons';
import { removeDuplicates } from '~/utils/helpers';
import { PostObj } from '~/modules/community/Types';
import { PostFeed } from '~/modules/community/PostFeed';
import { USER_TYPE_FOR_BADGES } from '~/state/constants';
import { FollowUser } from '~/modules/community/FollowUser';
import { SendPrayers } from '~/modules/community/SendPrayers';
import { UserProfile } from '~/modules/community/UserProfile';
import { LayoutArea } from '~/modules/_core/layout/LayoutArea';
import NewStartBadges from '../_core/components/badges/NewStartBadges';
import { badgesAchievedCounter } from '~/utils/getUnlockedBadgesCount';
import CommunityPostBox from '~/modules/community/components/CommunityPostBox';
import { PolicyLinkArea } from '../_core/components/policyLink/PolicyLinkArea';
import PostFeedSkeleton from '~/modules/community/components/PostFeedSkeleton';
import { FriendRequestPendingLists } from '~/modules/profile/me/FriendsRequestPending';
import NewStartContainer from '~/modules/_core/NewStartLayoutContainer/NewStartContainer';

const Profile: NextPage = () => {
  const router = useRouter();

  const { data } = useGetProfileQuery();
  const { data: badgesData, isFetching: isBadgesFetching } = useGetCurrentUserBadgesQuery();
  const badgesDummyData = ['badge1', 'badge2'];

  const profileData = data?.data;
  const [page, setPage] = useState<number>(1);
  const [componentToShow, setComponentToShow] = useState<String>();
  const [requestList, setRequestList] = useState([]);

  const { data: currentUserPostQuery, isFetching: currentUserPostQueryLoading } = useGetCurrentUserPostsQuery({
    perPage: 5,
    page,
  });
  const currentUserPostData = currentUserPostQuery?.data;
  const [feeds, setFeeds] = useState<PostObj[]>([]);
  const nextPage = () => {
    setPage((prev) => prev + 1);
  };

  const { data: friendsRequestToRespond, isLoading } = useListPendingFriendsRequestToRespondQuery({
    page: 1,
    perPage: 4,
  });

  useEffect(() => {
    setRequestList(friendsRequestToRespond?.data);
  }, [friendsRequestToRespond?.data.length, friendsRequestToRespond?.data]);

  useEffect(() => {
    if (router.query?.props?.length) {
      setComponentToShow(router?.query?.props[router?.query?.props?.length - 1]);
    }
  }, [router.query?.props, router.query?.props?.length]);

  useEffect(() => {
    currentUserPostData &&
      currentUserPostData?.map((curUserPostData: PostObj) => {
        setFeeds((prev) => {
          let updatedFeeds = [curUserPostData, ...prev];

          return removeDuplicates(updatedFeeds);
        });
      });
  }, [currentUserPostData]);

  const badgesAchieved = badgesAchievedCounter(badgesData?.data);

  const matchesSmallTB900 = useMediaQuery('(max-width:900px)');

  return (
    <LayoutArea>
      <Box sx={{ background: '#FFFF', pt: 4 }}>
        <NewStartContainer
          leftItem={
            <Box>
              <UserProfile userProfileShowStatus={true} showFriends />
              <NewStartBadges userType={USER_TYPE_FOR_BADGES.CURRENT_USER} />
              {/* Todo:Friend list component will be used in future. */}
              {/* {!isLoading && (
                <Box>
                  {componentToShow !== FRIEND_LISTS.FRIEND_REQUESTS &&
                  componentToShow !== FRIEND_LISTS.SUGGESTED_FRIENDS &&
                  requestList?.length !== 0 ? (
                    <Box sx={{ mt: 5, border: '1px solid #F3F3F5', position: 'relative' }}>
                      <FriendRequestPendingLists />
                      <Box
                        sx={{ position: 'absolute', top: '380px', height: '1px' }}
                        id="visible-div-friend-requests"
                      ></Box>
                    </Box>
                  ) : (
                    ''
                  )}
                </Box>
              )} */}
            </Box>
          }
          midItem={
            <Stack direction="column" spacing={2}>
              <CommunityPostBox setFeeds={setFeeds} />
              {matchesSmallTB900 && <UserProfile userProfileShowStatus={true} showFriends showSendPrayers={true} />}

              {/* FEEDS */}

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
                            You have no post.
                          </Typography>
                          <Typography variant="body1" sx={{ textAlign: 'center' }}>
                            You haven’t posted anything yet.
                          </Typography>
                          <Typography variant="body1" sx={{ textAlign: 'center' }}>
                            Create a new post for your friends and family.
                          </Typography>
                        </Box>
                        <FollowUser isSuggestion={true} />
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
                </>
              )}
            </Stack>
          }
          praySection={<SendPrayers />}
          rightItemSticky={<FollowUser />}
          footerSection={<PolicyLinkArea />}
        />
      </Box>
    </LayoutArea>
  );
};

export default Profile;
