import React from 'react';
import { useRouter } from 'next/router';

import {
  useGetUserSubscriptionsQuery,
  useLazyCheckIfRefreshTokenExpiredQuery,
  useGetProfileQuery,
  ENUM_ROLE_ACCESS_FOR,
  useAppSelector as useSdkAppSelector,
  clearTokens,
} from '@newstart-online/sdk';
import { ROUTE } from '~/config/routes';
import { isPublicPath } from '~/utils/pathChecker';
import { USER_ONBOARDING_STEPS, PUBLIC_URLS_FOR_REDIRECT } from '~/state/constants';
import { clearAllTokens, getTokens } from '~/utils/authStore';
import { useAppDispatch, useAppSelector } from '~/state/app/hooks';
import { LoaderArea } from '~/modules/_core/components/loaderPage/LoaderArea';
import { setUserOnboardingLocation } from '~/state/services/onboarding/onboardingSlice';

interface IProps {
  children: React.ReactNode;
}
export const AuthWrapper: React.FC<IProps> = ({ children }) => {
  const router = useRouter();
  const tokensInSdk = useSdkAppSelector((state) => state.config.token);

  const { data: subscriptionData } = useGetUserSubscriptionsQuery();
  const stripePaymentData = subscriptionData?.data?.plan?.active;
  const { data: userData, isError: userFetchingUser, error } = useGetProfileQuery();
  const userRole = userData?.data?.role?.accessFor;
  const isUserFirstTimeLogin = userData?.data?.isFirstLogin as boolean;
  const [loading, setLoading] = React.useState<boolean>(true);
  const dispatch = useAppDispatch();
  const [checkIfRefreshTokenIsExpired] = useLazyCheckIfRefreshTokenExpiredQuery();
  const tokens = getTokens();
  const isUserSubscribed = useAppSelector((state) => state.onboarding.isUserSubscribed);
  const subscriptionModal = useAppSelector((state) => state.onboarding.subscriptionModal);
  const isGlobalLoading = useAppSelector((state) => state.globalLoader.isLoading);

  const showPayment = useAppSelector((state) => state.onboarding.showPayment);
  const activeStep = useAppSelector((state) => state.onboarding.activeStep);

  const handleLogout = async () => {
    try {
      clearAllTokens();
      dispatch(clearTokens());
      router.push(ROUTE.SIGN_IN);
    } catch (e) {
      console.error('[MePage] ', e);
    }
  };

  React.useEffect(() => {
    if (userData) {
      if (!userData?.data?.isActive) {
        handleLogout();
      }
    }
  }, [userData]);

  React.useEffect(() => {
    if (error && !PUBLIC_URLS_FOR_REDIRECT.includes(router.asPath)) {
      handleLogout();
    }
  }, [error]);

  React.useEffect(() => {
    if (tokens.refreshToken) {
      if (error) {
        handleLogout();
      }
      checkIfRefreshTokenIsExpired()
        .unwrap()
        .then()
        .catch((err) => {
          if (err.status === 401) {
            router.push(ROUTE.SIGN_IN);
            clearAllTokens();
          }
        });
    }
  }, []);

  React.useEffect(() => {
    const token = getTokens();
    // Don't redirect to login page if token is present in storage, route is public or callback url for google and apple
    if (!token.accessToken && !isPublicPath(router.pathname) && !router.pathname.includes(ROUTE.CALLBACK)) {
      router.push(ROUTE.SIGN_IN);
    }
    setLoading(() => false);
  }, [router.asPath]);

  React.useEffect(() => {
    // right now i am checking these three conditions
    // 1. isUserFirstTimeLogin from db
    // 2. subscriptionModal is open or not
    // 3. showPayment is open or not
    // 4. we should check for active step in multiform modal
    // if any of these are true then we return nothing
    // debugger;
    const token = getTokens();
    if (token.accessToken) {
      if (
        isUserFirstTimeLogin ||
        subscriptionModal ||
        showPayment ||
        activeStep === USER_ONBOARDING_STEPS.USER_AVATAR ||
        activeStep === USER_ONBOARDING_STEPS.HEALTH_INFO
      ) {
        return;

        // check for subscriptionData which checks for data in stripe for the user id if they have subscribed to any plan
        // check for userRole is free user cuz we by default we have free user as default user role
      } else {
        if (subscriptionData?.data === null && userRole === ENUM_ROLE_ACCESS_FOR.FREE_USER) {
          dispatch(setUserOnboardingLocation(true));
        }
      }
    }
  }, [
    stripePaymentData,
    userRole,
    isUserFirstTimeLogin,
    subscriptionModal,
    showPayment,
    subscriptionData?.data,
    activeStep,
    dispatch,
  ]);

  if (loading) {
    return <LoaderArea isOverlay />;
  }

  return <>{children}</>;
};
