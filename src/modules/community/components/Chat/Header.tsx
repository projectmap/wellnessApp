import React from 'react';
import { useRouter } from 'next/router';
import { Stack, Box } from '@mui/system';
import { useSelector } from 'react-redux';
import { Grid, IconButton, Typography, useMediaQuery } from '@mui/material';

import {
  IUser,
  MESSAGE_GROUP,
  useGetMessageGroupDetailsByIdQuery,
  RootState,
  IMessageGroupResponse,
  useGetCurrentUserProfileDetailsQuery,
} from '@newstart-online/sdk';
import { useGetUser } from '~/utils/useGetUser';
import { GroupChatAvatar } from './GroupChatAvatar';
import { deactivateUserName } from '~/utils/helpers';
import { DefaultUserPhoto } from './DefaultUserPhoto';
import UserOnlineAvartar from './UserOnlineStatusAvatar';
import { useGetGroupName } from '~/utils/useGetGroupName';
import { DEACTIVATING_USER_IMAGE } from '~/state/constants';
import ChatHeaderSkeleton from '../Skeletons/ChatHeaderSkeleton';
import { useAppDispatch, useAppSelector } from '~/state/app/hooks';
import { useGetUserLastActiveTime } from '~/utils/useGetUserLastActiveTime';
import { ChatIcon, ChatMoreOptionsActiveIcon, MoreOptionsIcon } from '~/icons';
import { useGetPrivateChatMemberInfo } from '~/utils/useGetPrivateChatMemberInfo';
import { SearchBarWithIcon } from '~/modules/_core/bits/textfields/SearchBarWithIcon';
import { setShowChatInfoOnRightSide, setNewChatModal, setSearchGroupOrFriend } from '~/state/services/chats/chatSlice';

