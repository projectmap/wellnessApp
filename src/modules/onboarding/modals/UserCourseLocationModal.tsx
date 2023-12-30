import React from 'react';

import { useCreateUserProfileMutation, useGetUserSubscriptionsQuery, USER_TYPE } from '@newstart-online/sdk';

import { useAppDispatch, useAppSelector } from '~/state/app/hooks';
import {
  setUserLocationType,
  setUserOnboardingLocation,
  setUserPayment,
  setUserPlan,
  setUserSubscriptionModal,
} from '~/state/services/onboarding/onboardingSlice';
import { USER_SUBSCRIPTION_TYPE } from '~/state/constants';
import { UserCourseLocation } from './UserCourseLocation';

export const UserCourseLocationModal = () => {
  const [userLocation] = useCreateUserProfileMutation();
  const dispatch = useAppDispatch();
  const userCourseLocation = useAppSelector((state) => state.onboarding.userCourseLocation);
  const locationType = useAppSelector((state) => state.onboarding.locationType);
  const { data: subscriptionData } = useGetUserSubscriptionsQuery();

  const updateUserLocation = () => {
    userLocation({
      userType: locationType,
    })
      .unwrap()
      .then(() => {
        dispatch(setUserOnboardingLocation(false));
        if (locationType === USER_TYPE.CEUCREDITS) {
          dispatch(setUserLocationType(USER_TYPE.CEUCREDITS));
        }
        if (locationType === USER_TYPE.ONLINE || locationType === USER_TYPE.ONPREMISES) {
          dispatch(setUserSubscriptionModal(true));
        } else {
          dispatch(setUserSubscriptionModal(false));
          dispatch(setUserPayment(true));
          dispatch(setUserPlan(USER_SUBSCRIPTION_TYPE.MONTHLY));
        }
      });
  };

  const handleClose = (event: any, reason: any) => {
    if (reason && reason === 'backdropClick') return;
    dispatch(setUserPayment(false));
  };

  return (
    <UserCourseLocation
      locationType={locationType}
      isOpen={userCourseLocation && subscriptionData?.data === null ? true : false}
      handleClose={handleClose}
      updateUserLocation={updateUserLocation}
      setUserLocationType={(data) => dispatch(setUserLocationType(data))}
    />
  );
};
