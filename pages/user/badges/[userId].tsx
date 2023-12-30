import Image from 'next/image';
import React, { useState } from 'react';
import { Box, Container } from '@mui/system';
import { GetServerSideProps, NextPage } from 'next';
import { Modal, Skeleton, Typography } from '@mui/material';

import { LayoutArea } from '~/modules/_core/layout/LayoutArea';
import {
  useGetCurrentUserBadgesQuery,
  useGetUserBadgeListWithRecordLogsTypesByUserIdQuery,
  useGetUserBadgeListWithRecordLogsTypesQuery,
  IAchievementWithStreakDetails,
} from '@newstart-online/sdk';
import { CommunityFooterLinks } from '~/modules/community/CommunityFooterLinks';
import BadgesInfoModal from '~/modules/_core/components/badges/modals/BadgesInfoModal';
import GoogleAnalytics from '~/common-ui/GoogleAnalytics/GoogleAnalytics';
import { FIREBASE_EVENTS_ENUM } from '~/config/firebase.config';

const Badges: NextPage<{ userId: string }> = ({ userId }) => {
  const isCurrentUser = userId === 'me';
  const dummyData = [
    { title: 'dummy badge', imageUrl: '' },
    { title: 'dummy badge', imageUrl: '' },
    { title: 'dummy badge', imageUrl: '' },
    { title: 'dummy badge', imageUrl: '' },
    { title: 'dummy badge', imageUrl: '' },
  ];
  const { data: badgesData, isFetching: isBadgesFetching } = useGetCurrentUserBadgesQuery();
  const { data: badgesForCurrentUsers } = useGetUserBadgeListWithRecordLogsTypesQuery();
  const { data: badgesListsWithRecordTypes } = useGetUserBadgeListWithRecordLogsTypesByUserIdQuery(userId, {
    skip: !userId,
  });

  const [showBadgesInfoModal, setShowBadgesInfoModal] = useState(false);
  const [modalData, setModalData] = useState<IAchievementWithStreakDetails>();

  const handleCloseBadgesInfoModal = () => {
    setShowBadgesInfoModal(false);
  };

  const handleOpenBadgesInfoModal = () => {
    setShowBadgesInfoModal(true);
  };

  const hanldeLoadModalData = (clickedBadge: IAchievementWithStreakDetails) => {
    setModalData(clickedBadge);
  };

  const recordLogsWithBadges = isCurrentUser ? badgesForCurrentUsers : badgesListsWithRecordTypes;

  return (
    <GoogleAnalytics firebaseEvent={FIREBASE_EVENTS_ENUM.BADGE_PAGE}>
      <LayoutArea>
        <Container maxWidth="xl" sx={{ pt: 4 }}>
          <Modal
            open={showBadgesInfoModal}
            onClose={handleCloseBadgesInfoModal}
            aria-labelledby="badge info"
            aria-describedby="badge info"
          >
            <BadgesInfoModal
              handleCloseBadgesInfoModal={handleCloseBadgesInfoModal}
              title={modalData?.title}
              imageUrl={modalData?.badge?.completedUrl}
              id={modalData?._id}
              isUnlocked={modalData?.isUnLocked}
            />
          </Modal>
          <Typography variant="h3">Badges</Typography>
          {isBadgesFetching &&
            dummyData?.map((item, idx) => {
              return (
                <Box sx={{ width: '100%', mt: '42px' }} key={idx}>
                  <Skeleton variant="text" width="150px" />
                  <Box
                    sx={{ display: 'flex', justifyContent: 'flex-start', gap: '55px', flexWrap: 'wrap', mt: '24px' }}
                  >
                    {dummyData?.map((item, idx) => {
                      return (
                        <Box
                          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '15%' }}
                          key={idx}
                        >
                          <Skeleton
                            variant="rectangular"
                            width="120px"
                            height="120px"
                            sx={{ borderRadius: '50%', mb: '16px' }}
                          />
                          <Skeleton variant="text" width="100px" />
                          <Skeleton variant="text" width="80px" />
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              );
            })}

          {!isBadgesFetching &&
            recordLogsWithBadges?.data?.map((recordType, idx) => {
              return (
                <Box sx={{ width: '100%', mt: '42px', cursor: 'pointer' }} key={idx}>
                  <Typography variant="h5">{recordType.title}</Typography>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'flex-start', gap: '55px', flexWrap: 'wrap', mt: '24px' }}
                  >
                    {[...(recordType?.badges || [])]
                      ?.sort((a, b) => a.timeToAchieveGoal - b.timeToAchieveGoal)
                      ?.map((item, idx) => {
                        return (
                          <Box
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '120px' }}
                            key={idx}
                            onClick={() => {
                              if (isCurrentUser) {
                                hanldeLoadModalData(item);
                                handleOpenBadgesInfoModal();
                              }
                            }}
                          >
                            <img
                              className={item?.isUnLocked ? '' : 'blackNwhite'}
                              src={item?.badge?.completedUrl}
                              height="80px"
                              style={{ width: '80px' }}
                            />
                            <Typography variant="subtitle2" align="center" sx={{ width: '100%', mt: '16px' }}>
                              {item?.title}
                            </Typography>
                          </Box>
                        );
                      })}
                  </Box>
                </Box>
              );
            })}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CommunityFooterLinks />
          </Box>
        </Container>
      </LayoutArea>
    </GoogleAnalytics>
  );
};

export default Badges;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const userId = ctx.query.userId as string;

  return {
    props: {
      userId,
    },
  };
};
