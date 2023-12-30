import React from 'react';
import { SCREEN_SECTION } from '@newstart-online/sdk';

import { Chat } from './Chat';
import { Friends } from './Friends';
import { CommunityFeed } from './CommunityFeed';
import { USER_LIST_TYPE } from '~/state/constants';
import { FIREBASE_EVENTS_ENUM } from '~/config/firebase.config';
import GoogleAnalytics from '~/common-ui/GoogleAnalytics/GoogleAnalytics';

type Props = {
  type: SCREEN_SECTION | undefined;
  id: string | undefined;
};

export const Community: React.FC<Props> = ({ type, id }) => {
  switch (type) {
    case SCREEN_SECTION.COMMUNITY_FEED:
      return (
        <GoogleAnalytics firebaseEvent={FIREBASE_EVENTS_ENUM.COMMUNITY_FEEDS}>
          <CommunityFeed />;
        </GoogleAnalytics>
      );
    case SCREEN_SECTION.COMMUNITY_FRIENDS:
      return (
        <GoogleAnalytics firebaseEvent={FIREBASE_EVENTS_ENUM.COMMUNITY_FRIENDS}>
          <Friends type={id ?? USER_LIST_TYPE.FRIENDS} />
        </GoogleAnalytics>
      );
    case SCREEN_SECTION.COMMUNITY_CHAT:
      return (
        <GoogleAnalytics firebaseEvent={FIREBASE_EVENTS_ENUM.COMMUNITY_CHATS}>
          <Chat />;
        </GoogleAnalytics>
      );
    // case SCREEN_SECTION.COMMUNITY_CHALLENGE:
    //   return <Challenge />;
    default:
      return <CommunityFeed />;
  }
};
