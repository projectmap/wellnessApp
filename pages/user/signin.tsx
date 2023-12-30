import type { NextPage } from 'next';

import { FIREBASE_EVENTS_ENUM } from '~/config/firebase.config';
import GoogleAnalytics from '~/common-ui/GoogleAnalytics/GoogleAnalytics';

import { SingInArea } from '~/modules/onboarding/signIn/SingInArea';

const SingIn: NextPage = () => {
  return (
    <GoogleAnalytics firebaseEvent={FIREBASE_EVENTS_ENUM.LOG_IN}>
      <SingInArea />
    </GoogleAnalytics>
  );
};

export default SingIn;
