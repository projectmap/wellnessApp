import React from 'react';
import { SCREEN_SECTION } from '@newstart-online/sdk';

import Diet from '~/modules/learn/diet';
import Today from '~/modules/learn/today';
import Course from '~/modules/learn/course';
import { NoPermission } from './No-Permission';
import Resources from '~/modules/learn/resources';
import { FIREBASE_EVENTS_ENUM } from '~/config/firebase.config';
import GoogleAnalytics from '~/common-ui/GoogleAnalytics/GoogleAnalytics';
import SessionProgramListings from '~/modules/learn/course/SessionProgramListings';

type Props = {
  type: string | undefined;
  id: string | undefined;
  hasPermission: boolean | undefined | null;
};

export const Learn: React.FC<Props> = ({ type, id, hasPermission }) => {
  if (!hasPermission) {
    return <NoPermission />;
  }

  switch (type) {
    case SCREEN_SECTION.LEARN_DIET:
      return (
        <GoogleAnalytics firebaseEvent={FIREBASE_EVENTS_ENUM.LEARN_MEAL_PLANNER}>
          <Diet />
        </GoogleAnalytics>
      );
    case SCREEN_SECTION.LEARN_TODAY:
      return (
        <GoogleAnalytics firebaseEvent={FIREBASE_EVENTS_ENUM.LEARN_RESOURCES}>
          <Resources />
        </GoogleAnalytics>
      );
    case SCREEN_SECTION.LEARN_COURSE:
      return id ? (
        <GoogleAnalytics firebaseEvent={FIREBASE_EVENTS_ENUM.LEARN_COURSE}>
          <Course courseId={id} />
        </GoogleAnalytics>
      ) : (
        <SessionProgramListings />
      );
    case SCREEN_SECTION.LEARN_RESOURCES:
      return (
        <GoogleAnalytics firebaseEvent={FIREBASE_EVENTS_ENUM.LEARN_TODAY}>
          <Today />
        </GoogleAnalytics>
      );

    default:
      return <Today />;
  }
};
