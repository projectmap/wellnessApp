import { toast } from 'react-toastify';
import BillingTable from './BillingTable';
import { Typography, useMediaQuery } from '@mui/material';
import { Box, Container } from '@mui/system';
import 'react-toastify/dist/ReactToastify.css';
import React, { ReactComponentElement, useEffect, useState } from 'react';

import { AmexIcon, MasterCardIcon, OtherCardIcon, VisaIcon } from '~/icons';
import { PrimaryButton } from '~/modules/_core/bits/buttons/PrimaryButton';
import {
  billingPage,
  dynamicBillingStylesForBillPageContainer,
  dynamicBillingStylesForPaymentInfoContainer,
  dynamicBillingStylesForPlanDetails,
  InvoiceStyles,
} from '~/modules/_core/styles/BillingAndAccountingStyles';
import { CONFIRMATION_MODAL_INFO, PAYMENT_CARD_BRANDS } from '~/state/constants';
import {
  useCancelSubscriptionsMutation,
  useDeleteAPaymentCardMutation,
  useGetCurrentUserProfileDetailsQuery,
  useGetProfileQuery,
  useGetUserAllPaymentCardQuery,
  useGetUserInvoicesQuery,
  useGetUserScheduleSubscriptionsQuery,
  useGetUserSubscriptionsQuery,
  USER_TYPE,
  useSetDefaultPaymentCardMutation,
} from '@newstart-online/sdk';
import { PolicyLinkArea } from '../policyLink/PolicyLinkArea';
import { useAppDispatch, useAppSelector } from '~/state/app/hooks';
import ConfirmationModal from '../confirmationModals/ConfirmationModal';
import { setShowAddCardFormBox } from '~/state/services/onboarding/onboardingSlice';
import UpgradeSubscriptions from '../../bits/modals/UpgradeSubscriptions';

