import { Box } from '@mui/system';
import React, { useState } from 'react';
import { Modal, Typography } from '@mui/material';

import { CloseBlue, CourseCompletionIcon } from '~/icons';

import { PrimaryButton } from '~/modules/_core/bits/buttons/PrimaryButton';
import GenericShareModal from '~/modules/community/modals/GenericShareModal';
import { useGetCurrentUserCompletedCourseQuery } from '@newstart-online/sdk';

interface ICourseCompletedModal {
  modalStatus: boolean;
  setModalStatus: (status: boolean) => void;
}

const CourseCompletedModal = ({ modalStatus, setModalStatus }: ICourseCompletedModal) => {
  const { data: currentUserCompletedCourseData } = useGetCurrentUserCompletedCourseQuery();

  const [showGenericShareModal, setShowGenericShareModal] = useState(false);

  const handleCloseCongratulationModal = () => {
    setModalStatus(false);
  };

  return (
    <Modal
      onClose={() => {
        setModalStatus(false);
      }}
      open={modalStatus}
      onBackdropClick={() => {
        setModalStatus(false);
      }}
      sx={{
        outline: 'none',
        backgroundColor: 'background.dark',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',

          position: 'fixed',
          left: '50%',
          top: '50%',
          bottom: '0',
          transform: 'translate(-50%, -50%)',
          background: '#FFFFFF',
          width: '557px',
          height: '512px',
          borderRadius: '8px',
          p: '47px 68px 24px 68px',
        }}
      >
        <Box
          onClick={() => setModalStatus(false)}
          sx={{ position: 'absolute', top: '32px', right: '32px', cursor: 'pointer' }}
        >
          <CloseBlue />
        </Box>
        <CourseCompletionIcon />
        <Typography sx={{ mt: '21px', mb: '4px' }} variant="h6">
          Congratulation!
        </Typography>
        <Typography sx={{ mb: '38px' }} variant="subtitle2">
          You have successfully completed the course.
        </Typography>
        <Typography sx={{ mb: '38px', color: '#147AE9', fontWeight: 500, cursor: 'pointer' }} variant="button">
          {currentUserCompletedCourseData?.data?.[0]?.certificate?.completedUrl && (
            <a
              style={{ color: '#147AE9', textTransform: 'none', fontSize: '16px', fontWeight: 500 }}
              href={currentUserCompletedCourseData?.data?.[0]?.certificate?.completedUrl}
            >
              Download the Certificate
            </a>
          )}
        </Typography>

        <Box>
          <PrimaryButton onClick={() => setShowGenericShareModal(true)} sx={{ borderRadius: '32px', p: '14px 47px' }}>
            Share Now
          </PrimaryButton>
          <GenericShareModal
            showModal={showGenericShareModal}
            setShowGenericShareModal={setShowGenericShareModal}
            isCertificate={true}
            id={currentUserCompletedCourseData?.data?.[0]?.course}
            handleCloseParentModal={handleCloseCongratulationModal}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default CourseCompletedModal;
