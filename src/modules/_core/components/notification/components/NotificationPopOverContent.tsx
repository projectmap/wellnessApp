import React from 'react';

import Link from 'next/link';

import InfiniteScroll from 'react-infinite-scroll-component';

import { Box, Stack, Typography } from '@mui/material';

import Notification from '~/modules/_core/components/notification/components/Notification';
import NoNotification from '~/modules/_core/components/notification/components/NoNotification';
import NotificationMenu from '~/modules/_core/components/notification/components/notificationMenu';
import { useInfiniteListNotification } from '~/modules/_core/components/notification/services/services';
import {
  NotificationPopOverContentProps,
  NotificationResponse,
} from '~/modules/_core/components/notification/NotificationTypes';

const NotificationPopOverContent = ({ to }: NotificationPopOverContentProps) => {
  const { notificationStateData, fetchNextPage, hasApiNextPage } = useInfiniteListNotification({ apiItemCount: 10 });

  return (
    <Box sx={{ width: '320px', height: '540px' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" marginBottom={2}>
        <Typography variant="h4" fontSize="20px">
          Notifications
        </Typography>

        <NotificationMenu />
      </Stack>

      {notificationStateData.length !== 0 ? (
        <>
          <Box
            id="notificationScrollableDiv"
            sx={{
              overflowY: 'auto',
              height: '450px',
            }}
            className="hide-scrollbar"
          >
            <InfiniteScroll
              dataLength={notificationStateData.length}
              next={() => fetchNextPage()}
              hasMore={hasApiNextPage}
              loader={<h4>Loading...</h4>}
              scrollableTarget={'notificationScrollableDiv'}
            >
              <Stack spacing={4}>
                {notificationStateData.map((notification) => {
                  const notifications = notification.notifications as NotificationResponse;

                  return (
                    <Notification
                      key={notifications?._id}
                      message={notifications?.message as string}
                      metaData={notifications?.metaData}
                      user={notifications?.actionBy?.name as string}
                      avatarSrc={notifications?.actionBy?.photo?.completedUrl}
                      seen={notification?.seenStatus}
                      notificationId={notification?._id}
                      createdDate={notifications.createdAt}
                      color={notifications.actionBy?.color}
                    />
                  );
                })}
              </Stack>
            </InfiniteScroll>
          </Box>
        </>
      ) : (
        <NoNotification />
      )}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '10px',
        }}
      >
        <Link href={to}>
          <a>
            <Typography color="#147AE9" fontWeight="500">
              See all
            </Typography>
          </a>
        </Link>
      </Box>
    </Box>
  );
};

export default NotificationPopOverContent;
