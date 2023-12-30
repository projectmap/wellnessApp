import React from 'react';
import Image from 'next/image';
import { Box, Button } from '@mui/material';

import { COMMUNITY_PAGE_ROUTING } from '~/state/constants';
import { CommunityFeedEmptyWrapper } from '~/modules/_core/styles/CommunityFeedEmptyWrapper';
import { CommunityFeedEmptyAreaStyles } from '~/modules/community/styles/CommunityFeedEmptyAreaStyles';

export const CommunityFeedEmptyArea = () => {
  let emptyImage = '/assets/images/community-empty.svg';

  return (
    <CommunityFeedEmptyWrapper>
      <h3 className="title">Community Feed</h3>
      <Box className="content">
        <picture>
          <Image src={emptyImage} width={350} height={175} alt="Community" />
        </picture>
        <h4 className="mb-8">Community</h4>
        <p>
          Meet with like-minded people and
          <br /> share your journeys together.
        </p>
        <Box className="btn__wrap">
          <Button sx={CommunityFeedEmptyAreaStyles?.buttonContainer} href={`${COMMUNITY_PAGE_ROUTING?.FEED}`}>
            Explore Community
          </Button>
        </Box>
      </Box>
    </CommunityFeedEmptyWrapper>
  );
};
