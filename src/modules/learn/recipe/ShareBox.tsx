import React, { FC } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Typography } from '@mui/material';

import { CommunityIconBlue, CopyLink } from '~/icons';
import { COMMUNITY_SHARE_MODAL_TYPE } from '~/state/constants';
import { LearnResources } from '~/modules/_core/styles/LearnResources';
import GenericShareModal from '~/modules/community/modals/GenericShareModal';

interface IShareBox {
  articleContent: string | undefined;
  contentId: string;
  title?: string | undefined;
  imageUrl?: string;
  description?: string;
  shareModalType?: COMMUNITY_SHARE_MODAL_TYPE;
}
export const ShareBox: FC<IShareBox> = ({
  shareModalType,
  articleContent,
  contentId,
  title,
  imageUrl,
  description,
}) => {
  const [showGenericShareModal, setShowGenericShareModal] = React.useState(false);

  const copyLinkUrl = () => {
    if (typeof window !== 'undefined' && window.location) {
      let copiedUrl = window.location && window?.location?.href;
      navigator.clipboard.writeText(copiedUrl);
      toast.success('Copied Link Successfully');
    }
  };

  return (
    <LearnResources>
      <GenericShareModal
        imageUrl={imageUrl}
        setShowGenericShareModal={setShowGenericShareModal}
        showModal={showGenericShareModal}
        title={title}
        description={description}
        shareModalType={shareModalType}
        id={contentId}
      />
      <Box sx={{ width: '20%' }}>
        <Box sx={{ background: '#F3F3F5', borderRadius: '4px', width: '187px', height: '185px', p: 4, ml: 18 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Share
          </Typography>
          <Box className="articles-share-options">
            <Box onClick={copyLinkUrl} sx={{ cursor: 'pointer', display: 'flex', mb: 1.5 }}>
              <CopyLink />
              <Typography sx={{ fontSize: '14px', ml: 1 }}>Copy Link</Typography>
            </Box>

            <button onClick={() => setShowGenericShareModal(true)}>
              <div>
                <CommunityIconBlue />
              </div>
              Community
            </button>
          </Box>
        </Box>
      </Box>
    </LearnResources>
  );
};
