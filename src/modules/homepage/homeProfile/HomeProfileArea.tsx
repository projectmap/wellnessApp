import React from 'react';

import { useAppSelector } from '~/state/app/hooks';
import OnBoardingModal from '~/modules/homepage/OnboardingModal';
import PaymentAndBillingModal from '~/modules/onboarding/modals/PaymentAndBillingModal';

export const HomeProfileArea = () => {
  // purpose of this component is to simple render onboarding modals and payment modals if users logs in for the first time
  const showPayment = useAppSelector((state) => state.onboarding.showPayment);
  const planType = useAppSelector((state) => state.onboarding.planType);

  return (
    <>
      {showPayment && <PaymentAndBillingModal planType={planType} />}

      <OnBoardingModal />
    </>
  );
};
