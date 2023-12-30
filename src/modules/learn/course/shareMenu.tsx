import React, { useState } from 'react';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import {
  EmailShareButton,
  FacebookShareButton,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  TwitterIcon,
  TwitterShareButton,
  EmailIcon,
  FacebookIcon,
} from 'react-share';
import { CommunityIconBlue } from '~/icons';
import GenericShareModal from '~/modules/community/modals/GenericShareModal';
import { COMMUNITY_SHARE_MODAL_TYPE } from '~/state/constants';

interface IshareMenu {
  title: string;
  shareUrl: string;
  imageUrl?: string;
  id?: string;
  description?: string;
  lectureTitle?: string;
}

const ShareMenu: React.FC<IshareMenu> = ({ description, lectureTitle, title, shareUrl, imageUrl, id }) => {
  const [showGenericShareModal, setShowGenericShareModal] = useState(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <GenericShareModal
        setShowGenericShareModal={setShowGenericShareModal}
        title={lectureTitle}
        imageUrl={imageUrl}
        showModal={showGenericShareModal}
        shareModalType={COMMUNITY_SHARE_MODAL_TYPE.sharedLecture}
        id={id}
        description={description}
      />
      <FacebookShareButton url={shareUrl} title={title}>
        <Box sx={{ mb: '16px', display: 'flex', alignItems: 'center' }}>
          <FacebookIcon size={32} round={true} />

          <Typography variant="subtitle1" sx={{ ml: '12px' }}>
            Facebook
          </Typography>
        </Box>
      </FacebookShareButton>
      <TwitterShareButton url={shareUrl} title={title}>
        <Box sx={{ mb: '16px', display: 'flex', alignItems: 'center' }}>
          <TwitterIcon size={32} round={true} />

          <Typography variant="subtitle1" sx={{ ml: '12px' }}>
            Twitter
          </Typography>
        </Box>
      </TwitterShareButton>
      <EmailShareButton url={shareUrl} body={title}>
        <Box sx={{ mb: '16px', display: 'flex', alignItems: 'center' }}>
          <EmailIcon size={32} round={true} />

          <Typography variant="subtitle1" sx={{ ml: '12px' }}>
            Email
          </Typography>
        </Box>
      </EmailShareButton>
      <Box
        sx={{ mb: '16px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        onClick={() => setShowGenericShareModal(true)}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '32px', height: '32px' }}>
          <CommunityIconBlue />
        </Box>
        <Typography variant="subtitle1" sx={{ ml: '12px' }}>
          Community
        </Typography>
      </Box>
    </Box>
  );
};

export default ShareMenu;
