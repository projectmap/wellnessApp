import React, { useState, useEffect, useRef } from 'react';
import router from 'next/router';
import { useSelector } from 'react-redux';
import { Box, CircularProgress, Grid, useMediaQuery } from '@mui/material';

import { io } from 'socket.io-client';
import { useGetUser } from '~/utils/useGetUser';
import { timeFormat } from '~/utils/momentRelativeTime';
import { useGetOnlineUser } from '~/utils/useGetOnlineUser';
import { socketEnvironment } from '~/utils/socket-environment';
import { useAppSelector, useAppDispatch } from '~/state/app/hooks';
import { useGetUserLastActiveTime } from '~/utils/useGetUserLastActiveTime';
import { UserMessageCard } from '~/modules/community/components/Chat/UserMessageCard';

import {
  IMessageGroup,
  MESSAGE_GROUP,
  useGetMessageGroupDetailsByIdQuery,
  RootState,
  saveUserChatGroupLists,
  IUser,
  IMessageGroupResponse,
  useLazyGetMessageGroupListsQuery,
  CHAT_MESSAGE_TYPE,
  useGetCurrentUserProfileDetailsQuery,
} from '@newstart-online/sdk';
import { toast } from 'react-toastify';
import { deactivateUserName } from '~/utils/helpers';
import { DEACTIVATING_USER_IMAGE } from '~/state/constants';

