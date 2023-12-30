import Image from 'next/image';
import React, { FC } from 'react';
import { Box, Button, IconButton, Typography, Paper, SxProps, Skeleton } from '@mui/material';

import Slider from 'react-slick';
import { Card } from '../_core/bits/cards';
import { CloseBtnBlackIcon, RightIconSlider } from '~/icons';
import { DefaultLink } from '../_core/components/links/DefaultLink';
import { DefaultUserPhoto } from './components/Chat/DefaultUserPhoto';
import FriendListSkeleton from './components/Skeletons/FriendListSkeleton';
import { FollowUserStyles } from '~/modules/_core/styles/FollowUserStyles';
import SuggestionSkeleton from './components/Skeletons/SuggestionSkeleton';
import { COMMUNITY_PAGE_ROUTING, PROFILE_ID_ROUTING, USER_LIST_TYPE } from '~/state/constants';
import {
  FRIENDS_STATUS,
  useCancelRequestFriendMutation,
  useHideSuggestedFriendMutation,
  useListPaginatedSuggestedFriendsQuery,
  useRequestFriendMutation,
} from '@newstart-online/sdk';
import { toast } from 'react-toastify';

interface IProps {
  isSuggestion?: boolean;
  title?: string;
  sxPropsFollowUser?: SxProps;
}

