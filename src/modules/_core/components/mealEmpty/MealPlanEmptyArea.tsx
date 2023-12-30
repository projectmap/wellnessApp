import React from 'react';
import Image from 'next/image';

import { LEARN_PAGE_ROUTING } from '~/state/constants';
import { Box, Button, Typography } from '@mui/material';
import { getDateDetails } from '~/utils/getDateDetails';
import { PostEmptyWrapper } from '~/modules/_core/styles/PostEmptyWrapper';
import { MealPlanEmptyAreaStyles } from '~/modules/community/styles/MealPlanEmptyAreaStyles';
import { CommunityFeedEmptyAreaStyles } from '~/modules/community/styles/CommunityFeedEmptyAreaStyles';

export const MealPlanEmptyArea = () => {
  const today = getDateDetails();
  let torsoImage = '/assets/images/wavy-buddies-torso.svg';

  return (
    <PostEmptyWrapper>
      <h3 className="title">Today’s Meal Plan</h3>
      <Box className="content">
        <Typography sx={MealPlanEmptyAreaStyles?.today} variant="body1">
          {today.dayName}, {today.monthName} {today.day}, {today.year}
        </Typography>
        <picture>
          <Image src={torsoImage} width={230} height={175} alt="Video Lectures" />
        </picture>
        <Typography variant="h4" sx={MealPlanEmptyAreaStyles?.title}>
          Healthy Meal Plan
        </Typography>
        <p className="width-home-feature-desc marginlf-auto">
          Improve your nutrition with our carefully prepared meal plan or build your own based on NEWSTART principles.
        </p>
        <Box className="btn__wrap">
          <Button sx={CommunityFeedEmptyAreaStyles?.buttonContainer} href={`${LEARN_PAGE_ROUTING?.DIET}`}>
            Explore meals
          </Button>
        </Box>
      </Box>
    </PostEmptyWrapper>
  );
};