// chat groupchat or friendlist component on the left side of chat section
export const ChatGroupChatOrFriendList = () => {
  // api calls
  const { data: getCurrentGroupChatDetails } = useGetMessageGroupDetailsByIdQuery(
    (router?.query?.group as string) || '',
    {
      skip: !router?.query?.group,
    },
  );
  const { data: profileData } = useGetCurrentUserProfileDetailsQuery();

  const [getLatestMessage, { data: messageGroups, isLoading: isMessageGroupsLoading }] =
    useLazyGetMessageGroupListsQuery();

  // redux states and local hooks
  const searchGroupOrFriend = useAppSelector((state) => state.chats.searchGroupOrFriend);
  const messageGroupsLists = useSelector((state: RootState) => state.persistStateSlice.groupLists);
  const lastActive = useGetUserLastActiveTime(getCurrentGroupChatDetails as IMessageGroupResponse, profileData);
  const onlineUser = useGetOnlineUser(getCurrentGroupChatDetails as IMessageGroupResponse);
  const hooksUser = useGetUser();
  const allOnlineUsers = useAppSelector((state) => state.chats.onlineUsers);
  const persistUser = useSelector((state: RootState) => state.persistStateSlice.userProfile);
  const user = persistUser ?? hooksUser;
  const [searchFriends, setSearchFriends] = useState<string>('');
  const [element, setElement] = useState<any>();
  const [refVisible, setRefVisible] = useState(false);
  const [page, setPage] = React.useState<number>(1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [paginatedChatList, setPaginatedChatList] = useState<IMessageGroup[]>([]);

  const dispatch = useAppDispatch();
  const matchesSmallDesktop = useMediaQuery('(max-width:1200px)');
  const matchesSmallDesktopMax900h = useMediaQuery('(max-height:900px)');

  useEffect(() => {
    if (refVisible) {
      setElement(document?.getElementById('bottom'));
    }
  }, [refVisible]);

  useEffect(() => {
    function handleScroll() {
      if (element && element.scrollHeight - element.scrollTop === element.clientHeight) {
        setPage((prev) => prev + 1);
      }
    }

    if (element) {
      element.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (element) {
        element.removeEventListener('scroll', handleScroll);
      }
    };
  }, [element, page]);

  useEffect(() => {
    if (messageGroups?.data) {
      setPaginatedChatList((prevData) => {
        return [...prevData, ...messageGroups.data];
      });
    }
  }, [messageGroups?.data]);

  // useEffects
  React.useEffect(() => {
    if (messageGroups) {
      if (JSON.stringify(messageGroups.data) !== JSON.stringify(messageGroupsLists)) {
        let prevData = [...(messageGroupsLists || [])];
        if (page === 1) {
          prevData = [];
        }

        dispatch(saveUserChatGroupLists([...prevData, ...(messageGroups.data || [])]));
      }
    }
  }, [messageGroups]);

  // get realtime chat messages by listening to websocket using lazyquery
  React.useEffect(() => {
    if (user) {
      const socket = io(process.env.NEXT_PUBLIC_SOCKET_CHAT_RESPONSE_API_URL as string, socketEnvironment);
      socket.on(user?._id as string, (data) => {
        setPage(1);
        getLatestMessage({
          perPage: 10,
          page: 1,
        });
      });
    }
  }, [user, getLatestMessage]);

  // get latest messages from db
  React.useEffect(() => {
    if (page !== messageGroups?.totalPage) {
      getLatestMessage({
        perPage: 10,
        page: page,
        search: searchGroupOrFriend,
      });
    }
  }, [searchGroupOrFriend, getLatestMessage, page]);

  // functions to render route to groupchat by id and render group or private chat name
  const getMessageCardUserName = (groupChat: IMessageGroup) => {
    return MESSAGE_GROUP.GROUP === groupChat?.type
      ? groupChat?.groupName
        ? groupChat?.groupName
        : groupChat?.members
            ?.filter((item) => item.isActive)
            ?.map((item: IUser) => item?.name)
            .slice(0, 2)
            .join(',')
      : groupChat.members.find((item) => item._id !== user?._id);
  };
  const renderGroupChatDetails = (id: string) => {
    router.push(`/user/community/chat/?group=${id}`);
  };

  // filters and maps
  const associatedUserInGroup: any = getCurrentGroupChatDetails?.data?.associatedUser?.map((user: IUser) => user?._id);

  const onlineUsersForGroupChatOrPrivateChat = associatedUserInGroup?.filter(
    (user: IUser) => user === allOnlineUsers?.find((onlineUser) => onlineUser === user),
  );

  const fetchingMessageGroups =
    messageGroupsLists?.length === 0 && !isMessageGroupsLoading ? false : messageGroupsLists?.length === 0;

  return (
    <>
      <Grid
        item
        xs={4}
        sx={{
          overflow: 'scroll',
          scrollbarWidth: 'none',
          position: 'fixed',
          paddingTop: matchesSmallDesktop ? '70px' : '90px',
          pl: '20px',
          pr: '10px',
          width: '40%',
          borderRight: '1px solid #B8C5D080',
          height: '100vh',
          maxWidth: '33.34%',
        }}
        className="hide-scrollbar"
      >
        <Box
          sx={{
            ml: matchesSmallDesktop ? '0px' : '24px',
          }}
        >
          <Box
            sx={{
              background: '#fff',
              zIndex: '100',
              padding: '0',
              top: '20%',
            }}
          >
            <Box
              sx={{
                overflowY: 'scroll',
                height: `${matchesSmallDesktopMax900h ? '450px' : '600px'}`,
                pb: 2,
              }}
              ref={(el) => {
                bottomRef?.current === el;
                setRefVisible(!!el);
              }}
              id="bottom"
              className="hide-scrollbar"
            >
              {fetchingMessageGroups ? (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                  }}
                >
                  <CircularProgress sx={{ color: '#F5F5F5' }} />
                </Box>
              ) : (
                router.asPath !== '/user/community/chat/' &&
                messageGroupsLists?.map((groupChat: IMessageGroup) => {
                  return (
                    <UserMessageCard
                      selectedGroupChat={router?.query?.group === groupChat?._id}
                      key={groupChat?._id}
                      userName={
                        MESSAGE_GROUP.GROUP === groupChat?.type
                          ? getMessageCardUserName(groupChat)
                          : getMessageCardUserName(groupChat)?.isActive
                          ? getMessageCardUserName(groupChat)?.name
                          : deactivateUserName
                      }
                      // Show You as current user has sent this message but only show this to TEXT_CHAT
                      userMessage={
                        (groupChat?.message?.[0]?.messageType === CHAT_MESSAGE_TYPE.TEXT_CHAT &&
                        groupChat?.message?.[0]?.sentBy?.[0]?._id === user?._id
                          ? 'You: '
                          : '') +
                        (groupChat?.message?.[0]?.mediaFiles?.length ? 'Sent an image' : groupChat?.message?.[0]?.text)
                      }
                      imageSrc={
                        MESSAGE_GROUP.GROUP === groupChat?.type
                          ? groupChat?.groupImage?.completedUrl
                            ? groupChat?.groupImage?.completedUrl
                            : groupChat?.members
                                ?.filter((item) => item?.isActive)
                                .map((item: IUser) => item?.photo?.completedUrl)
                          : groupChat?.members &&
                            groupChat?.members?.find((item: IUser) => item?._id !== user?._id)?.isActive
                          ? groupChat?.members?.find((item: IUser) => item?._id !== user?._id)?.photo?.completedUrl
                          : DEACTIVATING_USER_IMAGE
                      }
                      messageTime={
                        groupChat?.message?.length !== 0
                          ? timeFormat(groupChat.message[0]?.createdAt)
                          : onlineUser
                          ? 'Online'
                          : lastActive
                      }
                      id={
                        MESSAGE_GROUP.GROUP === groupChat?.type
                          ? groupChat?.members.map((item: IUser) => item?._id)
                          : groupChat.members.find((item: IUser) => item._id !== user?._id)?._id
                      }
                      onClick={() => renderGroupChatDetails(groupChat?._id)}
                      userOnline={onlineUsersForGroupChatOrPrivateChat?.length !== 0}
                      userColor={
                        MESSAGE_GROUP.GROUP === groupChat?.type
                          ? groupChat?.members.map((item: IUser) => item?.color)
                          : groupChat.members.find((item: IUser) => item._id !== user?._id)?.color
                      }
                      groupChatDetails={groupChat}
                    />
                  );
                })
              )}
            </Box>
          </Box>
        </Box>
      </Grid>
    </>
  );
};