const FollowUser: FC<IProps> = ({ isSuggestion = false, title, sxPropsFollowUser }) => {
  const [page, setPage] = React.useState(1);
  const { data: suggestedFriends, isFetching } = useListPaginatedSuggestedFriendsQuery({ page: page, perPage: 8 });
  const [requestedFriend, setRequestedFriend] = React.useState<Array<string>>([]);
  const [removeUser, setRemoveUser] = React.useState<Array<string>>([]);

  const [requestFriend] = useRequestFriendMutation();
  const [cancelFriendRequest] = useCancelRequestFriendMutation();
  const [removeFriendFromSuggestion] = useHideSuggestedFriendMutation();
  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    nextArrow: (
      <span className="arrow--left">
        <RightIconSlider />
      </span>
    ),
    prevArrow: (
      <span className="rarrow--left">
        <RightIconSlider />
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
          if (_requestedFriend.length === (isSuggestion ? 3 : 4)) {
            setPage(page + 1);
            setRequestedFriend([]);
          } else {
            setRequestedFriend(_requestedFriend);
          }
          toast.success('Friend request sent');
        });
    } else {
      cancelFriendRequest(id)
        .unwrap()
        .then(() => {
          const _requestedFriend = [...requestedFriend].filter((item) => item !== id);
          setRequestedFriend(_requestedFriend);
          if (_requestedFriend.length === (isSuggestion ? 3 : 4)) {
            setPage(page + 1);
            setRequestedFriend([]);
          }
          toast.success('Friend request cancelled');
        })
        .catch((err) => toast.error(err?.data?.message));
    }
  };

  const onRemoveHandle = (id: string) => {
    const _prevRemovedUser = [...removeUser];
    _prevRemovedUser.push(id);
    setRemoveUser(_prevRemovedUser);
    removeFriendFromSuggestion({ suggesationId: id });
  };

  if (isFetching) {
    return <FriendListSkeleton />;
  }
  if (isFetching && isSuggestion) {
    return <SuggestionSkeleton />;
  }

  if (isSuggestion) {
    return (
      <Card>
        {removeUser?.length !== 8 && (
          <Box sx={FollowUserStyles?.suggestionTitleContainer}>
            <Typography variant="h6">{title ?? 'Suggestions for you'}</Typography>
            {suggestedFriends?.data?.length === 4 && (
              <DefaultLink to={`${COMMUNITY_PAGE_ROUTING.FRIENDS}/${USER_LIST_TYPE.TO_FOLLOW}`}>
                <Box sx={FollowUserStyles?.buttonContainer}>
                  <Button sx={FollowUserStyles?.capitalize}>See All</Button>
                </Box>
              </DefaultLink>
            )}
          </Box>
        )}

        <Box className="follow-user" sx={{ width: '100%' }}>
          <Slider {...settings}>
            {suggestedFriends?.data?.map((user: any) => {
              if (removeUser.includes(user._id as string)) {
                return null;
              }

              return (
                <Card key={user._id} cardContentSxProps={FollowUserStyles?.suggestionCard}>
                  <Box sx={FollowUserStyles?.suggestionImageNameButtonContainer}>
                    <Box sx={FollowUserStyles?.suggestionCloseButton}>
                      <IconButton onClick={() => onRemoveHandle(user?._id)}>
                        <CloseBtnBlackIcon />
                      </IconButton>
                    </Box>
                    <Box sx={FollowUserStyles?.suggestionAvatarAndName}>
                      <DefaultLink to={`/profile/${user._id}`} muiLinkSxProps={FollowUserStyles?.suggestionLink}>
                        {user?.photo?.completedUrl ? (
                          <Image
                            src={user?.photo?.completedUrl}
                            height={72}
                            width={72}
                            alt={user.name || 'suggested'}
                            layout="fixed"
                            className="avatar"
                          />
                        ) : (
                          <DefaultUserPhoto
                            userName={user.name || user?.email}
                            sx={{ width: 72, height: 72, backgroundColor: `${user?.color}` }}
                            fontNewSize={{ fontSize: '24px' }}
                          />
                        )}

                        <Typography variant="subtitle1" align="center" sx={FollowUserStyles?.suggestionName}>
                          {user.name || user?.email}
                        </Typography>
                      </DefaultLink>
                      <Button
                        variant="outlined"
                        sx={FollowUserStyles?.suggestionButton}
                        onClick={() => onFriendRequestHandle(user._id)}
                      >
                        {requestedFriend.some((item) => item === user._id) ? 'Cancel Request' : 'Add Friend'}
                      </Button>
                    </Box>
                  </Box>
                </Card>
              );
            })}
          </Slider>
        </Box>
      </Card>
    );
  }

  return (
    <>
      {suggestedFriends?.data && (
        <Paper sx={FollowUserStyles?.followUserContainer} elevation={0}>
          <Typography variant="h6" sx={FollowUserStyles?.titleFollow}>
            {title ?? 'Who to follow'}
          </Typography>
          <Box sx={FollowUserStyles?.friendListContainer}>
            {suggestedFriends?.data?.slice(0, 4).map((profile: any) => (
              <Box sx={FollowUserStyles?.photoAndNameContainer} key={profile._id}>
                <DefaultLink to={`${PROFILE_ID_ROUTING.PROFILE}/${profile._id}`}>
                  {profile?.photo?.completedUrl ? (
                    <Image
                      src={profile?.photo?.completedUrl}
                      height={72}
                      width={72}
                      alt={profile.name || 'suggested'}
                      layout="fixed"
                      className="avatar"
                    />
                  ) : (
                    <DefaultUserPhoto
                      userName={profile.name || 'no name'}
                      sx={{ width: 72, height: 72, backgroundColor: `${profile?.color}` }}
                      fontNewSize={{ fontSize: '24px' }}
                    />
                  )}
                </DefaultLink>
                <Box sx={FollowUserStyles?.profileNameNbutton}>
                  <DefaultLink to={`${PROFILE_ID_ROUTING.PROFILE}/${profile._id}`}>
                    <Typography variant="subtitle1" sx={FollowUserStyles?.followName}>
                      {profile.name || 'No Name'}
                    </Typography>
                  </DefaultLink>
                  <Button
                    variant="outlined"
                    sx={FollowUserStyles?.capitalize}
                    onClick={() => onFriendRequestHandle(profile._id)}
                  >
                    {requestedFriend.some((item) => item === profile._id) ? 'Cancel Request' : 'Add Friend'}
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
          {suggestedFriends?.data?.length > 4 && (
            <DefaultLink to={`${COMMUNITY_PAGE_ROUTING.FRIENDS}/${USER_LIST_TYPE.TO_FOLLOW}`}>
              <Box sx={FollowUserStyles?.buttonContainer}>
                <Button sx={FollowUserStyles?.capitalize}>See All</Button>
              </Box>
            </DefaultLink>
          )}
        </Paper>
      )}
    </>
  );
};

export { FollowUser };
