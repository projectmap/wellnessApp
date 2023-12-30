import { Box } from '@mui/system';
import { Stack, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { Card } from '~/modules/_core/bits/cards';
import { PostObj } from '~/modules/community/Types';
import { PostFeed } from '~/modules/community/PostFeed';
import { FollowUser } from '~/modules/community/FollowUser';
import { SendPrayers } from '~/modules/community/SendPrayers';
import { UserProfile } from '~/modules/community/UserProfile';
import { useListPaginatedFeedsQuery } from '@newstart-online/sdk';
import PostFeedSkeleton from '~/modules/community/components/PostFeedSkeleton';
import CommunityPostBox from '~/modules/community/components/CommunityPostBox';
import { CommunityFooterLinks } from '~/modules/community/CommunityFooterLinks';
import { FriendRequestPendingLists } from '../profile/me/FriendsRequestPending';
import NewStartContainer from '../_core/NewStartLayoutContainer/NewStartContainer';

export const CommunityFeed: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const { data: feedsQuery, isFetching: feedQueryLoading } = useListPaginatedFeedsQuery({
    perPage: 2,
    page,
  });
  const feedsData: PostObj[] = useMemo(() => feedsQuery?.data, [feedsQuery]);
  const [feeds, setFeeds] = useState<PostObj[]>([]);

  const nextPage = () => {
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    feedsData?.map((feed) => {
      setFeeds((prev) => [...prev, feed]);
    });
  }, [feedsData]);

  return (
    <>
      <NewStartContainer
        hasCommunityNavBar={true}
        leftItem={
          <Box>
            <UserProfile userProfileShowStatus={true} />
            <FriendRequestPendingLists />
          </Box>
        }
        midItem={
          <Stack direction="column" spacing={2}>
            <CommunityPostBox />

            {!feedsQuery && feedQueryLoading ? (
              <>
                <PostFeedSkeleton />
              </>
            ) : (
              <>
                {feedsQuery &&
                  (feedsData.length === 0 ? (
                    <>
                      <Card>
                        <h3>No Feeds</h3>
                      </Card>
                    </>
                  ) : (
                    <InfiniteScroll
                      dataLength={feeds.length}
                      next={() => nextPage()}
                      hasMore={page !== feedsQuery.totalPage}
                      loader={<PostFeedSkeleton />}
                    >
                      <Stack direction="column" spacing={2}>
                        {feeds.map((postObj, index) => {
                          return (
                            <>
                              <PostFeed key={postObj._id} postObj={postObj} setFeeds={setFeeds} />
                              {index === 1 ? <FollowUser isSuggestion={true} /> : null}
                            </>
                          );
                        })}
                      </Stack>
                    </InfiniteScroll>
                  ))}
              </>
            )}
          </Stack>
        }
        praySection={<SendPrayers />}
        rightItemSticky={<FollowUser />}
        footerSection={<CommunityFooterLinks />}
      />
    </>
  );
};
