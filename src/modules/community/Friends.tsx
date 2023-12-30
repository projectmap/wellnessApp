import { Box } from '@mui/system';
import { useMediaQuery } from '@mui/material';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FriendsLists } from './FriendsLists';
import { FollowUserAll } from './FollowUserAll';
import FreindListsShowAll from './FreindListsShowAll';
import { FollowUser } from '~/modules/community/FollowUser';
import { UserProfile } from '~/modules/community/UserProfile';
import { CommunityFooterLinks } from './CommunityFooterLinks';
import { FRIEND_LISTS, USER_LIST_TYPE } from '~/state/constants';
import { useAppDispatch, useAppSelector } from '~/state/app/hooks';
import { FriendsStyles } from '~/modules/_core/styles/FriendsStyles';
import { StickyDiv, StickyDivFriendRequest } from './styles/StickyDiv';
import { FriendRequestPendingLists } from '../profile/me/FriendsRequestPending';
import {
  useListPaginatedSuggestedFriendsQuery,
  useListPendingFriendsRequestToRespondQuery,
} from '@newstart-online/sdk';
import NewStartContainer from '../_core/NewStartLayoutContainer/NewStartContainer';

const Friends = (props: { type?: string }) => {
  const userType = props.type;
  const router = useRouter();
  const user = useAppSelector((state) => state.user.user);

  const dispatch = useAppDispatch();

  const { data: friendsRequestToRespond, isLoading } = useListPendingFriendsRequestToRespondQuery({
    page: 1,
    perPage: 4,
  });
  const { data: suggestedFriends, isLoading: isLoadingSuggestion } = useListPaginatedSuggestedFriendsQuery({
    page: 1,
    perPage: 4,
  });
  const [requestList, setRequestList] = useState([]);
  const [suggestedList, setSuggestedList] = useState([]);
  const users = useAppSelector((state) =>
    userType === USER_LIST_TYPE.FRIENDS ? state.friends.data : state.friends.suggested,
  );

  const [componentToShow, setComponentToShow] = useState<String>();

  useEffect(() => {
    if (router.query?.props?.length) {
      setComponentToShow(router?.query?.props[router?.query?.props?.length - 1]);
    }
  }, [router?.query?.props?.length]);

  useEffect(() => {
    setRequestList(friendsRequestToRespond?.data);
    setSuggestedList(suggestedFriends?.data);
  }, [suggestedFriends?.data?.length, friendsRequestToRespond?.data?.length]);

  useEffect(() => {
    setSuggestedList(suggestedFriends?.data);
  }, [suggestedFriends?.data?.length]);

  const matchesScreen900 = useMediaQuery('(max-width:900px)');

  return (
    <div style={{ height: 'fit-content' }}>
      <NewStartContainer
        hasCommunityNavBar={true}
        leftItem={
          <Box>
            <StickyDiv>
              <UserProfile userProfileShowStatus={true} />
            </StickyDiv>
            {!isLoading && (
              <StickyDivFriendRequest>
                <Box>
                  {componentToShow !== FRIEND_LISTS.FRIEND_REQUESTS &&
                  componentToShow !== FRIEND_LISTS.SUGGESTED_FRIENDS &&
                  requestList?.length !== 0 ? (
                    <FriendRequestPendingLists />
                  ) : (
                    ''
                  )}
                </Box>
              </StickyDivFriendRequest>
            )}
          </Box>
        }
        midItem={
          <Box>
            {componentToShow === FRIEND_LISTS.FRIEND_REQUESTS && <FreindListsShowAll />}
            {componentToShow === FRIEND_LISTS.ALL_FRIENDS && <FriendsLists />}
            {componentToShow === FRIEND_LISTS.SUGGESTED_FRIENDS && <FollowUserAll />}

            {matchesScreen900 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {componentToShow !== FRIEND_LISTS.FRIEND_REQUESTS && requestList?.length !== 0 ? (
                  <Box sx={{ width: '49%' }}>
                    <FriendRequestPendingLists />
                  </Box>
                ) : (
                  ''
                )}
                <Box sx={{ width: '49%', pt: '16px' }}>
                  {componentToShow !== FRIEND_LISTS.SUGGESTED_FRIENDS && suggestedList?.length !== 0 && <FollowUser />}
                </Box>
              </Box>
            )}
          </Box>
        }
        rightItemSticky={
          <>
            {!isLoadingSuggestion && (
              <Box>
                {componentToShow !== FRIEND_LISTS.SUGGESTED_FRIENDS && suggestedList?.length !== 0 && <FollowUser />}
                {componentToShow === FRIEND_LISTS.SUGGESTED_FRIENDS &&
                  suggestedList?.length !== 0 &&
                  requestList?.length !== 0 && <FriendRequestPendingLists marginTopDynamic={0} />}
                <CommunityFooterLinks />
              </Box>
            )}
          </>
        }
      />
    </div>
  );
};

export { Friends };
