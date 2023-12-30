import React from 'react';
import { Box, Stack } from '@mui/system';
import { Typography, useMediaQuery } from '@mui/material';

import { IUserMessageCard } from './Types';
import { useAppSelector } from '~/state/app/hooks';
import { GroupChatAvatar } from './GroupChatAvatar';
import { IMessageGroup, IUser, useGetCurrentUserProfileDetailsQuery } from '@newstart-online/sdk';
import { DefaultUserPhoto } from './DefaultUserPhoto';
import UserOnlineAvartar from './UserOnlineStatusAvatar';
import { useGetOnlineUser } from '~/utils/useGetOnlineUser';
import { useGetUserLastActiveTime } from '~/utils/useGetUserLastActiveTime';

export const UserMessageCard = ({
  selectedGroupChat,
  imageSrc,
  userName,
  userMessage,
  messageTime,
  userColor,
  groupChatDetails,
  id,
  onClick,
}: IUserMessageCard) => {
  const { data: profileData } = useGetCurrentUserProfileDetailsQuery();

  const isUserOnline = useGetOnlineUser(groupChatDetails); //ws
  const isUserLastActive = useGetUserLastActiveTime(groupChatDetails, profileData); //from database
  const onlineUsersFromWs = useAppSelector((state) => state.chats.onlineUsers);
  const onlineUser = onlineUsersFromWs?.find((user: any) => user?._id === id);

  const matchesSmallDesktop = useMediaQuery('(max-width:1200px)');

  return (
    <Box
      component="div"
      sx={{
        background: `${selectedGroupChat ? '#F1F1F1' : 'transparent'}`,
        paddingTop: '15px',
        paddingBottom: '10px',
        px: 2,
        mb: 2,
        borderRadius: '4px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mr: '9px',
        cursor: 'pointer',
        width: '100%',
      }}
      onClick={onClick}
    >
      <Stack direction="row" alignItems="center">
        {imageSrc ? (
          typeof imageSrc === 'string' ? (
            <UserOnlineAvartar
              src={imageSrc}
              sx={{
                width: `${matchesSmallDesktop ? '32px' : '48px'}`,
                height: `${matchesSmallDesktop ? '32px' : '48px'}`,
              }}
              isUserOnline={onlineUser?._id === id}
            />
          ) : (
            <GroupChatAvatar
              src={imageSrc}
              userName={userName}
              userColor={userColor}
              groupChatMembers={groupChatDetails?.members as IUser[]}
              groupChatDetails={groupChatDetails}
            />
          )
        ) : (
          <DefaultUserPhoto
            sx={{
              width: `${matchesSmallDesktop ? '32px' : '48px'}`,
              height: `${matchesSmallDesktop ? '32px' : '48px'}`,
              border: `${onlineUser?._id === id ? '1px solid #fff' : ''}`,
              background: `${userColor}`,
            }}
            userName={userName}
            fontNewSize={{ fontSize: '16px' }}
            isUserOnline={onlineUser?._id === id}
          />
        )}
        <Stack sx={{ pl: matchesSmallDesktop ? 1.5 : 2.3 }}>
          <Typography
            variant="body1"
            sx={{
              color: `${(groupChatDetails?.unseenMessageCount as number) > 0 ? '#131336' : '#43494D'}`,
              fontWeight: `${(groupChatDetails?.unseenMessageCount as number) > 0 ? 600 : 500}`,
              fontSize: `${matchesSmallDesktop && '14px'}`,
            }}
          >
            {userName || 'No Name'}
          </Typography>
          <Typography
            noWrap
            variant="subtitle2"
            sx={{
              opacity: '0.8',
              color: '#131336',
              whiteSpace: 'normal',
              overflow: 'hidden',
              fontSize: `${matchesSmallDesktop && '12px'}`,
              textOverflow: 'ellipsis',
              fontWeight: `${(groupChatDetails?.unseenMessageCount as number) > 0 ? 600 : 400}`,
            }}
          >
            {typeof userMessage === 'string' && userMessage?.length > 50
              ? userMessage?.substring(0, matchesSmallDesktop ? 15 : 50) + '...'
              : userMessage}
          </Typography>
        </Stack>
      </Stack>
      <Typography
        variant="overline"
        sx={{
          color: '#43494D',
          textTransform: 'none',
          whiteSpace: 'nowrap',
          fontWeight: `${(groupChatDetails?.unseenMessageCount as number) > 0 ? 600 : 400}`,
        }}
      >
        {messageTime ? messageTime : isUserOnline ? 'online' : isUserLastActive}
      </Typography>
    </Box>
  );
};
