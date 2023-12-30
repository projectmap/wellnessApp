import React, { FC, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { logEvent } from 'firebase/analytics';
import { getAnalytics } from 'firebase/analytics';

import 'firebase/analytics';

import { firebaseConfig, FIREBASE_EVENTS_ENUM } from '~/config/firebase.config';

interface IGoogleAnalytics {
  firebaseEvent: FIREBASE_EVENTS_ENUM;
  children: React.ReactNode;
}
const GoogleAnalytics: FC<IGoogleAnalytics> = ({ children, firebaseEvent }) => {
  const app = initializeApp(firebaseConfig);
  useEffect(() => {
    if (app) {
      // Initialize Firebase
      //@ts-ignore
      const analytics = getAnalytics(app);
      //@ts-ignore

      logEvent(analytics, firebaseEvent);
    }
  }, [app]);

  return <>{children}</>;
};

export default GoogleAnalytics;
