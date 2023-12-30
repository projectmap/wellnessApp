import React from 'react';
import { Container, Box } from '@mui/system';
import { Typography } from '@mui/material';

import { CloseBtnGray, CourseCompletionIcon } from '~/icons';
import { LearnTodayStyles } from '../styles/LearnTodayStyles';
import { PrimaryButton } from '~/modules/_core/bits/buttons/PrimaryButton';
import { DefaultLink } from '~/modules/_core/components/links/DefaultLink';
import GenericShareModal from '~/modules/community/modals/GenericShareModal';

interface ICongratulations {
  certificate?: 'string';
  courseID?: string;
}

export default function Congratulations({ certificate, courseID }: ICongratulations) {
  const [showGenericShareModal, setShowGenericShareModal] = React.useState<boolean>(false);
  const closeShareModal = () => setShowGenericShareModal(false);

  // to hide and show course completion certificate on the top of screen and save that to localStorage
  const isCertificateShown = localStorage.getItem('showCertificate');
  const [isCertificateOnLocalStorage, setIsCertificateOnLocalStorage] = React.useState<string>(
    isCertificateShown as string,
  );
  if (isCertificateOnLocalStorage === null) {
    localStorage.setItem('showCertificate', 'no');
  }

  const handleShowCertificateOnLocalStorage = () => {
    localStorage.setItem('showCertificate', 'yes');
    setIsCertificateOnLocalStorage('yes');
  };

  return (
    <>
      {isCertificateOnLocalStorage === 'no' && (
        <Container maxWidth="xl" sx={LearnTodayStyles?.learnTodayContainer}>
          <Box
            sx={{
              display: 'flex',
              backgroundColor: '#E8F2FD',
              alignItems: 'center',
              p: 5,
              borderRadius: '12px',
              position: 'relative',
            }}
          >
            <CourseCompletionIcon />

            <GenericShareModal
              isCertificate={true}
              showModal={showGenericShareModal}
              id={courseID}
              setShowGenericShareModal={setShowGenericShareModal}
              handleCloseParentModal={closeShareModal}
            />
            <Box>
              <Box sx={{ pl: 3 }}>
                <Typography variant="h4" sx={{ mb: 2 }}>
                  Congratulations!
                </Typography>
                <Typography variant="body2">
                  You have completed the course and earned the course completion badge.
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
                  <PrimaryButton
                    sx={{ borderRadius: '40px', width: '176px' }}
                    onClick={() => {
                      setShowGenericShareModal(true);
                    }}
                  >
                    Share now
                  </PrimaryButton>
                  {certificate && (
                    <Box sx={{ ml: 5 }}>
                      <DefaultLink to={`${certificate}`}>Download Cetificate</DefaultLink>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                mr: '38px',
                position: 'absolute',
                right: '0px',
                top: '24px',
              }}
            >
              <CloseBtnGray className="cursor-pointer" onClick={handleShowCertificateOnLocalStorage} />
            </Box>
          </Box>
        </Container>
      )}
    </>
  );
}
