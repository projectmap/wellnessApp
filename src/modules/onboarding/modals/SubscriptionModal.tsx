import React from 'react';
import Image from 'next/image';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';

import { useGetUser } from '~/utils/useGetUser';
import { useAppDispatch, useAppSelector } from '~/state/app/hooks';
import { PrimaryButton } from '~/modules/_core/bits/buttons/PrimaryButton';
import { USER_SUBSCRIPTION_DURATION, USER_SUBSCRIPTION_TYPE } from '~/state/constants';
import { CloseBlue, RadioSubscriptionChecked, RadioSubscriptionUnChecked } from '~/icons';
import {
  setUserPlan,
  setUserPayment,
  setUserSubscriptionModal,
  setUserOnboardingLocation,
} from '~/state/services/onboarding/onboardingSlice';
import { GenericOnboardingSectionModal } from '~/modules/onboarding/modals/GenericOnboardingSectionModal';
import { useGetUserSubscriptionsQuery } from '@newstart-online/sdk';

interface ISubscriptionModal {
  isBillingSectionCard?: boolean;
  setShowBillingSectionCard?: (status: boolean) => void;
  showFreeUserOption?: boolean;
  planTypeAsProps?: string;
  isChangeSubscription?: boolean;
}
export const SubscriptionModal = ({
  isBillingSectionCard = false,
  setShowBillingSectionCard = () => {},
  showFreeUserOption = false,
  planTypeAsProps,
  isChangeSubscription = false,
}: ISubscriptionModal) => {
  const user = useGetUser();

  const userPlanType = useAppSelector((state) => state.onboarding.planType);
  const planType = planTypeAsProps ? USER_SUBSCRIPTION_TYPE.FREE_USER : userPlanType;
  const subscriptionModal = useAppSelector((state) => state.onboarding.subscriptionModal);
  const dispatch = useAppDispatch();

  const subscriptionData = [
    {
      subscriptionType: showFreeUserOption ? USER_SUBSCRIPTION_TYPE.FREE_USER : USER_SUBSCRIPTION_TYPE.FREE_TRIAL,
      id: 1,

      subscriptionDuration: showFreeUserOption
        ? USER_SUBSCRIPTION_DURATION.FREE_USER
        : USER_SUBSCRIPTION_DURATION.FREE_TRIAL,
      subDescription: `Welcome to your FREE 7-day trial (Session 1 only). Enjoy`,
    },
    {
      subscriptionType: USER_SUBSCRIPTION_TYPE.ANNUAL,
      id: 2,

      subscriptionDuration: USER_SUBSCRIPTION_DURATION.ANNUAL,
      subDescription:
        'NEWSTART Full Access - Enjoy 12 months of tips, recipes, and motivation for your NEWSTART journey',
      type: 'year',
    },
    {
      subscriptionType: USER_SUBSCRIPTION_TYPE.MONTHLY,
      id: 3,

      subscriptionDuration: USER_SUBSCRIPTION_DURATION.MONTHLY,
      subDescription:
        'NEWSTART Full Access - Enjoy a monthof videos, recipes, and community. You’ll be off to a great NEWSTART',
      type: 'month',
    },
  ];

  const handleUserLocation = () => {
    dispatch(setUserSubscriptionModal(false));
    if (isBillingSectionCard) {
      setShowBillingSectionCard(true);
    } else {
      dispatch(setUserPayment(true));
    }
  };

  const handleClose = (event: any, reason: any) => {
    if (reason && reason === 'backdropClick') return;
    dispatch(setUserPayment(false));
  };

  const handleBack = () => {
    if (isChangeSubscription) {
      dispatch(setUserPayment(false));
    } else {
      dispatch(setUserOnboardingLocation(true));
    }
    dispatch(setUserSubscriptionModal(false));
  };

  return (
    <GenericOnboardingSectionModal
      isOpen={subscriptionModal}
      onCloseModal={handleClose}
      showCloseButton={false}
      sx={{ width: { lg: '1020px', sm: '700px' } }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          pl: { lg: '50px', sm: '0px' },
        }}
      >
        {isChangeSubscription && (
          <Box sx={{ position: 'absolute', top: '-36px', right: '-16px' }}>
            <CloseBlue className="cursor-pointer" onClick={handleBack} />
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image src="/assets/images/OnboardingSubscriptionElements.svg" alt="onboarding" width={240} height={260} />
          <Typography variant="h5" sx={{ textAlign: 'start', pt: 3, pb: 0.5 }}>
            {!isChangeSubscription && (
              <>
                Welcome to NEWSTART, <p style={{ textTransform: 'capitalize', display: 'inline' }}>{user?.name}</p>
              </>
            )}
            {isChangeSubscription && 'Change Your Plan'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#5A5A72', textAlign: 'center' }}>
            {isChangeSubscription
              ? 'Allow our experienced team to guide you on your journey to optimal health'
              : 'You + Our experienced team = Your optimal health journey'}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 'fit-content',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {subscriptionData?.map((subcriptionItem) => {
            return (
              <Box
                sx={{
                  width: { lg: '420px', sm: '380px' },
                  mb: 3,
                  border: subcriptionItem.subscriptionType === planType ? '1px solid #0C72E0' : '1px solid #B8B8C3',
                  height: '102px',
                  padding: 2,
                  borderRadius: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
                key={subcriptionItem?.id}
                onClick={() => dispatch(setUserPlan(subcriptionItem.subscriptionType))}
              >
                <Box>
                  {planType === subcriptionItem?.subscriptionType ? (
                    <RadioSubscriptionChecked className="cursor-pointer" />
                  ) : (
                    <RadioSubscriptionUnChecked className="cursor-pointer" />
                  )}
                </Box>
                <Box sx={{ pl: '10px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1">{subcriptionItem.subscriptionType}</Typography>
                    <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
                      {subcriptionItem.subscriptionDuration}
                    </Typography>
                  </Box>

                  <Typography variant="body2" sx={{ color: '#5A5A72' }}>
                    {subcriptionItem.subDescription}
                  </Typography>
                </Box>
              </Box>
            );
          })}
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            {!isChangeSubscription && (
              <PrimaryButton
                sx={{
                  backgroundColor: 'transparent',
                  color: '#147AE9',
                  fontSize: '16px',
                  px: '24px',
                  py: '10.5px',
                  marginRight: '24px',
                  cursor: 'pointer',
                  border: '1px solid #147AE9',
                  borderRadius: '32px',
                  '&:hover': {
                    color: '#FFF',
                  },
                }}
                onClick={handleBack}
              >
                Back
              </PrimaryButton>
            )}
            <PrimaryButton sx={{ borderRadius: '44px', px: '24px', py: '10.5px' }} onClick={handleUserLocation}>
              {isChangeSubscription ? 'Change Plan' : 'Continue'}
            </PrimaryButton>
          </Box>
        </Box>
      </Box>
    </GenericOnboardingSectionModal>
  );
};
