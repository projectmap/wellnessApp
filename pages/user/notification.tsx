import React from 'react';
import { Box } from '@mui/system';

import InfiniteScroll from 'react-infinite-scroll-component';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import { Paper, Typography } from '@mui/material';

import { LayoutArea } from '~/modules/_core/layout/LayoutArea';
import { FIREBASE_EVENTS_ENUM } from '~/config/firebase.config';
import GoogleAnalytics from '~/common-ui/GoogleAnalytics/GoogleAnalytics';
import { PolicyLinkArea } from '~/modules/_core/components/policyLink/PolicyLinkArea';
import Notification from '~/modules/_core/components/notification/components/Notification';
import NoNotification from '~/modules/_core/components/notification/components/NoNotification';
import { NotificationResponse } from '~/modules/_core/components/notification/NotificationTypes';
import NotificationMenu from '~/modules/_core/components/notification/components/notificationMenu';
import { useInfiniteListNotification } from '~/modules/_core/components/notification/services/services';

const NotificationPage = () => {
  const { hasApiNextPage, notificationStateData, fetchNextPage } = useInfiniteListNotification({ apiItemCount: 10 });

  return (
    <GoogleAnalytics firebaseEvent={FIREBASE_EVENTS_ENUM.NOTIFICATION_PAGE}>
      <LayoutArea>
        <Container
          sx={{
            minHeight: '93vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Paper
            sx={{
              padding: '3rem 2rem 0 2rem',
              margin: 'auto',
              maxWidth: 900,
              flexGrow: 1,
              border: 'none',
              boxShadow: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" marginBottom={2}>
                <Typography variant="h4" fontSize="32px" mb={2}>
                  Notifications
                </Typography>

                <NotificationMenu />
              </Stack>
              {notificationStateData.length !== 0 ? (
                <InfiniteScroll
                  dataLength={notificationStateData.length}
                  next={() => fetchNextPage()}
                  hasMore={hasApiNextPage}
                  loader={<h4>Loading...</h4>}
                >
                  <Stack spacing={4}>
                    {notificationStateData.map((notification) => {
                      const notifications = notification?.notifications as unknown as NotificationResponse;

                      return (
                        <Notification
                          key={notifications._id}
                          message={notifications.message as string}
                          metaData={notifications.metaData}
                          user={notifications.actionBy?.name as string}
                          avatarSrc={notifications.actionBy?.photo?.completedUrl}
                          seen={notification.seenStatus}
                          notificationId={notification._id}
                          isPage
                          createdDate={notifications.createdAt}
                          color={notifications.actionBy?.color}
                        />
                      );
                    })}
                  </Stack>
                </InfiniteScroll>
              ) : (
                <NoNotification />
              )}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', pb: '12px', mt: '24px' }}>
              <PolicyLinkArea />
            </Box>
          </Paper>
        </Container>
      </LayoutArea>
    </GoogleAnalytics>
  );
};

export default NotificationPage;
