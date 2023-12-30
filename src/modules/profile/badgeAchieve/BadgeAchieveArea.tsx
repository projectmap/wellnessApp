import React from 'react';
import { Box } from '@mui/system';
import IconButton from '@mui/material/IconButton';

import { BadgeAchieveWrapper } from '../styles/BadgeAchieveWrapper';
import { AwardPlannerIcon, AwardRunnerIcon, AwardSleepIcon, DownloadIcon } from '~/icons';

export const BadgeAchieveArea = () => {
  return (
    <BadgeAchieveWrapper>
      <Box className="award__title">
        <h3>
          Badges achieved
          <span>3</span>
        </h3>
        <IconButton>
          <DownloadIcon />
        </IconButton>
      </Box>
      <ul className="award__list">
        <li>
          <AwardPlannerIcon />
          <p>Best runner of the week</p>
        </li>
        <li>
          <AwardRunnerIcon />
          <p>Best diet planer of the day</p>
        </li>
        <li>
          <AwardSleepIcon />
          <p>Sleep challenge winner of april</p>
        </li>
      </ul>
    </BadgeAchieveWrapper>
  );
};
