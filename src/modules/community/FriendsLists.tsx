import Image from 'next/image';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { Button, IconButton, Paper, Stack, Typography } from '@mui/material';

import { SendMessageIcon } from '~/icons';
import { useGetUser } from '~/utils/useGetUser';
import { useAppSelector } from '~/state/app/hooks';
import { DefaultUserPhoto } from './components/Chat/DefaultUserPhoto';
import { DefaultLink } from '~/modules/_core/components/links/DefaultLink';
import { FriendsListsStyles } from '~/modules/_core/styles/FriendsListsStyles';
import { SearchBarWithIcon } from '~/modules/_core/bits/textfields/SearchBarWithIcon';
import {
  COMMUNITY_PAGE_ROUTING,
  DEACTIVATING_USER_IMAGE,
  PROFILE_ID_ROUTING,
  USER_COMMUNITY_SEARCH,
  USER_LIST_TYPE,
} from '~/state/constants';
import {
  DEFAULT_AVATAR,
  FRIENDS_STATUS,
  IFriendsResponse,
  useCancelRequestFriendMutation,
  useLazySearchUserByNameOrEmailQuery,
  useListPaginatedCurrentUserFriendsQuery,
  useRequestFriendMutation,
  useResponseToFriendRequestMutation,
} from '@newstart-online/sdk';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { deactivateUserName } from '~/utils/helpers';

