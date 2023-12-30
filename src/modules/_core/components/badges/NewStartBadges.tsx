import Image from 'next/image';
import { Box, Stack } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { Modal, Skeleton, Typography } from '@mui/material';
import {
  IAchievementWithStreakDetails,
  useGetCurrentUserBadgesQuery,
  useGetUserBadgeByIdQuery,
} from '@newstart-online/sdk';

import { EmptyBadgeIcon } from '~/icons';
import { DefaultLink } from '../links/DefaultLink';
import BadgesInfoModal from './modals/BadgesInfoModal';
import { badgesAchievedCounter } from '~/utils/getUnlockedBadgesCount';
import { RecentMessagesStyles } from '../../styles/RecentMessageStyles';
import { BADGES_PAGE_ROUTING, EMPTY_BADGE_DATA, USER_TYPE_FOR_BADGES } from '~/state/constants';

interface INewStartBadges {
  userType: USER_TYPE_FOR_BADGES;
  id?: string;
}

export default function NewStartBadges({ userType, id = '' }: INewStartBadges) {
  const { data: badgesData, isFetching: isBadgesFetching } = useGetCurrentUserBadgesQuery();
  const { data: otherUserBadges } = useGetUserBadgeByIdQuery(id);
  const badgesDummyData = ['badge1', 'badge2'];
  const badgesAchieved = badgesAchievedCounter(
    userType === USER_TYPE_FOR_BADGES.CURRENT_USER ? badgesData?.data : otherUserBadges?.data,
  );

  const [showBadgesInfoModal, setShowBadgesInfoModal] = useState(false);
  const [modalData, setModalData] = useState({ title: '', imageUrl: '', id: '', isUnlocked: false });
  const [badgesToShow, setBadgesToShow] = useState<IAchievementWithStreakDetails[]>();

  const handleOpenBadgesInfoModal = () => {
    setShowBadgesInfoModal(true);
  };

  const hanldeLoadModalData = (clickedBadge: any) => {
    setModalData({
      title: clickedBadge?.title,
      imageUrl: clickedBadge?.badge?.completedUrl,
      id: clickedBadge?._id,
      isUnlocked: clickedBadge.isUnLocked,
    });
  };

  const handleCloseBadgesInfoModal = () => {
    setShowBadgesInfoModal(false);
  };

  useEffect(() => {
    if (userType === USER_TYPE_FOR_BADGES.CURRENT_USER) {
      const unlockedBadges = [...(badgesData?.data || [])].filter((item) => item?.isUnLocked);
      const anotherLockedBadge = [...(badgesData?.data || [])].find((item) => !item?.isUnLocked) || [];
      badgesData?.data && setBadgesToShow(unlockedBadges?.concat(anotherLockedBadge));
    } else {
      const unlockedBadges = [...(otherUserBadges?.data || [])].filter((item) => item?.isUnLocked);
      const anotherLockedBadge = [...(otherUserBadges?.data || [])].find((item) => !item?.isUnLocked) || [];

      otherUserBadges?.data && setBadgesToShow(unlockedBadges?.concat(anotherLockedBadge));
    }
  }, [otherUserBadges?.data, badgesData?.data]);

  return (
    <Box
      sx={{ border: '1px solid #E7E7EB', borderRadius: '12px', backgroundColor: '#FFFFFF', p: '24px 16px', mt: '32px' }}
    >
      <Modal
        open={showBadgesInfoModal}
        onClose={handleCloseBadgesInfoModal}
        aria-labelledby="badge info"
        aria-describedby="badge info"
      >
        <BadgesInfoModal
          handleCloseBadgesInfoModal={handleCloseBadgesInfoModal}
          title={modalData.title}
          imageUrl={modalData.imageUrl}
          id={modalData.id}
          isUnlocked={modalData.isUnlocked}
        />
      </Modal>

      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
        <Typography variant="h6">Badges</Typography>
        <Typography variant="h6" sx={{ color: '#0C72E0' }}>
          {badgesAchieved}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: '24px', justifyContent: 'space-between' }}>
        {isBadgesFetching &&
          badgesDummyData?.map((item, idx) => (
            <Stack alignItems="center" justifyContent="center" sx={{ width: '45%' }} key={idx}>
              <Skeleton variant="circular" height="80px" width="80px" />
              <Skeleton variant="text" sx={{ width: '90%', mt: '16px' }} />
              <Skeleton variant="text" sx={{ width: '100%', mt: '8px' }} />
            </Stack>
          ))}
        {badgesAchieved
          ? badgesToShow?.slice(0, 2).map((item, idx) => {
              return (
                <Stack
                  alignItems="center"
                  sx={{ width: '45%' }}
                  key={idx}
                  onClick={() => {
                    if (userType === USER_TYPE_FOR_BADGES.CURRENT_USER) {
                      hanldeLoadModalData(item);
                      handleOpenBadgesInfoModal();
                    }
                  }}
                >
                  <img
                    className={item?.isUnLocked ? '' : 'blackNwhite'}
                    src={item?.badge?.completedUrl}
                    style={{ height: '80px', width: '80px' }}
                  />
                  <Typography variant="subtitle2" align="center" sx={{ width: '100%', mt: '16px' }}>
                    {item?.title}
                  </Typography>
                </Stack>
              );
            })
          : !isBadgesFetching && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <EmptyBadgeIcon />
                <Typography sx={{ mt: '16px', textAlign: 'center' }} variant="subtitle2">
                  {userType === USER_TYPE_FOR_BADGES.CURRENT_USER
                    ? EMPTY_BADGE_DATA.INFO
                    : EMPTY_BADGE_DATA.INFOR_OTHER_USERS}
                </Typography>
              </Box>
            )}
      </Box>
      <Box sx={RecentMessagesStyles?.seeAllButton}>
        <DefaultLink
          to={BADGES_PAGE_ROUTING.BADGES + (userType === USER_TYPE_FOR_BADGES.CURRENT_USER ? '/me' : '/' + id)}
        >
          <Typography variant="subtitle1" sx={RecentMessagesStyles?.buttonText}>
            See all
          </Typography>
        </DefaultLink>
      </Box>
    </Box>
  );
}
