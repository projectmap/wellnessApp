import { toast } from 'react-toastify';
import { Container } from '@mui/system';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';

import { InvoiceStyles } from '~/modules/_core/styles/BillingAndAccountingStyles';
import { PAY_NOW_OPTIONS, USER_SUBSCRIPTION_TYPE } from '~/state/constants';
import {
  useCreateUserProfileMutation,
  useGetUserScheduleSubscriptionsQuery,
  useGetUserSubscriptionsQuery,
  USER_TYPE,
  useUpdateSubscriptionsMutation,
} from '@newstart-online/sdk';
import { useAppDispatch, useAppSelector } from '~/state/app/hooks';
import AddCardModal from '~/modules/onboarding/modals/AddCardModal';
import { SubscriptionModal } from '~/modules/onboarding/modals/SubscriptionModal';
import { setUserSubscriptionModal } from '~/state/services/onboarding/onboardingSlice';
import { UserCourseLocation } from '~/modules/onboarding/modals/UserCourseLocation';
import PaymentMethodModal from '../../components/billingAndAccounting/PaymentMethodModal';
interface IUpgradeSubscriptions {
  showUserLocationModal: boolean;
  setShowUserLocationModal: (data: boolean) => void;
}
const UpgradeSubscriptions = (props: IUpgradeSubscriptions) => {
  const { showUserLocationModal, setShowUserLocationModal } = props;
  const [selectedUserLocations, setSelectedUserLocations] = React.useState(USER_TYPE.ONLINE);

  const { data } = useGetUserSubscriptionsQuery();
  const { data: scheduleSubscription } = useGetUserScheduleSubscriptionsQuery();

  const [subscribeNow] = useUpdateSubscriptionsMutation();
  const [userLocation] = useCreateUserProfileMutation();

  // TODO: add types later
  const subscriptionData = data as any;
  const planType = useAppSelector((state) => state.onboarding.planType);
  const planTypeAsProps = planType === USER_SUBSCRIPTION_TYPE.FREE_TRIAL ? USER_SUBSCRIPTION_TYPE.FREE_USER : '';

  const [showPaymentMethodChangeModal, setShowPaymentMethodChangeModal] = React.useState(false);

  // this will return array of not started subscription schedule
  const upcomingSubscriptionSchedule = scheduleSubscription?.data?.data?.filter(
    (item: any) => item?.status === 'not_started',
  );

  const timeSec = new Date(1970, 0, 1); // Epoch

  // const addCardPayment = useAppSelector((state) => state.onboarding.showPayment);
  const dispatch = useAppDispatch();

  const handleCloseUserLocationsModal = () => {
    setShowUserLocationModal(false);
  };

  const updateUserLocation = () => {
    if (selectedUserLocations === USER_TYPE.CEUCREDITS) {
      setShowPaymentMethodChangeModal(true);
    } else {
      dispatch(setUserSubscriptionModal(true));
    }
  };

  const onHandlePlanCardSelect = (data: boolean) => {
    const isUserChangingPlanToFreeUser =
      planType === USER_SUBSCRIPTION_TYPE.FREE_TRIAL || planType === USER_SUBSCRIPTION_TYPE.FREE_USER;
    if (
      (subscriptionData?.data?.cancel_at_period_end || !subscriptionData?.data?.plan) &&
      isUserChangingPlanToFreeUser &&
      upcomingSubscriptionSchedule?.length === 0
    ) {
      handleCloseUserLocationsModal();
      toast.success('You are already on free plan.');

      return;
    }

    if (isUserChangingPlanToFreeUser) {
      subscribeNow({
        freeType: true,
        priceId: '',
        isPriceIdCeuCredits: false,
      })
        .unwrap()
        .then((item) => {
          userLocation({ userType: selectedUserLocations });
          toast.success('You have successfully changed your plan to free user.');
        });

      return;
    }

    setShowPaymentMethodChangeModal(data);
  };

  return (
    <Container maxWidth="xl" sx={InvoiceStyles.invoicePageWrapper}>
      <UserCourseLocation
        locationType={selectedUserLocations}
        isOpen={showUserLocationModal}
        handleClose={handleCloseUserLocationsModal}
        updateUserLocation={updateUserLocation}
        setUserLocationType={(data) => setSelectedUserLocations(data)}
        showCrossIcon={true}
      />

      <SubscriptionModal
        planTypeAsProps={planTypeAsProps}
        showFreeUserOption={true}
        isBillingSectionCard={true}
        isChangeSubscription={subscriptionData?.data ? true : false}
        setShowBillingSectionCard={onHandlePlanCardSelect}
      />
      <AddCardModal />
      <PaymentMethodModal
        selectedUserLocations={selectedUserLocations}
        payNowOptions={PAY_NOW_OPTIONS.SUBSCRIBE_PAYMENT}
        showPaymentMethodChangeModal={showPaymentMethodChangeModal}
        setShowPaymentMethodChangeModal={setShowPaymentMethodChangeModal}
        setShowUserLocationModal={setShowUserLocationModal}
      />
    </Container>
  );
};

export default UpgradeSubscriptions;
