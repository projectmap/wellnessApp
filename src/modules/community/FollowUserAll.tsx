import Image from 'next/image';
import React, { FC, useEffect } from 'react';
import { Box, Button, IconButton, Typography, Paper } from '@mui/material';

import { ArrowLeftLineIcon } from '~/icons';
import { DefaultLink } from '../_core/components/links/DefaultLink';
import { DefaultUserPhoto } from './components/Chat/DefaultUserPhoto';
import { FollowUserAllStyles } from '~/modules/_core/styles/FollowUserAllStyles';
import { DEFAULT_AVATAR, PROFILE_ID_ROUTING, USER_LIST_TYPE } from '~/state/constants';
import {
  FRIENDS_STATUS,
  IFriendsResponse,
  useListPaginatedSuggestedFriendsQuery,
  useRequestFriendMutation,
  useCancelRequestFriendMutation,
  useHideSuggestedFriendMutation,
} from '@newstart-online/sdk';
import { toast } from 'react-toastify';

interface IProps {
  isSuggestation?: boolean;
  title?: string;
}

const FollowUserAll: FC<IProps> = ({ title }) => {
  const [page, setPage] = React.useState(1);
  const [removeUser, setRemoveUser] = React.useState<Array<string>>([]);
  const { data: suggestedFriends } = useListPaginatedSuggestedFriendsQuery({ page: page, perPage: 4 });
  const [requestedFriend, setRequestedFriend] = React.useState<Array<string>>([]);
  const [AllSuggestedFriends, setAllSuggestedFriends] = React.useState<IFriendsResponse[]>([]);
  const [cancelFriendRequest] = useCancelRequestFriendMutation();

  const [removeFriendFromSuggestion] = useHideSuggestedFriendMutation();

  const [requestFriend] = useRequestFriendMutation();

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    nextArrow: (
      <span className="arrow--left" style={{ background: 'red !important' }}>
        <ArrowLeftLineIcon />
      </span>
    ),
    prevArrow: (
      <span className="arrow--left" style={{ background: 'red !important' }}>
        <ArrowLeftLineIcon />
      </span>
    ),
  };

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
  };

  useEffect(() => {
    suggestedFriends?.data?.length &&
      setAllSuggestedFriends((prevState) => [...prevState, ...(suggestedFriends?.data || [])]);
  }, [suggestedFriends?.data]);

  const onRemoveHandle = (id: string) => {
    const _prevRemovedUser = [...removeUser];
    _prevRemovedUser.push(id);
    setRemoveUser(_prevRemovedUser);
    removeFriendFromSuggestion({ suggesationId: id });
  };

  return (
    <Paper sx={FollowUserAllStyles.followUserAllContainer} elevation={0}>
      <Box sx={FollowUserAllStyles.title}>
        <Typography variant="h6"> Suggestions</Typography>
      </Box>
      <Box sx={FollowUserAllStyles.listContainer}>
        {AllSuggestedFriends?.map((profile: any) => {
          if (removeUser.includes(profile._id as string)) {
            return null;
          }

          return (
            <Box sx={FollowUserAllStyles.listItem} key={profile._id}>
              <Box sx={FollowUserAllStyles.photoNName}>
                <DefaultLink to={`${PROFILE_ID_ROUTING.PROFILE}/${profile._id}`}>
                  {profile?.photo?.completedUrl ? (
                    <Image
                      src={profile?.photo?.completedUrl}
                      width={72}
                      height={72}
                      alt={profile.name || 'follow user'}
                      layout="fixed"
                      className="avatar"
                    />
                  ) : (
                    <DefaultUserPhoto
                      userName={profile?.name}
                      fontNewSize={{ fontSize: '24px' }}
                      sx={{ background: `${profile?.color}`, width: '72px', height: '72px' }}
                    />
                  )}
                </DefaultLink>
                <DefaultLink to={`${PROFILE_ID_ROUTING.PROFILE}/${profile._id}`}>
                  <Typography variant="subtitle1" sx={FollowUserAllStyles.profileName}>
                    {profile.name}
                  </Typography>
                </DefaultLink>
              </Box>
              <Box sx={FollowUserAllStyles.buttonContainer}>
                <Button
                  variant="outlined"
                  sx={FollowUserAllStyles.cancelOrAddButton}
                  onClick={() => onFriendRequestHandle(profile._id)}
                >
                  {requestedFriend.some((item) => item === profile._id) ? 'Cancel Request' : 'Add Friend'}
                </Button>
                <Button
                  onClick={() => onRemoveHandle(profile._id)}
                  variant="outlined"
                  sx={FollowUserAllStyles.removeButton}
                >
                  Remove
                </Button>
              </Box>
            </Box>
          );
        })}
      </Box>
      {suggestedFriends?.currentPage !== suggestedFriends?.totalPage && (
        <Box sx={FollowUserAllStyles.loadMoreButtonContainer}>
          <Button onClick={() => handleLoadMore()} sx={FollowUserAllStyles.loadMoreButton}>
            Load More
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export { FollowUserAll };
