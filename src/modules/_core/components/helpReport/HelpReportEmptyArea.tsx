import React from 'react';
import Image from 'next/image';
import { Box, Button } from '@mui/material';

import { USER_ROUTING } from '~/state/constants';
import { PostEmptyWrapper } from '~/modules/_core/styles/PostEmptyWrapper';
import { CommunityFeedEmptyAreaStyles } from '~/modules/community/styles/CommunityFeedEmptyAreaStyles';

export const HelpReportEmptyArea = () => {
  let reportImage = '/assets/images/health-report.svg';

  return (
    <PostEmptyWrapper>
      <h3 className="title">Today’s Health Report</h3>
      <Box className="content">
        <picture>
          <Image src={reportImage} width={230} height={175} alt="Video Lectures" />
        </picture>
        <h4 className="mb-8">Health Report</h4>
        <p>Record your data and track your health progress.</p>

        <Box className="btn__wrap">
          <Button sx={CommunityFeedEmptyAreaStyles?.buttonContainer} href={USER_ROUTING?.RECORD}>
            Record new
          </Button>
        </Box>
      </Box>
    </PostEmptyWrapper>
  );
};
