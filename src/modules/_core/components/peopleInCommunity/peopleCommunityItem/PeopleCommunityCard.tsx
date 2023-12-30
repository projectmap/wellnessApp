import React from 'react';
import Image from 'next/image';
import { Box, Button } from '@mui/material';

import { PeopleCommunityCardWrapper } from '~/modules/_core/styles/PeopleCommunityCardWrapper';

export const PeopleCommunityCard = ({ img, name }: any) => {
  return (
    <PeopleCommunityCardWrapper>
      <picture>
        <Image src={img} width={72} height={72} alt="community" />
      </picture>
      <Box className="content">
        <h4>{name}</h4>
        <Box className="btn">
          <Button variant="outlined" color="primary" className="btn--follow">
            Follow
          </Button>
        </Box>
      </Box>
    </PeopleCommunityCardWrapper>
  );
};
