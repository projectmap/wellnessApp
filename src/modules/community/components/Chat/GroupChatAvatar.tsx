import React from 'react';
import { Box, styled, Theme } from '@mui/system';
import { SxProps, Badge, Avatar } from '@mui/material';

import { IUser } from '@newstart-online/sdk';
import { useGetUser } from '~/utils/useGetUser';
import { DefaultUserPhoto } from './DefaultUserPhoto';
import { OnlineBadge } from './UserOnlineStatusAvatar';

interface IGroupChatAvatar {
  sx?: SxProps<Theme> | undefined;
  src?: string[];
  userName?: string;
  userColor?: string;
  isUserOnline?: boolean;
  groupChatMembers?: IUser[];
  groupChatDetails?: any;
}
export const GroupChatAvatar = ({ isUserOnline, groupChatMembers, groupChatDetails, src }: IGroupChatAvatar) => {
  const user = useGetUser();
  const imagesForAvatar = groupChatMembers?.filter((img: IUser) => img?._id !== user?._id && img.isActive); //all users except the logged in one

  // small avatar which is top of the group avatar
  const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 38,
    height: 38,
    border: `1px solid ${theme.palette.background.paper}`,
  }));

  return (
    <Box sx={{ mr: 1 }}>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        badgeContent={
          imagesForAvatar?.length !== 0 ? (
            <OnlineBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              variant="dot"
              isUserOnline={isUserOnline}
            >
              {/* first member from the group chat which is at the top*/}
              {imagesForAvatar?.[0]?.photo?.completedUrl ? (
                <SmallAvatar
                  alt={imagesForAvatar?.[0]?.name}
                  src={imagesForAvatar?.[0]?.photo?.completedUrl || src?.find((img) => img !== undefined)}
                />
              ) : (
                <DefaultUserPhoto
                  sx={{ width: '36px', height: '36px', background: `${imagesForAvatar?.[0]?.color}` }}
                  userName={imagesForAvatar?.[0]?.name}
                  fontNewSize={{ fontSize: '16px' }}
                />
              )}
            </OnlineBadge>
          ) : null
        }
      >
        {/* last member of the group chat */}
        {imagesForAvatar?.length && imagesForAvatar?.length >= 1 && imagesForAvatar?.[1]?.photo?.completedUrl ? (
          <Avatar alt={user?.name} src={imagesForAvatar?.[1]?.photo?.completedUrl} />
        ) : (
          <DefaultUserPhoto
            userName={imagesForAvatar?.[1]?.name}
            fontNewSize={{ fontSize: '24px' }}
            sx={{ background: `${imagesForAvatar?.[imagesForAvatar?.length - 1]?.color}` }}
          />
        )}
      </Badge>
    </Box>
  );
};
