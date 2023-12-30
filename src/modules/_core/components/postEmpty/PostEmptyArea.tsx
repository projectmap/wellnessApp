import React from 'react';
import Image from 'next/image';
import { Box, Button } from '@mui/material';

import { LEARN_PAGE_ROUTING } from '~/state/constants';
import { PostEmptyWrapper } from '~/modules/_core/styles/PostEmptyWrapper';
import { PostEmptyAreaStyles } from '~/modules/community/styles/PostEmptyAreaStyles';

export const PostEmptyArea = () => {
  let postEmptyImage = '/assets/images/wavy-buddies-out-stock.svg';

  return (
    <PostEmptyWrapper>
      <h3 className="title">Today’s Session</h3>
      <Box className="content">
        <picture>
          <Image src={postEmptyImage} width={230} height={175} alt="Video Lectures" />
        </picture>
        <h4 className="mb-8">Video Lectures</h4>
        <p>
          Our highly experienced lifestyle physicians <br /> and health professionals will guide your journey to better
          health.
        </p>
        <Box className="btn__wrap">
          <Button sx={PostEmptyAreaStyles?.exploreButton} href={`${LEARN_PAGE_ROUTING?.COURSE}`}>
            Explore lectures
          </Button>
        </Box>
      </Box>
    </PostEmptyWrapper>
  );
};
