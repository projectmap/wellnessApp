import React from 'react';
import Image from 'next/image';
import { Box } from '@mui/material';

import { PostEmptyWrapper } from './PostEmptyWrapper';
import { ButtonBorder } from '../bits/buttons/ButtonBorder';

export const HelpReportEmptyArea = () => {
  return (
    <PostEmptyWrapper>
      <h3 className="title">ContainerWrapperArea</h3>
      <Box className="content">
        <picture>
          <Image src="/assets/images/health-report.svg" width={185} height={138} alt="Video Lectures" />
        </picture>
        <h4>Video Lectures</h4>
        <p>
          Track progress of your health and <br /> record the datas.
        </p>
        <Box className="btn__wrap">
          <ButtonBorder>Record new</ButtonBorder>
        </Box>
      </Box>
    </PostEmptyWrapper>
  );
};
