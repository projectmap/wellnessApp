import React from 'react';
import { Box } from '@mui/system';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import AppleSignin from 'react-apple-signin-auth';

import { ROUTE } from '~/config/routes';
import { launchURI } from '~/utils/helpers';
import { setTokens } from '~/utils/authStore';
import { AppleIcon, GoogleIcon } from '~/icons';
import {
  IToken,
  SOCIAL_PROVIDER,
  storeTokens,
  useAppDispatch,
  useLazySocialLoginQuery,
  useSocialLoginVerifyMutation,
} from '@newstart-online/sdk';
import { IAppleResponse } from '~/type/recordCategory';
import LoginWithGoogleIcon from '~/icons/LoginWithGoogle';
import SignInWithAppleIcon from '~/icons/SignInWithAppleIcon';
export const SocialOnboardingLinks = () => {
  const [signUpSocial] = useLazySocialLoginQuery();
  const [verifySocialCode] = useSocialLoginVerifyMutation();

  const router = useRouter();

  const dispatch = useAppDispatch();

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }} component="div">
        <a
          onClick={() =>
            signUpSocial({
              provider: SOCIAL_PROVIDER.GOOGLE,
              launchURI,
            })
              .unwrap()
              .catch((data) => toast.error(data?.error?.message))
          }
        >
          <LoginWithGoogleIcon />
        </a>
        <Box component="div" sx={{ ml: 2 }}>
          <AppleSignin
            /** Auth options passed to AppleID.auth.init() */
            authOptions={{
              /** Client ID - eg: 'com.example.com' */
              clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID,
              /** Requested scopes, seperated by spaces - eg: 'email name' */
              scope: 'email name',
              /** Apple's redirectURI - must be one of the URIs you added to the serviceID*/
              redirectURI: process.env.NEXT_PUBLIC_APPLE_REDIRECT_URL,
              /** State string that is returned with the apple response */
              state: 'state',
              /** Nonce */
              nonce: 'nonce',
              /** Uses popup auth instead of redirection */
              usePopup: true,
            }} // REQUIRED
            /** General props */
            uiType="dark"
            /** className */
            className="apple-auth-btn"
            /** Removes default style tag */
            noDefaultStyle={false}
            /** Allows to change the button's children, eg: for changing the button text */
            buttonExtraChildren="Continue with Apple"
            /** Extra controlling props */
            /** Called upon signin success in case authOptions.usePopup = true -- which means auth is handled client side */
            onSuccess={(response: IAppleResponse) => {
              verifySocialCode({
                provider: SOCIAL_PROVIDER.APPLE,
                idToken: response.authorization.id_token,
                user: response.user,
              })
                .unwrap()
                .then((res: IToken) => {
                  if (res) {
                    const tokens = res as IToken;
                    setTokens(tokens);
                    dispatch(storeTokens(tokens));
                  }
                  router.push(ROUTE.HOME);
                })
                .catch((err) => {
                  toast.error(err?.data?.message);
                  router.push(ROUTE.SIGN_IN);
                });
            }}
            /** Called upon signin error */
            onError={(error: any) => toast.error(error)} // default = undefined
            /** Skips loading the apple script if true */
            skipScript={false} // default = undefined
            /** Apple image props */
            iconProp={{ style: { marginTop: '10px' } }} // default = undefined
            /** render function - called with all props - can be used to fully customize the UI by rendering your own component  */
            render={(props: any) => (
              <a className=" cursor-pointer">
                <SignInWithAppleIcon {...props} />
              </a>
            )}
          />
        </Box>
      </Box>
    </>
  );
};
