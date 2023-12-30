import React, { useCallback } from 'react';

import { useRouter } from 'next/router';

import moment from 'moment';
import Image from 'next/image';

import { Avatar, Box, Stack, Typography } from '@mui/material';

import { LogoIcon } from '~/icons';
import { SvgIconName } from '~/utils/enums';
import { SvgIcons } from '~/icons/svgIcons';
import { DefaultUserPhoto } from '~/modules/community/components/Chat/DefaultUserPhoto';
import { getNotificationLink } from '~/modules/_core/components/notification/utils/utils';
import { NotificationProps } from '~/modules/_core/components/notification/NotificationTypes';
import { useMarkAsReadNotification } from '~/modules/_core/components/notification/services/services';

const Notification = ({
  user,
  message,
  isPage,
  text,
  metaData,
  avatarSrc,
  seen,
  notificationId,
  createdDate,
  color,
}: NotificationProps) => {
  const router = useRouter();
  const { onSubmit } = useMarkAsReadNotification();
  const icon = metaData?.icon as SvgIconName;
  const markAsRead = useCallback(() => {
    onSubmit({ notificationId });
    router.push(getNotificationLink({ icon, metaData }));
  }, [icon, metaData, notificationId, onSubmit, router]);

  const adminNotificationIcon = 'admin';

  return (
    <Stack direction="row" justifyContent="space-between" alignItems={'center'}>
      <Stack
        onClick={markAsRead}
        direction="row"
        spacing={2}
        justifyContent="left"
        alignItems={'center'}
        sx={{ cursor: 'pointer', width: '95%' }}
      >
        <Stack sx={{ position: 'relative', minHeight: '64px', minWidth: '64px' }}>
          {metaData.icon === adminNotificationIcon ? (
            <LogoIcon />
          ) : avatarSrc ? (
            <Image className="rounded-image" src={avatarSrc} objectFit="cover" layout="fill" alt={user} />
          ) : (
            <DefaultUserPhoto
              userName={user}
              fontNewSize={{ fontSize: '24px' }}
              sx={{ background: `${color}`, width: '64px', height: '64px' }}
            />
          )}

          <Box
            sx={{
              position: 'absolute',
              borderRadius: '100%',
              padding: '6px',
              background: '#0C72E0',
              bottom: 0,
              right: 0,
              height: 25,
              width: 25,
            }}
          >
            <SvgIcons iconName={icon as SvgIconName} width={13} height={13} />
          </Box>
        </Stack>
        <Stack>
          <Typography variant="body1">
            <Box fontWeight="700" display="inline" textTransform="capitalize" fontSize={'16px'}>
              {user}
            </Box>
            {` ${message} `}
            {text && (
              <Box fontWeight="600" display="inline">
                {`"${text.substring(0, 15)}..."`}
              </Box>
            )}
          </Typography>
          {/* {isPage && icon === SvgIconName.FRIEND && (
            <Stack direction="row" spacing={1} mt="8px">
              <Button size="small" sx={{ borderRadius: '4px', padding: '8px 16px' }}>
                Confirm
              </Button>
              <Button
                size="small"
                sx={{
                  borderRadius: '4px',
                  padding: '8px 16px',
                  background: '#E7E7EB',
                  color: '#131336',
                  '&:hover': { color: '#ffffff' },
                }}
              >
                Decline
              </Button>
            </Stack>
          )} */}
          <Box sx={{ mt: 1 }}>{moment(createdDate).format('ddd h:mm A')}</Box>
        </Stack>
      </Stack>
      {!isPage && !seen && (
        <Stack>
          <Box sx={{ width: '10px', height: '10px', background: 'blue', borderRadius: '100%' }} />
        </Stack>
      )}
      {isPage && !seen && (
        <Stack sx={{ marginRight: '24px', width: '5%' }}>
          <Box sx={{ width: '10px', height: '10px', background: 'blue', borderRadius: '100%' }} />
        </Stack>
      )}
    </Stack>
  );
};

export default Notification;
