import React from 'react';
import { SCREEN_SECTION } from '@newstart-online/sdk';

import Account from './Account';
import Profile from './Profile';
import { NoPermission } from '../learn/No-Permission';
import GoogleAnalytics from '~/common-ui/GoogleAnalytics/GoogleAnalytics';
import { FIREBASE_EVENTS_ENUM } from '~/config/firebase.config';

type Props = {
  type: string | undefined;
  id: string | undefined;
  hasPermission: boolean | undefined | null;
};

export const MoreComponent: React.FC<Props> = ({ type, id, hasPermission }) => {
  if (!hasPermission) {
    return <NoPermission />;
  }

  switch (type) {
    case SCREEN_SECTION.MORE_ACCOUNT:
      return (
        <GoogleAnalytics firebaseEvent={FIREBASE_EVENTS_ENUM.ACCOUNT}>
          <Account />
        </GoogleAnalytics>
      );
    case SCREEN_SECTION.MORE_PROFILE:
      return (
        <GoogleAnalytics firebaseEvent={FIREBASE_EVENTS_ENUM.PROFILE}>
          <Profile />;
        </GoogleAnalytics>
      );
    default:
      return <></>;
  }
};
