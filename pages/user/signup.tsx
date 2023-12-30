import { FIREBASE_EVENTS_ENUM } from '~/config/firebase.config';
import { SignUpArea } from '~/modules/onboarding/signUp/SignUpArea';
import GoogleAnalytics from '~/common-ui/GoogleAnalytics/GoogleAnalytics';

export default function SignUp() {
  return (
    <GoogleAnalytics firebaseEvent={FIREBASE_EVENTS_ENUM.SIGN_UP}>
      <SignUpArea />
    </GoogleAnalytics>
  );
}
