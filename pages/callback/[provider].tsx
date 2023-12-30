import { useEffect } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import {
  IToken,
  SOCIAL_PROVIDER,
  storeTokens,
  useAppDispatch,
  useSocialLoginVerifyMutation,
} from '@newstart-online/sdk';

import { toast } from 'react-toastify';
import { ROUTE } from '~/config/routes';
import { setTokens } from '~/utils/authStore';
import { LoaderArea } from '~/modules/_core/components/loaderPage/LoaderArea';

const AuthCallback: NextPage = () => {
  const router = useRouter();

  const code = router.query.code as string;

  const [verifySocialCode] = useSocialLoginVerifyMutation();

  const dispatch = useAppDispatch();

  useEffect(() => {
    // Fetch token using code
    // with try catch if error redirect to login page
    const provider = router.query.provider as SOCIAL_PROVIDER;

    async function fetchToken() {
      await verifySocialCode({
        provider,
        code,
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
          toast.error(err.data.message);
          router.push(ROUTE.SIGN_IN);
        });
    }

    if (provider === 'apple') {
      if (router.query.accessToken && router.query.refreshToken) {
        const tokens = {
          refreshToken: router.query.refreshToken as string,
          accessToken: router.query.accessToken as string,
        };
        setTokens(tokens);
        dispatch(storeTokens(tokens));
        router.push(ROUTE.HOME);

        return;
      }

      if (router.query.error === 'true') {
        toast.error('Error with Apple SignIn ');
        router.push(ROUTE.SIGN_IN);
      }
    }

    if (code) {
      fetchToken();
    }
  }, [router]);

  return <LoaderArea />;
};

export default AuthCallback;
