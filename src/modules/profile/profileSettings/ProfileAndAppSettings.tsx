import React from 'react';
import { Box } from '@mui/system';
import { Switch } from '@mui/material';
import { Container, Paper, Typography } from '@mui/material';

import { ChevronBlueRight, FeedbackIcon, HeartIcon, InfoIcon, ShareIcon } from '~/icons';
import { ProfileAndSettingsWrapper } from '../styles/ProfileAndSettingsWrapper';

export const ProfileAndAppSettings = () => {
  const label = { inputProps: { 'aria-label': 'Switch' } };

  return (
    <ProfileAndSettingsWrapper>
      <Container maxWidth="sm">
        <Box>
          <div>
            <Paper
              elevation={0}
              sx={{
                borderRadius: '12px',
                border: '1px solid #e0e0e0',
                width: '550px',
                padding: '24px',
              }}
            >
              <Typography variant="h5" sx={{ mb: 4 }}>
                Profile and App Settings
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 3 }}>
                Account newstart@gmail.com
              </Typography>
              <div className="link_wrapper_subscription">
                <button>Subscription</button>
                <ChevronBlueRight />
              </div>
              <Typography variant="subtitle1" sx={{ py: 3 }}>
                Data collection
              </Typography>
              <div className="switch-wrapper">
                <Typography variant="body1">Blood sugar</Typography>
                <Switch {...label} defaultChecked />
              </div>
              <div className="switch-wrapper">
                <Typography variant="body1">Blood Presuure</Typography>
                <Switch {...label} defaultChecked />
              </div>
              <div className="switch-wrapper">
                <Typography variant="body1">Water Intake</Typography>
                <Switch {...label} />
              </div>
              <div className="switch-wrapper">
                <Typography variant="body1">Sunlight</Typography>
                <Switch {...label} defaultChecked />
              </div>
              <div className="switch-wrapper">
                <Typography variant="body1">Nutrition</Typography>
                <Switch {...label} defaultChecked />
              </div>
              <div className="switch-wrapper">
                <Typography variant="body1">Rest</Typography>
                <Switch {...label} defaultChecked />
              </div>
              <div className="switch-wrapper">
                <Typography variant="body1">Temperance</Typography>
                <Switch {...label} defaultChecked />
              </div>
              <Typography variant="subtitle1" sx={{ pb: 1.2 }}>
                Units
              </Typography>
              <div className="units">
                <button className="unit_selected">Imperial</button>
                <button>Metric</button>
              </div>
              <div className="about_the_app_wrapper">
                <div className="about_the_app link_wrapper_about_the_app">
                  <Box sx={{ display: 'flex' }}>
                    <InfoIcon />
                    <Typography variant="subtitle1" sx={{ pl: 2 }}>
                      About the App
                    </Typography>
                  </Box>
                  <ChevronBlueRight />
                </div>
                <div className="about_the_app link_wrapper_about_the_app">
                  <Box sx={{ display: 'flex' }}>
                    <HeartIcon />
                    <Typography variant="subtitle1" sx={{ pl: 2 }}>
                      Donate
                    </Typography>
                  </Box>
                  <ChevronBlueRight />
                </div>
                <div className="about_the_app link_wrapper_about_the_app">
                  <Box sx={{ display: 'flex' }}>
                    <FeedbackIcon />
                    <Typography variant="subtitle1" sx={{ pl: 2 }}>
                      FeedBack
                    </Typography>
                  </Box>
                  <ChevronBlueRight />
                </div>
                <div className="about_the_app link_wrapper_about_the_app">
                  <Box sx={{ display: 'flex' }}>
                    <ShareIcon />
                    <Typography variant="subtitle1" sx={{ pl: 2 }}>
                      Share
                    </Typography>
                  </Box>
                  <ChevronBlueRight />
                </div>
              </div>
              <div className="delete_link_wrapper">
                <button>Delete Account</button>
              </div>
            </Paper>
          </div>
        </Box>
      </Container>
    </ProfileAndSettingsWrapper>
  );
};
