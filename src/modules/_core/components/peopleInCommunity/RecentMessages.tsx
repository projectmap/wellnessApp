import React from 'react';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import { Skeleton, Typography } from '@mui/material';

import { useGetUser } from '~/utils/useGetUser';
import { DefaultLink } from '../links/DefaultLink';
import { useAppSelector } from '~/state/app/hooks';
import { timeFormat } from '~/utils/momentRelativeTime';
import { COMMUNITY_PAGE_ROUTING } from '~/state/constants';
import { RecentMessagesStyles } from '~/modules/_core/styles/RecentMessageStyles';
import { GroupChatAvatar } from '~/modules/community/components/Chat/GroupChatAvatar';
import { DefaultUserPhoto } from '~/modules/community/components/Chat/DefaultUserPhoto';
import { IUser, MESSAGE_GROUP, useGetMessageGroupListsQuery } from '@newstart-online/sdk';
import UserOnlineAvartar from '~/modules/community/components/Chat/UserOnlineStatusAvatar';

// component responsible for rendering latest messages to user's homepage feed on the left side
const RecentMessages = () => {
  // api call
  const { data: getCurrentGroupChatDetails, isFetching } = useGetMessageGroupListsQuery({ page: 1, perPage: 5 });
  // loading skeleton data array
  const dummyArrayForSkeleton = [1, 1, 1];
  const user = useGetUser();
  const router = useRouter();

  // for getting online user list from websocket
  const onlineUsersInGroup = useAppSelector((state) => state.chats.onlineUsers);

  const checkifMessageIsThereForUserToSeeSentByOtherUser = () => {
    return getCurrentGroupChatDetails?.data?.some(
      (item) => item.message.length && item.message[0].sentBy?.[0]?._id !== user?._id,
    );
  };

  if (!checkifMessageIsThereForUserToSeeSentByOtherUser()) {
    return <></>;
  }

  return (
    <>
      {isFetching ? (
        <Box sx={RecentMessagesStyles?.recentMessageContainer}>
          <Skeleton variant="text" sx={{ width: '50%' }} />
          {dummyArrayForSkeleton?.map((item, idx) => (
            <Box sx={RecentMessagesStyles?.rencentMessageGroup} key={idx}>
              <Box sx={{ display: 'flex' }}>
                <Skeleton variant="circular" width={48} height={48} />
                <Box sx={RecentMessagesStyles?.messageAndGroupName}>
                  <Skeleton variant="text" sx={RecentMessagesStyles?.skeletonWidth80} />
                  <Skeleton variant="text" sx={RecentMessagesStyles?.skeletonWidth80} />
                </Box>
              </Box>

              <Skeleton variant="text" sx={RecentMessagesStyles?.skeletonWidth40} />
            </Box>
          ))}
          <Box sx={RecentMessagesStyles?.seeAllButton}>
            <Skeleton variant="text" sx={RecentMessagesStyles?.skeletonWidth80} />
          </Box>
        </Box>
      ) : (
        <Box sx={RecentMessagesStyles?.recentMessageContainer}>
          <Typography variant="subtitle1">Recent messages</Typography>
          {(!checkifMessageIsThereForUserToSeeSentByOtherUser() || getCurrentGroupChatDetails?.data?.length === 0) && (
            <Typography>No Latest Messages!</Typography>
          )}

          <>
            {checkifMessageIsThereForUserToSeeSentByOtherUser() &&
              getCurrentGroupChatDetails?.data?.map((item, idx) => {
                const isGroupChat = item?.type === MESSAGE_GROUP.GROUP;
                let message = item?.message[0]?.text;

                if (item?.message?.length === 0) {
                  return;
                }

                return (
                  <Box
                    sx={RecentMessagesStyles?.rencentMessageGroup}
                    key={idx}
                    onClick={() => router.push(`${COMMUNITY_PAGE_ROUTING.CHAT}/?group=${item?._id}`)}
                  >
                    <>
                      <Box sx={RecentMessagesStyles?.photoMessageAndGroup}>
                        <Box>
                          {isGroupChat ? (
                            // if we have group image render it otherwise render groupChatAvatar component
                            item?.groupImage?.completedUrl ? (
                              <UserOnlineAvartar
                                src={item?.groupImage?.completedUrl}
                                sx={{ width: '46px', height: '46px' }}
                              />
                            ) : (
                              <GroupChatAvatar
                                src={item?.members?.map((user) => user?.photo?.completedUrl)}
                                groupChatMembers={item?.members}
                                groupChatDetails={getCurrentGroupChatDetails}
                              />
                            )
                          ) : //  render private chat messages and to find the user other than the logged in user themselves who sent the messages
                          item?.message?.[0]?.sentBy?.find((item: IUser) => item?._id !== user?._id)?.photo
                              ?.completedUrl ? (
                            <UserOnlineAvartar
                              src={
                                // if private chat member has uploaded their profile photo render than else render defaultUserPhoto comp
                                item?.message?.[0]?.sentBy?.find((item: IUser) => item?._id !== user?._id)?.photo
                                  ?.completedUrl
                              }
                              isUserOnline={
                                onlineUsersInGroup?.filter((item) => item?.associatedUser?.includes(item?._id))
                                  .length !== 0
                              }
                              sx={{ width: '46px', height: '46px' }}
                            />
                          ) : (
                            // find the user other than the logged in user themselves who sent the messages
                            item?.message?.[0]?.sentBy?.find((item: IUser) => item?._id !== user?._id) && (
                              <DefaultUserPhoto
                                userName={
                                  item?.message?.[0]?.sentBy?.find((item: IUser) => item?._id !== user?._id)?.name
                                }
                                fontNewSize={{ fontSize: '16px' }}
                                sx={{
                                  backgroundColor: `${
                                    item?.message?.[0]?.sentBy?.find((item: IUser) => item?._id !== user?._id)?.color
                                  }`,
                                  width: '46px',
                                  height: '46px',
                                }}
                                isUserOnline={
                                  item?.associatedUser?.filter((item: IUser) => onlineUsersInGroup?.includes(item?._id))
                                    .length !== 0
                                }
                              />
                            )
                          )}
                        </Box>
                        <Box sx={RecentMessagesStyles?.messageAndGroupName}>
                          <Typography
                            sx={{
                              ...RecentMessagesStyles?.groupName,
                              fontWeight: item.unseenMessageCount ? 'bold' : 'normal',
                              color: item?.unseenMessageCount ? 'black' : '#43494D',
                            }}
                          >
                            {isGroupChat
                              ? item?.groupName
                              : item?.message?.[0]?.sentBy?.find((item: IUser) => item?._id !== user?._id)?.name}
                          </Typography>

                          <Typography
                            noWrap
                            sx={{
                              ...RecentMessagesStyles?.groupMessage,
                              fontWeight: item.unseenMessageCount ? 'bold' : 'normal',
                              color: item?.unseenMessageCount ? 'black' : '#43494D',
                            }}
                          >
                            {item?.message?.[0].mediaFiles?.length
                              ? 'Sent an image'
                              : isGroupChat
                              ? message
                              : item?.message?.[0]?.sentBy?.find((item: IUser) => item?._id !== user?._id)
                              ? message
                              : ''}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography sx={{ ...RecentMessagesStyles?.messageTime }}>
                        {isGroupChat
                          ? timeFormat(item?.message[0]?.createdAt)
                          : item?.message?.[0]?.sentBy?.find((item: IUser) => item?._id !== user?._id)
                          ? timeFormat(item?.message[0]?.createdAt)
                          : ''}
                      </Typography>
                    </>
                  </Box>
                );
              })}
          </>
          <Box sx={RecentMessagesStyles?.seeAllButton}>
            <DefaultLink to={COMMUNITY_PAGE_ROUTING?.CHAT}>
              <Typography variant="subtitle1" sx={RecentMessagesStyles?.buttonText}>
                {!checkifMessageIsThereForUserToSeeSentByOtherUser() ? 'Go to chat' : ' See all'}
              </Typography>
            </DefaultLink>
          </Box>
        </Box>
      )}
    </>
  );
};

export default RecentMessages;
