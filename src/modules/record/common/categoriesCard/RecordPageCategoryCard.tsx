import moment from 'moment';
import React, { FC } from 'react';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import { ENUM_ROLE_ACCESS_FOR } from '@newstart-online/sdk';

import { Modal, useModal } from '~/modules/_core/bits/commonModal';
import { RECORD_TYPE, useListRecordLogsTypesQuery } from '@newstart-online/sdk';
import { RecordCategoryCardWrapper } from '~/modules/record/styles/RecordCategoryCardWrapper';
import { RecordLogQuestionareModal } from '~/modules/record/RecordLogQuestionareModal/RecordLogQuestionareModal';
import { recordTypeWidthAndHeight } from '../../utils/record-logs-type';
import GenericUpgradeModal from '~/modules/_core/bits/modals/GenericUpgradeModal';
import { useGetUser } from '~/utils/useGetUser';

interface RecordCategoryCardProps {
  cardText: string;
  icon: React.ReactNode;
  lastRecorded: string;
  recordLogs: RECORD_TYPE;
}

export const RecordPageCategoryCard: FC<RecordCategoryCardProps> = ({ icon, cardText, lastRecorded, recordLogs }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedRecordLogs, setSelectedRecordLogs] = React.useState<RECORD_TYPE>(RECORD_TYPE.WATER_INTAKE);
  const { data: recordLogTypes } = useListRecordLogsTypesQuery();
  const [updatePlanModal, setUpdatePlanModal] = React.useState(false);
  const user = useGetUser();

  const selectedRecord = recordLogTypes?.data?.find((item) => item.recordLogEnum === recordLogs);

  const onCardClicked = () => {
    if (user && user?.role?.accessFor === ENUM_ROLE_ACCESS_FOR.FREE_USER) {
      setUpdatePlanModal(user?.role?.accessFor === ENUM_ROLE_ACCESS_FOR.FREE_USER);

      return;
    }
    openModal();
    setSelectedRecordLogs(recordLogs);
  };

  return (
    <RecordCategoryCardWrapper>
      <GenericUpgradeModal
        onCrossClick={() => setUpdatePlanModal(false)}
        setModalStatus={setUpdatePlanModal}
        modalStatus={updatePlanModal}
      />
      <Box onClick={onCardClicked}>
        <Box sx={{ marginBottom: '28px' }}>
          <img
            src={selectedRecord?.logo?.completedUrl}
            style={{ width: recordTypeWidthAndHeight[recordLogs].width }}
            height={recordTypeWidthAndHeight[recordLogs].height}
          />
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ textAlign: 'left' }}>
            {selectedRecord?.title}
          </Typography>
          <Typography variant="subtitle1" sx={{ textAlign: 'left', color: '#000', opacity: 0.4, fontSize: '12px' }}>
            Last Recorded : {lastRecorded ? moment(lastRecorded).calendar().split('at ')[0] : 'Not Recorded'}
          </Typography>
        </Box>
      </Box>
      <Modal
        isOpen={isOpen}
        closeIcon={true}
        closeModal={closeModal}
        content={<RecordLogQuestionareModal closeModal={closeModal} selectedRecordLogs={selectedRecordLogs} />}
      />
    </RecordCategoryCardWrapper>
  );
};
