import React from 'react';
import { Box, Container, Typography } from '@mui/material';

import { BADGE_MODAL_IFNO_TYPE } from '~/state/constants';
import { useAppDispatch, useAppSelector } from '~/state/app/hooks';
import { recordTypeWithQuestions } from '../utils/record-logs-type';
import { RecordCategoryWrapper } from '../styles/RecordCategoryWrapper';
import { CommunityFooterLinks } from '~/modules/community/CommunityFooterLinks';
import { useGetCurrentUserRecordLogsLastRecordedQuery } from '@newstart-online/sdk';
import { RecordPageCategoryCard } from '../common/categoriesCard/RecordPageCategoryCard';
import BadgesInfoModal from '~/modules/_core/components/badges/modals/BadgesInfoModal';
import { setShowRecordLogBadgeUnlockedModal } from '~/state/services/recordLogsBadgeNotification/recordLogsBadgeNotification';

export function RecordCategory() {
  const dispatch = useAppDispatch();

  const { data } = useGetCurrentUserRecordLogsLastRecordedQuery();

  const recordLogBadgeUnlockedModalInfo = useAppSelector((state) => state.recordLogBadgeInfo);

  const handleCloseBadgesInfoModal = () => {
    dispatch(setShowRecordLogBadgeUnlockedModal(false));
  };

  return (
    <RecordCategoryWrapper>
      <Container maxWidth="md">
        {recordLogBadgeUnlockedModalInfo?.showRecordLogBadgeUnlockedModal && (
          <BadgesInfoModal
            handleCloseBadgesInfoModal={handleCloseBadgesInfoModal}
            isUnlocked={true}
            title="Congratulations!"
            modalInfoType={BADGE_MODAL_IFNO_TYPE.CONGRATULATIONS}
            wantToShare={false}
            descriptions={recordLogBadgeUnlockedModalInfo?.badgeInfos?.descriptions}
            imageUrl={recordLogBadgeUnlockedModalInfo?.badgeInfos?.imageUrl}
          />
        )}

        <Box className="record__category">
          <Box className="record--title">
            <Typography variant="h2">Record new data</Typography>
          </Box>
          <Box>
            <Box className="category__list">
              {recordTypeWithQuestions.map((cat) => (
                <RecordPageCategoryCard
                  key={cat.title}
                  icon={cat.icon}
                  cardText={cat.title}
                  lastRecorded={data?.data?.find((item) => item.recordType === cat.recordType)?.updatedAt || ''}
                  recordLogs={cat.recordType}
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CommunityFooterLinks />
            </Box>
          </Box>
        </Box>
      </Container>
    </RecordCategoryWrapper>
  );
}
