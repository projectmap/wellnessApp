import Image from 'next/image';
import { Box } from '@mui/system';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Button, IconButton, Typography } from '@mui/material';
import { DefaultLink } from '../_core/components/links/DefaultLink';
import { DEFAULT_AVATAR, PROFILE_ID_ROUTING } from '~/state/constants';
import {
  FRIENDS_STATUS,
  IFriendsResponse,
  useListPendingFriendsRequestToRespondQuery,
  useResponseToFriendRequestMutation,
} from '@newstart-online/sdk';
import { PrimaryButton } from '../_core/bits/buttons/PrimaryButton';
import { DefaultUserPhoto } from './components/Chat/DefaultUserPhoto';
import { FriendListShowAllStyles } from '~/modules/_core/styles/FriendsListShowAll';

const FreindListsShowAll = () => {
  const router = useRouter();

  const [page, setPage] = React.useState(1);
  const [friendRequestsList, setFriendRequestsList] = useState<IFriendsResponse[]>([]);
  const [respondedLists, setRespondedLists] = React.useState<Array<string>>([]);
  const [responseToFriendRequest] = useResponseToFriendRequestMutation();

  const { data: friendsRequestToRespond, isLoading } = useListPendingFriendsRequestToRespondQuery({
    page: page,
    perPage: 4,
  });

  let urlToPush = '';
  if (typeof window !== 'undefined' && window.location) {
    urlToPush = window.location.pathname;
  }

  const [disableLoadMore, setDisableLoadMore] = useState(false);

  const debounceLoadMore = () => {
    setDisableLoadMore(true);
    setTimeout(() => setDisableLoadMore(false), 2000);
  };

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
      setPage((prevState) => prevState + 1);
      setRespondedLists([]);
    } else {
      prevRespondedLists.push(id);
      setRespondedLists(prevRespondedLists);
    }
  };

  useEffect(() => {
    friendsRequestToRespond?.data?.length &&
      setFriendRequestsList((prevState) => [...prevState, ...(friendsRequestToRespond?.data || [])]);
  }, [friendsRequestToRespond?.data]);

  //handle load more
  const handleLoadMore = () => {
    setPage((prevState) => prevState + 1);
  };

  return (
    <Box sx={FriendListShowAllStyles.friendListContainer}>
      <Box sx={FriendListShowAllStyles.titleContainer}>
        <Typography variant="h6"> {friendsRequestToRespond?.totalData} Friend Requests</Typography>
      </Box>

      <Box sx={FriendListShowAllStyles.listContainer}>
        {friendRequestsList?.map((profile: any) => (
          <Box sx={FriendListShowAllStyles.friendListItem} key={profile._id}>
            <Box sx={FriendListShowAllStyles.photoNName}>
              <DefaultLink to={`${PROFILE_ID_ROUTING.PROFILE}/${profile?.requester?._id}`}>
                {profile?.requester.photo?.completedUrl ? (
                  <Image
                    src={profile?.requester.photo?.completedUrl}
                    height={64}
                    width={64}
                    alt={profile?.requester.name || 'suggested'}
                    layout="fixed"
                    className="avatar"
                  />
                ) : (
                  <DefaultUserPhoto
                    userName={profile?.requester.name || profile?.requester?.email}
                    sx={{ width: 64, height: 64, backgroundColor: `${profile?.requester?.color}` }}
                    fontNewSize={{ fontSize: '24px' }}
                  />
                )}
              </DefaultLink>
              <DefaultLink to={`${PROFILE_ID_ROUTING.PROFILE}/${profile?.requester?._id}`}>
                <Typography variant="subtitle1" sx={FriendListShowAllStyles.profileName}>
                  {profile.requester.name}
                </Typography>
              </DefaultLink>
            </Box>
            <Box sx={FriendListShowAllStyles.buttonContainer}>
              <Button
                variant="contained"
                sx={FriendListShowAllStyles.confirmButton}
                onClick={() => {
                  if (respondedLists.some((item) => item === profile._id)) {
                    return;
                  } else {
                    onFriendRequestHandle(profile._id, FRIENDS_STATUS.APPROVED);
                  }
                }}
              >
                {respondedLists.some((item) => item === profile._id) ? 'Responded' : 'Confirm'}
              </Button>
              {!respondedLists.some((item) => item === profile._id) && (
                <Button
                  variant="outlined"
                  sx={FriendListShowAllStyles.deleteButton}
                  onClick={() => onFriendRequestHandle(profile._id, FRIENDS_STATUS.REJECTED)}
                >
                  Delete
                </Button>
              )}
            </Box>
          </Box>
        ))}
      </Box>
      {friendRequestsList?.length !== friendsRequestToRespond?.totalData && (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <PrimaryButton
            disabled={isLoading || disableLoadMore}
            onClick={() => {
              debounceLoadMore();
              handleLoadMore();
            }}
            sx={FriendListShowAllStyles.loadMoreButton}
          >
            {isLoading || disableLoadMore ? 'Loading...' : 'Load More'}
          </PrimaryButton>
        </Box>
      )}
    </Box>
  );
};
export default FreindListsShowAll;
