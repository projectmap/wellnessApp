import React from 'react';
import GoogleAnalytics from '~/common-ui/GoogleAnalytics/GoogleAnalytics';
import { FIREBASE_EVENTS_ENUM } from '~/config/firebase.config';
import Profile from '~/modules/me/Profile';

const MePage = () => {
  return (
    <GoogleAnalytics firebaseEvent={FIREBASE_EVENTS_ENUM.ME_PAGE}>
      <Profile />
    </GoogleAnalytics>
  );
};

export default MePage;