const BillingPageComponent = () => {
  const { data: userProfileData } = useGetProfileQuery();
  const [showUserLocationModal, setShowUserLocationModal] = React.useState(false);
  const { data: profileData } = useGetCurrentUserProfileDetailsQuery();

  const { data: paymentData, isFetching: isPaymentDataLoading } = useGetUserAllPaymentCardQuery();
  const { data: invoice } = useGetUserInvoicesQuery({ page: 1, perPage: 10 });
  const { data } = useGetUserSubscriptionsQuery();
  const { data: scheduleSubscription } = useGetUserScheduleSubscriptionsQuery();
  // TODO: add types later
  const subscriptionData = data as any;
  const [cancelSubsriptionStatus] = useCancelSubscriptionsMutation();
  const [deleteCard] = useDeleteAPaymentCardMutation();
  const [setAsDefault] = useSetDefaultPaymentCardMutation();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmModalTypeAndPayload, setConfirmModalTypeAndPayload] = useState({
    type: '',
    payload: '',
    message: '',
    messageInfo1: '',
    messageInfo2: '',
    title: '',
    buttonName: '',
  });

  const timeSec = new Date(1970, 0, 1); // Epoch
  const expiryDateSec = timeSec.setSeconds(subscriptionData?.data?.current_period_end || 0);
  const normalDate = new Date(expiryDateSec).toDateString();

  const CANCELLED_SUBSCRIPTION_INFO1 = `Your ${subscriptionData?.data?.plan?.interval}ly subscription has been cancelled and you will no longer be billed.
     
  `;
  const CANCELLED_SUBSCRIPTION_INFO2 = `You will continue to have access to your Premium features until the end of your current billing cycle on: ${
    expiryDateSec === timeSec.setSeconds(0) ? '' : normalDate
  }
  `;

  const handleCancelSubscription = () => {
    cancelSubsriptionStatus()
      .unwrap()
      .then((data) => {
        toast.success(data.message);
        setConfirmModalTypeAndPayload({
          type: CONFIRMATION_MODAL_INFO.SUBSCRIPTION_CANCELLED,
          payload: '',
          message: '',
          messageInfo1: CANCELLED_SUBSCRIPTION_INFO1,
          messageInfo2: CANCELLED_SUBSCRIPTION_INFO2,
          title: CONFIRMATION_MODAL_INFO.SUBSCRIPTION_CANCELLED_TITLE,
          buttonName: CONFIRMATION_MODAL_INFO.SUBSCRIPTION_CANCELLED_BUTTON,
        });
        setShowConfirmationModal(true);
      })
      .catch((error) => toast.error(error.data.message));
  };

  // const addCardPayment = useAppSelector((state) => state.onboarding.showPayment);
  const dispatch = useAppDispatch();

  const handleCloseModalForSubscriptionCancelledInfo = () => {
    setShowConfirmationModal(false);
  };

  const handleAddCard = () => {
    dispatch(setShowAddCardFormBox(true));
  };

  const handleSetDefaultCard = () => {
    setAsDefault(confirmModalTypeAndPayload.payload);
  };

  const handleDeleteCard = () => {
    deleteCard(confirmModalTypeAndPayload.payload);
  };

  const [paymentDataDefault, setPaymentDataDefault] = useState<any>();
  useEffect(() => {
    const defaultPayment = paymentData?.data?.find((itemData: any, idx: number) => itemData.isDefault);
    if (defaultPayment) {
      setPaymentDataDefault(defaultPayment);
    }
  }, [paymentData?.data]);

  const cardBrandIcon: { [key: string]: any } = {
    amex: <AmexIcon />,
    mastercard: <MasterCardIcon />,
    visa: <VisaIcon />,
    others: <OtherCardIcon />,
  };

  const isSubscriptionsStatusIsNotCanceled = subscriptionData?.data?.status !== 'canceled';

  const matchesScreen1270 = useMediaQuery('(max-width:1270px)');
  const matchesScreen1022 = useMediaQuery('(max-width:1022px)');
  const matchesScreen960 = useMediaQuery('(max-width:960px)');
  const dynamicStylesForBillPageContainer = {
    ...(matchesScreen1270 && { flexDirection: 'column' }),
  };

  const dynamicStylesForBillPlanDetails = {
    ...(matchesScreen1270 && { mb: '48px' }),
    ...(matchesScreen1022 && { width: '100%' }),
  };

  const dynamicStylesForPaymentInfoContainer = {
    ...(matchesScreen960 && { ml: 0 }),
  };
  // this will return array of not started subscription schedule
  const upcomingSubscriptionSchedule = scheduleSubscription?.data?.data?.filter(
    (item: any) => item?.status === 'not_started',
  );

  return (
    <Container maxWidth="xl" sx={InvoiceStyles.invoicePageWrapper}>
      <Box sx={dynamicBillingStylesForBillPageContainer(dynamicStylesForBillPageContainer)}>
        <Box sx={dynamicBillingStylesForPlanDetails(dynamicStylesForBillPlanDetails)}>
          <Box sx={billingPage.planDetailsTitleHolder}>
            <Typography variant="h6" sx={billingPage.planDetailsTitle}>
              Plan Details
            </Typography>
          </Box>

          <Box sx={billingPage.planInfoContainer}>
            <Box sx={billingPage.planInfoItem}>
              <Typography variant="subtitle2">Membership</Typography>
              <Typography variant="subtitle2" sx={{ color: 'primary.p120', width: '90px', textAlign: 'right' }}>
                {isSubscriptionsStatusIsNotCanceled ? subscriptionData?.data?.plan?.metadata?.title : ' Free User '}
              </Typography>
            </Box>
            <Box sx={billingPage.planInfoStatus}>
              <Typography variant="subtitle2">Status</Typography>
              <Typography variant="subtitle2" sx={{ color: 'primary.p120' }}>
                {subscriptionData?.data?.trial_end && subscriptionData?.data?.status === 'trialing'
                  ? 'Free Trial'
                  : subscriptionData?.data?.status === 'active' && isSubscriptionsStatusIsNotCanceled
                  ? 'Active'
                  : 'Not Active'}
              </Typography>
            </Box>
            <Box sx={billingPage.planInfoItem}>
              <Typography variant="subtitle2">CEU Credit</Typography>
              <Typography variant="subtitle2" sx={{ color: 'primary.p120', width: '90px', textAlign: 'right' }}>
                {profileData?.data?.hasAccessToCeuCredits ? 'Active' : ' Inactive '}
              </Typography>
            </Box>
            {subscriptionData?.data?.trial_end && subscriptionData?.data?.status === 'trialing' && (
              <Box sx={billingPage.planInfoStatus}>
                <Typography variant="subtitle2">Remaining Days</Typography>
                <Typography variant="subtitle2" sx={{ color: 'primary.p120' }}>
                  {Math.ceil((subscriptionData?.data?.trial_end - new Date().getTime() / 1000) / (24 * 60 * 60))}
                </Typography>
              </Box>
            )}
            {subscriptionData?.data?.plan?.interval && isSubscriptionsStatusIsNotCanceled && (
              <Box sx={billingPage.planInfoStatus}>
                <Typography variant="subtitle2">Type</Typography>
                <Typography variant="subtitle2" sx={{ color: 'primary.p120', textTransform: 'capitalize' }}>
                  {subscriptionData?.data?.plan?.interval && subscriptionData?.data?.plan?.interval + 'ly'}
                </Typography>
              </Box>
            )}
            {/* show next billing if subscription is not cancelled which is checked by if canceled_at_period_end is false
            and cancel_at is not null we need to check both of this because active subscription from schedule won't
            update cancel_at_period_end or there are upcoming shedule subscription */}
            {(!subscriptionData?.data?.cancel_at_period_end && subscriptionData?.data?.cancel_at === null) ||
            upcomingSubscriptionSchedule?.length > 0 ? (
              <Box sx={billingPage.planInfoStatusWithoutBorder}>
                <Typography variant="subtitle2">Next Billing</Typography>
                <Typography variant="subtitle2" sx={{ color: 'primary.p120' }}>
                  {normalDate}
                </Typography>
              </Box>
            ) : null}
          </Box>
          <UpgradeSubscriptions
            showUserLocationModal={showUserLocationModal}
            setShowUserLocationModal={setShowUserLocationModal}
          />

          {subscriptionData?.data &&
          (subscriptionData?.data?.cancel_at_period_end || subscriptionData?.data?.cancel_at) &&
          upcomingSubscriptionSchedule?.length === 0 ? (
            <PrimaryButton
              onClick={() => {
                const isRemainingDue = invoice?.data.find((item) => !item?.invoice?.paid);
                if (isRemainingDue) {
                  toast.error('You have to pay remaining due amount to subscribe our plan.');

                  return;
                }

                setShowUserLocationModal(true);
              }}
              sx={billingPage.changeSubscriptionButton}
            >
              Subscribe Now
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={() => setShowUserLocationModal(true)} sx={billingPage.changeSubscriptionButton}>
              Change Subscription
            </PrimaryButton>
          )}

          {(subscriptionData?.data &&
            !subscriptionData?.data?.cancel_at_period_end &&
            subscriptionData?.data?.cancel_at === null) ||
          (upcomingSubscriptionSchedule?.length > 0 && isSubscriptionsStatusIsNotCanceled) ? (
            <Typography
              onClick={() => {
                setConfirmModalTypeAndPayload({
                  type: CONFIRMATION_MODAL_INFO.CANCEL_SUBSCRIPTION,
                  payload: '',
                  message: CONFIRMATION_MODAL_INFO.CANCEL_SUBSCRIPTION_MESSAGE,
                  title: CONFIRMATION_MODAL_INFO.CANCEL_SUBSCRIPTION_TITLE,
                  buttonName: CONFIRMATION_MODAL_INFO.CANCEL_SUBSCRIPTION_BUTTON,
                  messageInfo1: '',
                  messageInfo2: '',
                });
                setShowConfirmationModal(true);
              }}
              variant="subtitle2"
              sx={billingPage.planCancelButton}
            >
              Cancel subscription
            </Typography>
          ) : null}

          {subscriptionData?.data &&
          (subscriptionData?.data?.cancel_at_period_end || subscriptionData?.data?.cancel_at) &&
          upcomingSubscriptionSchedule?.length === 0 ? (
            <Box sx={{ marginTop: '24px', textAlign: 'center' }}>
              {subscriptionData?.data?.plan && (
                <>
                  <Typography variant="subtitle2">Subscription cancelled. </Typography>
                  <Typography variant="subtitle2">Access until {normalDate}</Typography>
                </>
              )}
            </Box>
          ) : null}
        </Box>

        <Box sx={dynamicBillingStylesForPaymentInfoContainer(dynamicStylesForPaymentInfoContainer)}>
          <Box sx={billingPage.paymentTitleContainer}>
            <Typography variant="h6">Payment methods</Typography>
            <PrimaryButton sx={billingPage.paymentAddCard} onClick={handleAddCard}>
              Add Card
            </PrimaryButton>
          </Box>
          {paymentDataDefault && (
            <Box sx={billingPage.paymentDetailsContainer}>
              <Box sx={billingPage.paymentDetailsItem}>
                {PAYMENT_CARD_BRANDS?.includes(paymentDataDefault?.card?.brand)
                  ? cardBrandIcon[paymentDataDefault?.card?.brand]
                  : cardBrandIcon?.others}
                <Box sx={billingPage.cardAndName}>
                  <Typography variant="subtitle1">**** **** **** {paymentDataDefault?.card?.last4}</Typography>
                  <Typography variant="body2" sx={billingPage.paymentName}>
                    {userProfileData?.data?.name}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="subtitle2" sx={billingPage.defaultCardButton}>
                Default
              </Typography>
            </Box>
          )}
          {paymentData?.data?.map((itemData: any, idx: number) => {
            if (itemData?.isDefault) {
              return;
            }

            return (
              <Box sx={billingPage.paymentDetailsContainer} key={idx}>
                <Box sx={billingPage.paymentDetailsItem}>
                  {PAYMENT_CARD_BRANDS?.includes(itemData?.card?.brand)
                    ? cardBrandIcon[itemData?.card?.brand]
                    : cardBrandIcon?.others}
                  <Box sx={billingPage.cardAndName}>
                    <Typography variant="subtitle1">**** **** **** {itemData?.card?.last4}</Typography>
                    <Typography variant="body2" sx={billingPage.paymentName}>
                      {userProfileData?.data?.name}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={billingPage.paymentDetailsItem}>
                  <Typography
                    onClick={() => {
                      setConfirmModalTypeAndPayload({
                        type: CONFIRMATION_MODAL_INFO.SET_AS_DEFAULT,
                        payload: itemData?.id,
                        message: CONFIRMATION_MODAL_INFO.DEFAULT_MESSAGE,
                        title: CONFIRMATION_MODAL_INFO.DEFAULT_TITLE,
                        buttonName: CONFIRMATION_MODAL_INFO.SET_AS_DEFAULT_BUTTON,
                        messageInfo1: '',
                        messageInfo2: '',
                      });
                      setShowConfirmationModal(true);
                    }}
                    variant="subtitle2"
                    sx={billingPage.setDefaultButton}
                  >
                    Set as Default
                  </Typography>
                  <Typography
                    onClick={() => {
                      setConfirmModalTypeAndPayload({
                        type: CONFIRMATION_MODAL_INFO.DELETE,
                        payload: itemData?.id,
                        message: CONFIRMATION_MODAL_INFO.DELETE_MESSAGE,
                        title: CONFIRMATION_MODAL_INFO.DELETE_TITLE,
                        buttonName: CONFIRMATION_MODAL_INFO.DELETE_BUTTON,
                        messageInfo1: '',
                        messageInfo2: '',
                      });
                      setShowConfirmationModal(true);
                    }}
                    variant="subtitle2"
                    sx={billingPage.deteleButton}
                  >
                    Delete
                  </Typography>
                </Box>
              </Box>
            );
          })}

          <Box sx={billingPage.billingHistoryContainer}>
            <Typography variant="h6" sx={billingPage.billingHistory}>
              Billing History
            </Typography>
            <BillingTable />
          </Box>
        </Box>
      </Box>
      <ConfirmationModal
        title={confirmModalTypeAndPayload?.title}
        showModal={showConfirmationModal}
        setShowModal={setShowConfirmationModal}
        message={confirmModalTypeAndPayload?.message}
        messageInfo1={confirmModalTypeAndPayload?.messageInfo1}
        messageInfo2={confirmModalTypeAndPayload?.messageInfo2}
        buttonName={confirmModalTypeAndPayload.buttonName}
        cancelButtonName={confirmModalTypeAndPayload.type === CONFIRMATION_MODAL_INFO.CANCEL_SUBSCRIPTION ? 'No' : ''}
        hideCancelButton={
          confirmModalTypeAndPayload.type === CONFIRMATION_MODAL_INFO.SUBSCRIPTION_CANCELLED ? true : false
        }
        modalAction={
          confirmModalTypeAndPayload.type === CONFIRMATION_MODAL_INFO.DELETE
            ? handleDeleteCard
            : confirmModalTypeAndPayload.type === CONFIRMATION_MODAL_INFO.SET_AS_DEFAULT
            ? handleSetDefaultCard
            : confirmModalTypeAndPayload.type === CONFIRMATION_MODAL_INFO.SUBSCRIPTION_CANCELLED
            ? handleCloseModalForSubscriptionCancelledInfo
            : handleCancelSubscription
        }
      />

      <Box sx={{ display: 'flex', justifyContent: 'center', pb: '12px' }}>
        <PolicyLinkArea />
      </Box>
    </Container>
  );
};

export default BillingPageComponent;
