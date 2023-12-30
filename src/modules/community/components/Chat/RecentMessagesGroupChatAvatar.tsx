import React, { useRef } from 'react';
import { Box, styled, Theme } from '@mui/system';
import { SxProps, Badge, Avatar } from '@mui/material';

import { useGetUser } from '~/utils/useGetUser';
import { DefaultUserPhoto } from './DefaultUserPhoto';
import { OnlineBadge } from './UserOnlineStatusAvatar';

interface IGroupChatAvatar {
  sx?: SxProps<Theme> | undefined;
  src?: string[];
  userName?: string;
  userColor?: string;
  isUserOnline?: boolean;
  groupCreatorId?: any;
}
export const RecentMessagesGroupChatAvatar = ({ isUserOnline, groupCreatorId, src }: IGroupChatAvatar) => {
  const user = useGetUser();
  const imagesForAvatar = src?.filter((img: string) => img !== user?._id && typeof img !== 'undefined');

  let sortedImages: any = useRef([]);

  const generateRandomImages = React.useCallback(() => {
    return (sortedImages.current = imagesForAvatar?.sort(() => Math.random() - 0.5));
  }, [imagesForAvatar]);

  React.useEffect(() => {
    generateRandomImages();
  }, [generateRandomImages]);

  const defaultAvatarInfo = groupCreatorId?.members?.filter((item: any) => item?._id !== groupCreatorId?.createdBy);
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
          imagesForAvatar?.length !== 0 && sortedImages?.length !== 0 ? (
            <OnlineBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              variant="dot"
              isUserOnline={isUserOnline}
            >
              <SmallAvatar alt="Remy Sharp" src={sortedImages?.current?.[0]} />
            </OnlineBadge>
          ) : (
            <OnlineBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              variant="dot"
              isUserOnline={isUserOnline}
            >
              <DefaultUserPhoto
                sx={{ width: '36px', height: '36px', background: `${groupCreatorId?.color}` }}
                userName={groupCreatorId?.name}
                fontNewSize={{ fontSize: '16px' }}
              />
            </OnlineBadge>
          )
        }
      >
        {defaultAvatarInfo?.[0]?.photo?.completedUrl ? (
          <Avatar alt={user?.name} src={defaultAvatarInfo?.[0]?.photo?.completedUrl} />
        ) : (
          <DefaultUserPhoto
            userName={defaultAvatarInfo?.[0]?.name}
            fontNewSize={{ fontSize: '24px' }}
            sx={{ background: `${defaultAvatarInfo?.[0]?.color}` }}
          />
        )}
      </Badge>
    </Box>
  );
};
