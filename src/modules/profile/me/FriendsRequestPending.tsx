import Image from 'next/image';
import React, { FC } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { Box, Button, Typography } from '@mui/material';

import {
  FRIENDS_STATUS,
  useListPendingFriendsRequestToRespondQuery,
  useResponseToFriendRequestMutation,
} from '@newstart-online/sdk';
import { Card } from '~/modules/_core/bits/cards';
import { DefaultLink } from '~/modules/_core/components/links/DefaultLink';
import { DefaultUserPhoto } from '~/modules/community/components/Chat/DefaultUserPhoto';
import FriendListSkeleton from '~/modules/community/components/Skeletons/FriendListSkeleton';
import {
  COMMUNITY_PAGE_ROUTING,
  DEFAULT_AVATAR,
  FRIEND_LISTS,
  PROFILE_ID_ROUTING,
  USER_LIST_TYPE,
} from '~/state/constants';
import { deactivateUserName } from '~/utils/helpers';

interface IFriendRequestPendingLists {
  marginTopDynamic?: number;
}

const FriendRequestPendingLists = ({ marginTopDynamic = 5 }: IFriendRequestPendingLists) => {
  const router = useRouter();
  const [page, setPage] = React.useState(1);
  const [respondedLists, setRespondedLists] = React.useState<Array<string>>([]);
  const [responseToFriendRequest] = useResponseToFriendRequestMutation();

  const { data: friendsRequestToRespond, isFetching } = useListPendingFriendsRequestToRespondQuery({
    page,
    perPage: 2,
  });

  let urlToPush = '';
  if (typeof window !== 'undefined' && window.location) {
    urlToPush = window.location.pathname;
  }

  const onFriendRequestHandle = (id: string, requestType: FRIENDS_STATUS) => {
    responseToFriendRequest({ requestId: id, status: requestType })
      .unwrap()
      .then((item) => {
        urlToPush && router.push(urlToPush);
      })
      .catch((error) => {
        toast.error(error.data.message);
      });
    const prevRespondedLists = [...respondedLists];
    if (prevRespondedLists.length === 4) {
      setPage(page + 1);
      setRespondedLists([]);
    } else {
      prevRespondedLists.push(id);
      setRespondedLists(prevRespondedLists);
    }
  };
  if (isFetching) {
    return <FriendListSkeleton />;
  }
  if (friendsRequestToRespond?.data?.length === 0) {
    return <></>;
  }

  return (
    <Card cardSxProps={{ mt: marginTopDynamic, border: '1px solid #F3F3F5' }}>
      <Typography variant="h6" sx={{ pb: 2 }}>
        Friend Requests
      </Typography>
      <Box sx={{ mb: 3 }}>
        {friendsRequestToRespond?.data?.map((profile: any) => (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }} key={profile?.requester?._id}>
            <DefaultLink to={`${PROFILE_ID_ROUTING.PROFILE}/${profile?.requester?._id}`}>
              {profile?.requester?.photo?.completedUrl ? (
                <Image
                  src={profile?.requester?.photo?.completedUrl}
                  height={64}
                  width={64}
                  alt={profile?.requester?.name || 'suggested'}
                  layout="fixed"
                  className="avatar"
                />
              ) : (
                <DefaultUserPhoto
                  userName={profile?.requester?.name || profile?.requester?.email}
                  sx={{ width: 64, height: 64, backgroundColor: `${profile?.requester?.color}` }}
                  fontNewSize={{ fontSize: '24px' }}
                  isActive={profile?.requester?.isActive}
                />
              )}
            </DefaultLink>
            <Box sx={{ ml: 2 }}>
              <DefaultLink to={`${PROFILE_ID_ROUTING.PROFILE}/${profile?.requester?._id}`}>
                <Typography variant="subtitle1" sx={{ mb: 1, color: '#131336' }}>
                  {profile?.requester?.isActive ? profile?.requester?.name : deactivateUserName}
                </Typography>
              </DefaultLink>
              <Button
                variant="contained"
                sx={{ textTransform: 'capitalize' }}
                onClick={() => {
                  if (respondedLists.some((item) => item === profile._id)) {
                    return;
                  } else {
                    profile?.requester?.isActive && onFriendRequestHandle(profile?._id, FRIENDS_STATUS.APPROVED);
                  }
                }}
              >
                {respondedLists.some((item) => item === profile?._id) ? 'Responded' : 'Confirm'}
              </Button>
              {!respondedLists.some((item) => item === profile?._id) && (
                <Button
                  variant="outlined"
                  sx={{ textTransform: 'capitalize', ml: '8px' }}
                  onClick={() => onFriendRequestHandle(profile?._id, FRIENDS_STATUS.REJECTED)}
                >
                  Delete
                </Button>
              )}
            </Box>
          </Box>
        ))}
      </Box>
      {friendsRequestToRespond?.data?.length === 2 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
          <DefaultLink to={`${COMMUNITY_PAGE_ROUTING.FRIENDS}/${USER_LIST_TYPE.REQUESTS}`}>
            <Typography variant="subtitle1" sx={{ color: '#147AE9' }}>
              See all
            </Typography>
          </DefaultLink>
        </Box>
      )}
    </Card>
  );
};

export { FriendRequestPendingLists };
