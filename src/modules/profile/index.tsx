import React from 'react';
import { Box, Container } from '@mui/material';

import { HealthGoalArea } from './healthGoal/HealthGoalArea';
import { ProfileInfoArea } from './profileInfo/ProfileInfoArea';
import { ProfilePageWrapper } from './styles/ProfilePageWrapper';
import { BadgeAchieveArea } from './badgeAchieve/BadgeAchieveArea';
import { ProfileContactArea } from './profileContact/ProfileContactArea';
import { PolicyLinkArea } from '../_core/components/policyLink/PolicyLinkArea';
import { ProfileChallengeArea } from './profileChallenge/ProfileChallengeArea';
import { PeopleInCommunityArea } from '../_core/components/peopleInCommunity/PeopleInCommunityArea';

export const ProfilePageArea = () => {
  return (
    <ProfilePageWrapper>
      <Container maxWidth="xl">
        <Box className="home__wrapper">
          <Box className="home__left"></Box>
          <Box className="home__container">
            <Box className="post__list">
              <ProfileInfoArea />
              <ProfileContactArea />
              <BadgeAchieveArea />
              <HealthGoalArea />
              <ProfileChallengeArea />
            </Box>
          </Box>
          <Box className="home__right">
            <Box className="home__right--sticky">
              <PeopleInCommunityArea />
              <PolicyLinkArea />
            </Box>
          </Box>
        </Box>
      </Container>
    </ProfilePageWrapper>
  );
};