interface IChatHeader {
  getCurrentGroupChatDetails: IMessageGroupResponse | undefined;
  isFetching: boolean;
}
// @header for chat section
export default function Header({ getCurrentGroupChatDetails, isFetching }: IChatHeader) {
  const router = useRouter();
  const user = useGetUser();
  const dispatch = useAppDispatch();
  const searchGroupOrFriend = useAppSelector((state) => state.chats.searchGroupOrFriend);
  const { data: profileData } = useGetCurrentUserProfileDetailsQuery();

  // to check is the chat message is group chat or private chat
  const isGroupChat = getCurrentGroupChatDetails?.data?.type === MESSAGE_GROUP.GROUP;

  // responsive design media query
  const matchesSmallDesktop = useMediaQuery('(max-width:1200px)');

  const onlineUsersInGroup = useAppSelector((state) => state.chats.onlineUsers);

  const persistUser = useSelector((state: RootState) => state.persistStateSlice.userProfile);

  // the time when the user status was online from db

  const lastActiveTime = useGetUserLastActiveTime(getCurrentGroupChatDetails as IMessageGroupResponse, profileData);

  const userToSendMessageDetails = useGetPrivateChatMemberInfo(getCurrentGroupChatDetails as IMessageGroupResponse);

  const groupName = useGetGroupName(getCurrentGroupChatDetails as IMessageGroupResponse);

  // to show more option like group members
  const showChatInfoOnRightSide = useAppSelector((state) => state.chats.showChatInfoOnRightSide);

  const runGroupSearch = (e: any) => {
    dispatch(setSearchGroupOrFriend(e.target.value));
  };

  // to show the selected people to be added to the new chat
  const handleShowAddFriendsToChat = () => {
    dispatch(setNewChatModal(true));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        position: 'fixed',
        top: '120px',
        zIndex: '1',
      }}
    >
      <Grid container>
        <Grid item xs={4}>
          <Stack
            direction="row"
            spacing={matchesSmallDesktop ? 0.1 : 2.1}
            alignItems="center"
            sx={{
              pl: matchesSmallDesktop ? '19px' : '43px',
              background: '#FFF',
              height: '82px',
              borderRight: '1px solid #B8C5D080',
            }}
          >
            <>
              <SearchBarWithIcon onChange={runGroupSearch} value={searchGroupOrFriend} />
              <IconButton>
                <ChatIcon onClick={handleShowAddFriendsToChat} />
              </IconButton>
            </>
          </Stack>
        </Grid>
        <Grid
          item
          xs={showChatInfoOnRightSide ? (matchesSmallDesktop ? 8 : 5) : 8}
          md={matchesSmallDesktop && 8}
          sx={{}}
        >
          {isFetching ? (
            <ChatHeaderSkeleton />
          ) : typeof getCurrentGroupChatDetails === 'undefined' && router.asPath === '/user/community/chat/' ? (
            <Typography variant="subtitle1" textTransform="capitalize" textAlign="center" sx={{ mt: 3 }}></Typography>
          ) : (
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                borderBottom: '1px solid #E7E7EB',
                py: '18px',
                paddingX: 2,
                background: '#FFF',
              }}
            >
              <Stack direction="row" alignItems="center">
                <div>
                  {isGroupChat && getCurrentGroupChatDetails ? (
                    getCurrentGroupChatDetails?.data?.groupImage?.completedUrl ? (
                      <UserOnlineAvartar
                        src={getCurrentGroupChatDetails?.data?.groupImage?.completedUrl}
                        isUserOnline={
                          onlineUsersInGroup?.filter((item) =>
                            getCurrentGroupChatDetails?.data?.associatedUser?.includes(item?._id),
                          ).length !== 0
                        }
                      />
                    ) : (
                      <GroupChatAvatar
                        src={getCurrentGroupChatDetails?.data?.associatedUser?.map((user) => user?.photo?.completedUrl)}
                        groupChatMembers={getCurrentGroupChatDetails?.data?.associatedUser}
                        groupChatDetails={getCurrentGroupChatDetails}
                      />
                    )
                  ) : getCurrentGroupChatDetails?.data?.associatedUser.find((item: IUser) => item._id !== user?._id)
                      ?.photo?.completedUrl ? (
                    <UserOnlineAvartar
                      src={
                        userToSendMessageDetails?.isActive
                          ? getCurrentGroupChatDetails?.data?.associatedUser.find(
                              (item: IUser) => item._id !== user?._id,
                            )?.photo?.completedUrl
                          : DEACTIVATING_USER_IMAGE
                      }
                      isUserOnline={
                        onlineUsersInGroup?.filter((item) =>
                          getCurrentGroupChatDetails?.data?.associatedUser?.includes(item?._id),
                        ).length !== 0
                      }
                    />
                  ) : (
                    <DefaultUserPhoto
                      userName={
                        getCurrentGroupChatDetails?.data?.associatedUser.find((item: IUser) => item._id !== user?._id)
                          ?.name
                      }
                      fontNewSize={{ fontSize: '16px' }}
                      sx={{
                        backgroundColor: `${
                          getCurrentGroupChatDetails?.data?.associatedUser.find((item: IUser) => item._id !== user?._id)
                            ?.color
                        }`,
                        width: '48px',
                        height: '48px',
                      }}
                      isUserOnline={
                        getCurrentGroupChatDetails?.data?.associatedUser?.filter((item: IUser) =>
                          onlineUsersInGroup?.includes(item?._id),
                        ).length !== 0
                      }
                      isActive={
                        getCurrentGroupChatDetails?.data?.associatedUser?.find((item: IUser) => item._id !== user?._id)
                          ?.isActive
                      }
                    />
                  )}
                </div>

                <Stack sx={{ pl: isGroupChat ? 2.3 : 1.3 }}>
                  <Typography
                    variant="subtitle1"
                    className={!isGroupChat ? 'cursor-pointer' : ''}
                    onClick={() =>
                      !isGroupChat &&
                      getCurrentGroupChatDetails?.data?.associatedUser?.find((item) => item._id !== persistUser._id)
                        .isActive &&
                      router.push(
                        `/profile/${
                          getCurrentGroupChatDetails?.data?.associatedUser?.find((item) => item._id !== persistUser._id)
                            ?._id
                        }`,
                      )
                    }
                  >
                    {isGroupChat
                      ? groupName
                      : getCurrentGroupChatDetails?.data?.associatedUser?.find(
                          (item) => item._id !== persistUser._id && item.isActive,
                        )?.name || deactivateUserName}
                  </Typography>
                  {isGroupChat ? (
                    <Typography variant="subtitle2" sx={{ opacity: '0.5', fontWeight: '500', color: '#131336' }}>
                      {getCurrentGroupChatDetails?.data?.associatedUser?.filter((item: IUser) =>
                        onlineUsersInGroup?.includes(item?._id),
                      ).length !== 0
                        ? 'Online'
                        : `Last active: ${lastActiveTime}`}
                    </Typography>
                  ) : (
                    <Typography variant="subtitle2" sx={{ opacity: '0.5', fontWeight: '500', color: '#131336' }}>
                      {userToSendMessageDetails?.isActive &&
                        (getCurrentGroupChatDetails?.data?.associatedUser?.filter((item: IUser) =>
                          onlineUsersInGroup?.includes(item?._id),
                        ).length !== 0
                          ? 'Online'
                          : getCurrentGroupChatDetails?.data?.associatedUser?.find(
                              (item) => item._id !== persistUser._id && item.isActive,
                            )?.name
                          ? `Last active: ${lastActiveTime}`
                          : '')}
                    </Typography>
                  )}
                </Stack>
              </Stack>
              <Box sx={{ padding: 1 }}>
                {showChatInfoOnRightSide ? (
                  <ChatMoreOptionsActiveIcon
                    onClick={() => dispatch(setShowChatInfoOnRightSide(!showChatInfoOnRightSide))}
                    style={{ cursor: 'pointer' }}
                  />
                ) : (
                  <MoreOptionsIcon
                    onClick={() => dispatch(setShowChatInfoOnRightSide(!showChatInfoOnRightSide))}
                    style={{ cursor: 'pointer' }}
                  />
                )}
              </Box>
            </Stack>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
