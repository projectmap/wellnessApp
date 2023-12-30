import React, { useState } from 'react';
import Image from 'next/image';
import { Box } from '@mui/system';
import { Paper, Typography } from '@mui/material';

import { CloseBlue } from '~/icons';
import { BADGE_MODAL_IFNO_TYPE, COMMUNITY_SHARE_MODAL_TYPE } from '~/state/constants';
import { PrimaryButton } from '~/modules/_core/bits/buttons/PrimaryButton';
import GenericShareModal from '~/modules/community/modals/GenericShareModal';

interface IBadgesInfoModal {
  handleCloseBadgesInfoModal: () => void;
  title?: string;
  imageUrl?: string;
  modalInfoType?: string;
  id?: string;
  isUnlocked?: boolean;
  wantToShare?: boolean;
  descriptions?: string;
}

export default function BadgesInfoModal({
  modalInfoType = BADGE_MODAL_IFNO_TYPE.INFO_ONLY,
  imageUrl,
  id,
  title,
  isUnlocked = false,
  wantToShare = true,
  descriptions,
  handleCloseBadgesInfoModal,
}: IBadgesInfoModal) {
  const [showShareBadgeModal, setShowShareBadgeModal] = useState(false);
  const handleShowShareBadgeModal = () => {
    setShowShareBadgeModal(true);
  };

  let regexForHTML = /<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/;
  let isValidHtml = regexForHTML.test(descriptions || '');

  return (
    <Paper
      sx={{
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%,-50%)',
        width: '558px',
        p: '24px 32px',
        borderRadius: '12px',
        backgroundColor: 'white',
        zIndex: 9,
      }}
      elevation={0}
      component="div"
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: '62px' }}>
        <Typography variant="h5">
          {modalInfoType === BADGE_MODAL_IFNO_TYPE.INFO_ONLY ? title : 'Congralutations !'}
        </Typography>
        <CloseBlue className="cursor-pointer" onClick={() => handleCloseBadgesInfoModal()} />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {imageUrl && (
          <img
            className={isUnlocked ? '' : 'blackNwhite'}
            src={imageUrl}
            alt={title}
            style={{ height: '150px', width: '150px' }}
          />
        )}
        {BADGE_MODAL_IFNO_TYPE.CONGRATULATIONS === modalInfoType && (
          <Typography variant="h6" sx={{ mt: '24px' }}>
            Unlocked new badge
          </Typography>
        )}
        {descriptions && !isValidHtml && (
          <Typography variant="body1" sx={{ mt: '24px' }}>
            {descriptions}
          </Typography>
        )}

        {descriptions && isValidHtml && (
          <p
            dangerouslySetInnerHTML={{ __html: descriptions }}
            style={{ fontSize: '1rem', lineHeight: '24px', marginTop: '24px', color: '#131336' }}
          />
        )}

        <Typography sx={{ mt: '24px', mb: '42px' }} variant="body1">
          {title}
        </Typography>
        {isUnlocked ? (
          wantToShare && (
            <PrimaryButton
              onClick={() => {
                handleShowShareBadgeModal();
              }}
              sx={{ borderRadius: '40px' }}
            >
              Share
            </PrimaryButton>
          )
        ) : (
          <Typography sx={{ mt: '24px', mb: '42px' }} variant="h6">
            This badge is locked!
          </Typography>
        )}
      </Box>
      <GenericShareModal
        setShowGenericShareModal={setShowShareBadgeModal}
        title={title}
        imageUrl={imageUrl}
        showModal={showShareBadgeModal}
        handleCloseParentModal={handleCloseBadgesInfoModal}
        shareModalType={COMMUNITY_SHARE_MODAL_TYPE.sharedBadge}
        id={id}
      />
    </Paper>
  );
}