const FriendsLists = (props: { type?: string }) => {
  const userType = props.type;
  const router = useRouter();

  const [searchUserByNameOrEmail, { data: searchedFriendsList }] = useLazySearchUserByNameOrEmailQuery();
  const users = useAppSelector((state) =>
    userType === USER_LIST_TYPE.FRIENDS ? state.friends.data : state.friends.suggested,
  );

  const user = useGetUser();
  const [page, setPage] = useState(1);
  const [respondedLists, setRespondedLists] = useState<Array<string>>([]);
  const { data: friends } = useListPaginatedCurrentUserFriendsQuery({ perPage: 4, page: page });
  const [friendList, setFriendList] = useState<IFriendsResponse[]>([]);
  const [searchVariable, setSearchVariable] = useState<string>('');
  const [requestedFriend, setRequestedFriend] = useState<Array<string>>([]);
  const [requestFriend] = useRequestFriendMutation();
  const [responseToFriendRequest] = useResponseToFriendRequestMutation();
  const [cancelFriendRequest] = useCancelRequestFriendMutation();
  const handleLoadMore = () => {
    setPage((prevState) => prevState + 1);
  };

  const [timeLapse, setTimeLapse] = useState({ prevTime: new Date().getTime(), newTime: new Date().getTime() });
  const searchFriends = (e: any) => {
    setSearchVariable(e?.target?.value);
    const now = new Date().getTime();
    setTimeLapse((prevState: any) => {
      if (now - prevState.newTime < 600) {
        setTimeout(() => setTimeLapse((p) => ({ prevTime: prevState.newTime, newTime: new Date().getTime() })), 1000);
      }

      return { prevTime: prevState.newTime, newTime: new Date().getTime() };
    });
  };

  useEffect(() => {
    if (searchVariable?.trim() !== '') {
      if (timeLapse?.newTime - timeLapse?.prevTime > 600) {
        searchUserByNameOrEmail({ search: searchVariable?.trim(), page: 1, perPage: 8 });
      }
    }
  }, [timeLapse?.newTime]);

  const onFriendRequestHandle = (id: string) => {
    if (!requestedFriend.some((item) => item === id)) {
      requestFriend({ requestingUserId: id, status: FRIENDS_STATUS.PENDING })
        .unwrap()
        .then((item) => {
          const _requestedFriend = [...requestedFriend];
          _requestedFriend.push(id);

          setRequestedFriend(_requestedFriend);
          toast.success('Friend request sent');
        });
    } else {
      cancelFriendRequest(id)
        .unwrap()
        .then(() => {
          const _requestedFriend = [...requestedFriend].filter((item) => item !== id);
          setRequestedFriend(_requestedFriend);
          toast.success('Friend request cancelled');
        })
        .catch((err) => toast.error(err?.data?.message));
    }
  };

  let urlToPush = '';
  if (typeof window !== 'undefined' && window.location) {
    urlToPush = window.location.pathname;
  }

  useEffect(() => {
    if (friends?.data?.length && page === 1) {
      setFriendList(friends?.data);
    } else if (friends?.data?.length && page !== 1) {
      setFriendList((prevState: any) => [...prevState, ...(friends?.data || [])]);
    }
  }, [friends?.data]);

  const onFriendRequestResponsetHandle = (id: string, requestType: FRIENDS_STATUS) => {
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
      setRespondedLists([]);
    } else {
      prevRespondedLists.push(id);
      setRespondedLists(prevRespondedLists);
    }
  };

  return (
    <div>
      <Paper elevation={0} sx={FriendsListsStyles.friendListContainer}>
        <Box>
          <Box sx={FriendsListsStyles.searchBarContainer}>
            <SearchBarWithIcon onChange={searchFriends} value={searchVariable} />
          </Box>
          <Box>
            {searchVariable?.trim() !== '' &&
              searchedFriendsList?.data?.map((item: any, idx: number) => {
                const nameOrEmail = item?.name || item?.email;
                const itemId = item?._id;

                return (
                  <Box sx={FriendsListsStyles.listItemContainer} key={item?._id}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <DefaultLink to={`${PROFILE_ID_ROUTING.PROFILE}/${item?._id}`}>
                        <Box sx={FriendsListsStyles.photoNname}>
                          {item?.photo?.completedUrl ? (
                            <Image
                              src={item?.photo?.completedUrl}
                              height={64}
                              width={64}
                              alt={item.name || 'suggested'}
                              layout="fixed"
                              className="avatar"
                            />
                          ) : (
                            <DefaultUserPhoto
                              userName={item.name || 'no name'}
                              sx={{ width: 64, height: 64, backgroundColor: `${user?.color}` }}
                              fontNewSize={{ fontSize: '24px' }}
                            />
                          )}

                          <Typography variant="subtitle1" sx={FriendsListsStyles.profileName}>
                            {nameOrEmail}
                          </Typography>
                        </Box>
                      </DefaultLink>
                    </Stack>
                    {item?.friend && FRIENDS_STATUS?.PENDING === item?.friend?.status && (
                      <>
                        {item?.friend?.requester === user?._id ? (
                          <Typography variant="subtitle2" sx={FriendsListsStyles.waitingText}>
                            Wating for approval
                          </Typography>
                        ) : (
                          <Box sx={FriendsListsStyles.respondButtonContainer}>
                            <Button
                              variant="contained"
                              sx={FriendsListsStyles.respondButton}
                              onClick={() => {
                                if (respondedLists.some((respondedID) => respondedID === item?.friend?._id)) {
                                  return;
                                } else {
                                  onFriendRequestResponsetHandle(item?.friend?._id, FRIENDS_STATUS.APPROVED);
                                }
                              }}
                            >
                              {respondedLists.some((respondedId: any) => respondedId === item?.friend?._id)
                                ? 'Responded'
                                : 'Confirm'}
                            </Button>
                            {!respondedLists.some((respondedId: any) => respondedId === item?.friend?._id) && (
                              <Button
                                variant="outlined"
                                sx={FriendsListsStyles.deleteButton}
                                onClick={() =>
                                  onFriendRequestResponsetHandle(item?.friend?._id, FRIENDS_STATUS.REJECTED)
                                }
                              >
                                Delete
                              </Button>
                            )}
                          </Box>
                        )}
                      </>
                    )}

                    {item?.friend && FRIENDS_STATUS?.APPROVED === item?.friend?.status && (
                      <DefaultLink to={`${COMMUNITY_PAGE_ROUTING.CHAT}/?group=${item?.friend?.group?._id}`}>
                        <IconButton>
                          <SendMessageIcon />
                        </IconButton>
                      </DefaultLink>
                    )}
                    {!item?.friend && (
                      <Button
                        variant="outlined"
                        sx={FriendsListsStyles.addCancelButton}
                        onClick={() => onFriendRequestHandle(item?._id)}
                      >
                        {requestedFriend.some((item) => item === itemId) ? 'Cancel Request' : 'Add Friend'}
                      </Button>
                    )}
                  </Box>
                );
              })}
            {searchedFriendsList && searchVariable?.trim() !== '' && searchedFriendsList?.totalData > 8 && (
              <DefaultLink to={`${USER_COMMUNITY_SEARCH?.SEARCH}?query=${searchVariable}`}>
                <Box sx={FriendsListsStyles.showAllButtonContainer}>
                  <Button sx={FriendsListsStyles.showAllButton}>Show All</Button>
                </Box>
              </DefaultLink>
            )}
            {searchedFriendsList && searchedFriendsList?.totalData === 0 && (
              <Typography sx={FriendsListsStyles?.errorMessage}>Sorry no result found!</Typography>
            )}
          </Box>
        </Box>
        {searchVariable?.trim() === '' && (
          <Box sx={FriendsListsStyles.friendTitle}>
            {userType === USER_LIST_TYPE.FRIENDS ? (
              <Typography variant="subtitle2">
                {friends?.totalData === 1 ? `1 Friend` : `${friends?.totalData} Friends`}
              </Typography>
            ) : (
              friends?.totalData && (
                <Typography variant="subtitle2">
                  {friends?.totalData === 1 ? `1 Friend` : `${friends?.totalData} Friends`}
                </Typography>
              )
            )}
          </Box>
        )}

        {searchVariable?.trim() === '' &&
          friendList?.map((user: any) => {
            return (
              <Box sx={FriendsListsStyles.friendList} key={user?._id}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <DefaultLink
                    to={user?.friend?.isActive ? `${PROFILE_ID_ROUTING.PROFILE}/${user?.friend?._id}` : router.asPath}
                  >
                    <Box sx={FriendsListsStyles.imageNname}>
                      {user?.friend?.photo?.completedUrl ? (
                        <Image
                          src={user?.friend?.isActive ? user?.friend?.photo?.completedUrl : DEACTIVATING_USER_IMAGE}
                          height={64}
                          width={64}
                          alt={user?.friend?.name || 'suggested'}
                          layout="fixed"
                          className="avatar"
                        />
                      ) : (
                        <DefaultUserPhoto
                          userName={user?.friend?.name || 'no name'}
                          sx={{ width: 64, height: 64, backgroundColor: `${user?.friend?.color}` }}
                          fontNewSize={{ fontSize: '24px' }}
                          isActive={user?.friend?.isActive}
                        />
                      )}
                      <Typography variant="subtitle1" sx={FriendsListsStyles.profileName}>
                        {user?.friend?.isActive ? user?.friend?.name : deactivateUserName}
                      </Typography>
                    </Box>
                  </DefaultLink>
                </Stack>

                <DefaultLink to={`${COMMUNITY_PAGE_ROUTING.CHAT}/?group=${user?.group?._id}`}>
                  <IconButton>
                    <SendMessageIcon />
                  </IconButton>
                </DefaultLink>
              </Box>
            );
          })}
        {searchVariable?.trim() === '' && friends?.totalData !== friendList?.length && (
          <Box sx={FriendsListsStyles.loadMoreButtonContainer}>
            <Button onClick={() => handleLoadMore()} sx={FriendsListsStyles.respondButton}>
              Load More
            </Button>
          </Box>
        )}
      </Paper>
    </div>
  );
};

export { FriendsLists };
