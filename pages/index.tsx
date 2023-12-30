import type { NextPage } from 'next';
import GoogleAnalytics from '~/common-ui/GoogleAnalytics/GoogleAnalytics';
import { FIREBASE_EVENTS_ENUM } from '~/config/firebase.config';
import { HomePageArea } from '~/modules/homepage';
import { LayoutArea } from '~/modules/_core/layout/LayoutArea';

const Home: NextPage = () => {
  return (
    <GoogleAnalytics firebaseEvent={FIREBASE_EVENTS_ENUM.HOME}>
      <LayoutArea>
        <HomePageArea />
      </LayoutArea>
    </GoogleAnalytics>
  );
};

export default Home;
