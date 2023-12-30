import React from 'react';
import { Box, useMediaQuery } from '@mui/material';

import { UserProfile } from '../community/UserProfile';
import { SendPrayers } from '../community/SendPrayers';
import { HomePageWrapper } from './styles/HomePageWrapper';
import { HomeProfileArea } from './homeProfile/HomeProfileArea';
import CommunityPostBox from '../community/components/CommunityPostBox';
import { PostEmptyArea } from '../_core/components/postEmpty/PostEmptyArea';
import { PolicyLinkArea } from '../_core/components/policyLink/PolicyLinkArea';
import RecentMessages from '../_core/components/peopleInCommunity/RecentMessages';
import NewStartContainer from '../_core/NewStartLayoutContainer/NewStartContainer';
import { MealPlanEmptyArea } from '../_core/components/mealEmpty/MealPlanEmptyArea';
import { HelpReportEmptyArea } from '../_core/components/helpReport/HelpReportEmptyArea';
import { FeaturedResourceArea } from '../_core/components/featureResource/FeaturedResourceArea';
import { CommunityFeedEmptyArea } from '../_core/components/communityEmpty/CommunityFeedEmptyArea';
import { PeopleInCommunityArea } from '../_core/components/peopleInCommunity/PeopleInCommunityArea';

export const HomePageArea = () => {
  const matchesSmallTB900 = useMediaQuery('(max-width:900px)');

  return (
    <HomePageWrapper>
      <NewStartContainer
        leftItem={
          <Box>
            <UserProfile userProfileShowStatus={true} showStats={false} />
            <RecentMessages />
          </Box>
        }
        midItem={
          <Box className="post__list">
            <CommunityPostBox />
            {matchesSmallTB900 && <UserProfile userProfileShowStatus={true} showStats={false} />}
            <PostEmptyArea />
            <CommunityFeedEmptyArea />
            <MealPlanEmptyArea />
            <FeaturedResourceArea />
            <HelpReportEmptyArea />
          </Box>
        }
        praySection={<SendPrayers />}
        rightItemSticky={
          <Box>
            <PeopleInCommunityArea />
          </Box>
        }
        footerSection={<PolicyLinkArea />}
      />
      {/* <HomeProfileArea /> */}
    </HomePageWrapper>
  );
};
