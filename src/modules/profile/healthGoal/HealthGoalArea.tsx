import React from 'react';
import { Box } from '@mui/system';
import { IconButton } from '@mui/material';

import { DownloadIcon } from '~/icons';
import { HealthGoalWrapper } from '../styles/HealthGoalWrapper';

export const HealthGoalArea = () => {
  return (
    <HealthGoalWrapper>
      <Box className="goal__title">
        <h3>Health goals</h3>
        <IconButton>
          <DownloadIcon />
        </IconButton>
      </Box>
      <Box className="goal__list">
        <ul>
          <li>
            <Box>
              <p>Physical activity</p>
              <h3 className="text--green">72%</h3>
            </Box>
          </li>
          <li>
            <Box>
              <p>Lose weight</p>
              <h3 className="text--orange">22%</h3>
            </Box>
          </li>
          <li>
            <Box>
              <p>Be free of alcohol</p>
              <h3 className="text--blue">80%</h3>
            </Box>
          </li>
          <li>
            <Box>
              <p>Plant based foods</p>
              <h3 className="color--green">50%</h3>
            </Box>
          </li>
        </ul>
      </Box>
    </HealthGoalWrapper>
  );
};
