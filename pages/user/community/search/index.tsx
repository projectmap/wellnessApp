import Image from 'next/image';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { Box, Stack } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { Button, IconButton, Typography } from '@mui/material';

import { SendMessageIcon } from '~/icons';
import { FollowUser } from '~/modules/community/FollowUser';
import { UserProfile } from '~/modules/community/UserProfile';
import { LayoutArea } from '~/modules/_core/layout/LayoutArea';
import { DefaultLink } from '~/modules/_core/components/links/DefaultLink';
import { CommunityFooterLinks } from '~/modules/community/CommunityFooterLinks';
import { COMMUNITY_PAGE_ROUTING, PROFILE_ID_ROUTING, USER_COMMUNITY_SEARCH } from '~/state/constants';
import {
  useLazySearchUserByNameOrEmailQuery,
  DEFAULT_AVATAR,
  FRIENDS_STATUS,
  useCancelRequestFriendMutation,
  useRequestFriendMutation,
  IFriendsResponse,
} from '@newstart-online/sdk';
import { deactivateUserName } from '~/utils/helpers';
import { FriendsListsStyles } from '~/modules/_core/styles/FriendsListsStyles';
import { SearchBarWithIcon } from '~/modules/_core/bits/textfields/SearchBarWithIcon';
import { DefaultUserPhoto } from '~/modules/community/components/Chat/DefaultUserPhoto';
import NewStartContainer from '~/modules/_core/NewStartLayoutContainer/NewStartContainer';

const SearchAllPeople = () => {
  const router = useRouter();
  const [page, setPage] = React.useState(1);

  const [searchUserByNameOrEmail, { data: searchedFriendsList }] = useLazySearchUserByNameOrEmailQuery();
  const [cancelFriendRequest] = useCancelRequestFriendMutation();
  const [requestFriend] = useRequestFriendMutation();
  const [searchVariable, setSearchVariable] = useState<string>(router?.query?.query as string);
  const [requestedFriend, setRequestedFriend] = useState<Array<string>>([]);
  const [searchedFriendListArray, setSearchedFriendListArray] = useState<IFriendsResponse[]>([]);
  const [load, setload] = useState(false);

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

  const handleLoadMore = () => {
    setPage((prevState) => prevState + 1);
    setload(true);
  };

  const searchFriends = (e: any) => {
    setSearchVariable(e?.target?.value);
  };

  useEffect(() => {
    if (router?.query?.query) {
      searchUserByNameOrEmail({ search: router?.query?.query as string, page: page, perPage: 8 });
      setSearchVariable(router?.query?.query as string);
      if (load && page !== 1) {
        searchedFriendsList?.data &&
          setSearchedFriendListArray((prevState: any) => [...prevState, ...(searchedFriendsList?.data || [])]);
        setload(false);
      } else {
        searchedFriendsList?.data && setSearchedFriendListArray(searchedFriendsList?.data as any);
      }
    }
  }, [searchedFriendsList?.data, router?.query?.query]);

  useEffect(() => {
    if (searchVariable?.trim() !== '') {
      if (router?.query?.query) {
        searchUserByNameOrEmail({ search: searchVariable?.trim(), page: page, perPage: 8 });
        setSearchVariable(router?.query?.query as string);
      }
    }
  }, [searchedFriendsList?.data, page]);

  const handleSearch = () => {
    router.push(`${USER_COMMUNITY_SEARCH?.SEARCH}?query=${searchVariable}`);
    setPage(1);
  };

  return (
    <LayoutArea>
      <NewStartContainer
        hasCommunityNavBar={true}
        leftItem={<UserProfile userProfileShowStatus={true} />}
        midItem={
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  background: '#FFFF',
                  width: '100%',
                  mb: '16px',
                }}
              >
                <form onSubmit={handleSearch}>
                  <SearchBarWithIcon onChange={searchFriends} value={searchVariable} />
                </form>
              </Box>
            </Box>
            <Box>
              {searchedFriendListArray?.map((item: any, idx: number) => {
                const nameOrEmail = item?.name || item?.email || deactivateUserName;
                const itemId = item?._id;

                return (
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}
                    key={item?._id}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <DefaultLink to={`${PROFILE_ID_ROUTING.PROFILE}/${item?._id}`}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {item?.photo?.completedUrl ? (
                            <Image
                              src={item?.photo?.completedUrl}
                              height={64}
                              width={64}
                              alt="user-image"
                              layout="fixed"
                              className="avatar"
                            />
                          ) : (
                            <DefaultUserPhoto
                              userName={nameOrEmail}
                              sx={{ backgroundColor: `${item?.color}`, width: '64px', height: '64px' }}
                            />
                          )}

                          <Typography variant="subtitle1" sx={{ marginLeft: 2, color: '#131336' }}>
                            {nameOrEmail}
                          </Typography>
                        </div>
                      </DefaultLink>
                    </Stack>
                    {item?.friend && FRIENDS_STATUS?.PENDING === item?.friend?.status && (
                      <Typography
                        variant="subtitle2"
                        sx={{ color: 'primary.main', display: 'flex', alignItems: 'center', fontWeight: '400' }}
                      >
                        Wating for approval
                      </Typography>
                    )}
                    {item?.friend && FRIENDS_STATUS?.APPROVED === item?.friend?.status && (
                      <DefaultLink to={`${COMMUNITY_PAGE_ROUTING.CHAT}/${item?.friend?.group?._id}`}>
                        <IconButton>
                          <SendMessageIcon />
                        </IconButton>
                      </DefaultLink>
                    )}

                    {!item?.friend && (
                      <Button
                        variant="outlined"
                        sx={{ textTransform: 'capitalize', height: '36px' }}
                        onClick={() => onFriendRequestHandle(item?._id)}
                      >
                        {requestedFriend.some((item) => item === itemId) ? 'Cancel Request' : 'Add Friend'}
                      </Button>
                    )}
                  </Box>
                );
              })}
              {searchedFriendListArray?.length !== 0 &&
                searchedFriendListArray?.length !== searchedFriendsList?.totalData && (
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
                    <Button onClick={handleLoadMore} sx={{ textTransform: 'capitalize' }}>
                      Load More
                    </Button>
                  </Box>
                )}
              {searchedFriendsList && searchedFriendsList?.totalData === 0 && (
                <Typography sx={FriendsListsStyles?.errorMessage}>Sorry no result found!</Typography>
              )}
            </Box>
          </Box>
        }
        rightItemSticky={<FollowUser sxPropsFollowUser={{ mt: 0 }} />}
        footerSection={<CommunityFooterLinks />}
      />
    </LayoutArea>
  );
};
export default SearchAllPeople;
