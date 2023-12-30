import { Box } from '@mui/system';
import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import { Modal, Paper, Typography } from '@mui/material';
import {
  useGetProfileQuery,
  useGetUserAllPaymentCardQuery,
  useListPlanQuery,
  usePayInvoiceBillMutation,
  USER_TYPE,
  useUpdateSubscriptionsMutation,
  useGetCurrentUserProfileDetailsQuery,
  useCreateUserProfileMutation,
  useGetUserSubscriptionsQuery,
} from '@newstart-online/sdk';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { debounce } from '~/utils/helpers';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingBtn } from '../../bits/buttons/LoadingBtn';
import { useAppDispatch, useAppSelector } from '~/state/app/hooks';
import { PAY_NOW_OPTIONS, USER_SUBSCRIPTION_TYPE } from '~/state/constants';
import { BillingTableStyles } from '../../styles/BillingAndAccountingStyles';
import { setShowAddCardFormBox } from '~/state/services/onboarding/onboardingSlice';
import { CloseBtnBlackIcon, PlusIcon, RadioSubscriptionChecked, RadioSubscriptionUnChecked } from '~/icons';

interface IPaymentMethodModal {
  showPaymentMethodChangeModal: boolean;
  setShowPaymentMethodChangeModal: (status: boolean) => void;
  invoiceId?: string;
  payNowOptions: string;
  selectedUserLocations?: USER_TYPE;
  setShowUserLocationModal?: (data: boolean) => void;
  showGiftCertificateField?: boolean;
}
export default function PaymentMethodModal({
  showPaymentMethodChangeModal,
  setShowPaymentMethodChangeModal,
  invoiceId = '',
  payNowOptions,
  selectedUserLocations,
  setShowUserLocationModal,
  showGiftCertificateField = true,
}: IPaymentMethodModal) {
  const dispatch = useAppDispatch();
  const [payBill, { isLoading: isPayingBill }] = usePayInvoiceBillMutation();
  const [subscribeNow, { isLoading: isChangingSubscriptions }] = useUpdateSubscriptionsMutation();
  const planType = useAppSelector((state) => state.onboarding.planType);
  const { data: paymentData, isFetching: isPaymentDataLoading } = useGetUserAllPaymentCardQuery();
  const { data: profileData } = useGetProfileQuery();
  const [userLocation] = useCreateUserProfileMutation();
  const { data: subscriptionsData } = useGetUserSubscriptionsQuery();

  const defaultCardId = paymentData?.data?.find((item: any) => item?.isDefault)?.id;

  const [paymentCard, setPaymentCard] = useState<string>('');
  const { data: profile } = useGetCurrentUserProfileDetailsQuery();
  const router = useRouter();
  const isRouteIncludeLearn = router.pathname.split('/').includes('learn');

  const schema = yup.object().shape({
    medicalLicense:
      selectedUserLocations === USER_TYPE.CEUCREDITS
        ? yup
            .string()
            .required('Please enter your nursing license number')
            .trim('Nursing license number cannot contain only white spaces.')
            .strict(true)
        : yup.string().trim('Nursing license number cannot contain only white spaces.').strict(true),
    couponCode: yup.string().trim('Gift Certificate code cannot contain white spaces.').strict(true),
  });

  const {
    handleSubmit,
    control,
    register,
    reset,

    formState: { errors },
  } = useForm<{ medicalLicense: string; couponCode: string }>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (profile?.data?.medicalLicenseNumber) {
      const medicalLicense = profile?.data?.medicalLicenseNumber;
      reset({ medicalLicense });
    }
  }, [profile]);

  const handleAddCard = () => {
    dispatch(setShowAddCardFormBox(true));
  };

  const handleChangePaymentMethodLocally = (id: string) => {
    setPaymentCard(id);
  };

  const { data: getPrice } = useListPlanQuery(); // getprice id from backend

  const annualPriceId =
    getPrice?.data?.find((price) => price?.recurring?.interval === 'year' && !price.metadata.isCEUPlan)?.id || '';

  const annualPriceIdForCEUCredits = getPrice?.data?.find((price) => price.metadata.isCEUPlan)?.id || '';

  const monthlyPriceId = getPrice?.data?.find((price) => price?.recurring?.interval === 'month')?.id || '';
  let priceId = '';

  switch (planType) {
    case USER_SUBSCRIPTION_TYPE.FREE_TRIAL:
      priceId = '';
      break;
    case USER_SUBSCRIPTION_TYPE.ANNUAL:
      priceId = annualPriceId;
      break;
    case USER_SUBSCRIPTION_TYPE.MONTHLY:
      priceId = monthlyPriceId;
      break;
    default:
      priceId = '';
  }

  const trialMode = planType === USER_SUBSCRIPTION_TYPE.FREE_TRIAL ? true : false;

  const handlePayBill = (inputData: { medicalLicense: string; couponCode: string }) => {
    const previousPriceId = subscriptionsData?.data?.plan?.id;
    switch (payNowOptions) {
      case PAY_NOW_OPTIONS.INVOICE_PAYMENT:
        payBill({ id: invoiceId, paymentMethod: paymentCard })
          .unwrap()
          .then((data) => {
            toast.success(data.message);
            setShowPaymentMethodChangeModal(false);
          })
          .catch((error) => toast.error(error.data.message));
        break;
      case PAY_NOW_OPTIONS.SUBSCRIBE_PAYMENT:
        if (
          previousPriceId === priceId &&
          !subscriptionsData?.data?.cancel_at_period_end &&
          subscriptionsData?.data.status !== 'trialing' &&
          subscriptionsData?.data.status !== 'canceled' &&
          !inputData.couponCode
        ) {
          toast.success('You are on same plan.');

          if (selectedUserLocations !== USER_TYPE.CEUCREDITS) {
            userLocation({ userType: selectedUserLocations });
          }

          setShowPaymentMethodChangeModal(false);
          reset({ couponCode: '' });
          setShowUserLocationModal && setShowUserLocationModal(false);

          return;
        }
        subscribeNow({
          freeType: false,
          priceId: selectedUserLocations === USER_TYPE.CEUCREDITS ? annualPriceIdForCEUCredits : priceId,
          paymentMethodId: paymentCard,
          isPriceIdCeuCredits: selectedUserLocations === USER_TYPE.CEUCREDITS,
          couponCode: inputData?.couponCode ? inputData?.couponCode : undefined,
          updateAtPeriodEnd: !isRouteIncludeLearn,
        })
          .unwrap()
          .then((data) => {
            const postData: any = {
              userType: selectedUserLocations,
            };
            if (inputData?.medicalLicense) {
              postData['medicalLicenseNumber'] = inputData?.medicalLicense;
            }
            userLocation(postData);
            toast.success(data.message);
            setShowPaymentMethodChangeModal(false);
            reset({ couponCode: '' });
            setShowUserLocationModal && setShowUserLocationModal(false);
          })
          .catch((error) => toast.error(error?.data?.message));

        break;
      default:
        console.error('Payment option is not valid !');
    }
  };

  const debouncedSubmit = debounce((data) => {
    handlePayBill(data);
    // Handle your form submission here
  }, 800); // Specify the debounce delay in milliseconds
  // [getPrice, subscriptionsData, paymentCard,priceId],

  const onFormSubmit = (data: any) => {
    debouncedSubmit(data);
  };

  useEffect(() => {
    if (defaultCardId && paymentCard === '') {
      setPaymentCard(defaultCardId as string);
    }
  }, [defaultCardId]);

  return (
    <Modal open={showPaymentMethodChangeModal} onClose={() => setShowPaymentMethodChangeModal(false)}>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Paper sx={BillingTableStyles.paymentMethodChangeModalContainer}>
          <Box sx={BillingTableStyles.paymentChangeModalTitleNCrossBtn}>
            <Typography variant="h5">Choose payment method</Typography>
            <CloseBtnBlackIcon onClick={() => setShowPaymentMethodChangeModal(false)} className="cursor-pointer" />
          </Box>

          {selectedUserLocations === USER_TYPE.CEUCREDITS && (
            <Box sx={{ pt: 3, mb: '24px' }}>
              <Typography variant="body1" sx={{ pb: '3px' }}>
                Nursing license number *
              </Typography>

              <div>
                <input
                  type="text"
                  {...register('medicalLicense')}
                  style={{
                    border: errors?.medicalLicense ? '1px solid #F81E1E' : '1px solid #b8b8c3',
                    height: '45.2px',
                    width: '100%',
                    borderRadius: '4px',
                    paddingLeft: '12px',
                  }}
                  disabled={!!profile?.data?.medicalLicenseNumber}
                />
                {errors?.medicalLicense?.message && (
                  <span role="alert" className="error-msg" style={{ display: 'block', marginTop: '4px' }}>
                    {errors?.medicalLicense?.message}
                  </span>
                )}
              </div>
            </Box>
          )}

          {selectedUserLocations !== USER_TYPE.CEUCREDITS && showGiftCertificateField && (
            <Box sx={{ pt: 3 }}>
              <Typography variant="body1" sx={{ pb: '3px' }}>
                Gift Certificate
              </Typography>

              <div>
                <input
                  type="text"
                  placeholder="Enter Code."
                  {...register('couponCode')}
                  style={{
                    border: errors?.couponCode ? '1px solid #F81E1E' : '1px solid #b8b8c3',
                    height: '45.2px',
                    width: '100%',
                    borderRadius: '4px',
                    paddingLeft: '12px',
                  }}
                />
                {errors?.couponCode?.message && (
                  <span role="alert" className="error-msg" style={{ display: 'block', marginTop: '4px', color: 'red' }}>
                    {errors?.couponCode?.message}
                  </span>
                )}
              </div>
            </Box>
          )}

          <Box className="hide-scrollbar" sx={BillingTableStyles.modalCardContainer}>
            {paymentData?.data?.map((item: any, idx: number) => {
              return (
                <Box sx={BillingTableStyles.modalCardItem} key={idx}>
                  {item?.id === paymentCard ? (
                    <Box className="cursor-pointer" sx={BillingTableStyles.modalCheckBoxContainer}>
                      <RadioSubscriptionChecked />
                    </Box>
                  ) : (
                    <Box
                      onClick={() => handleChangePaymentMethodLocally(item?.id)}
                      className="cursor-pointer"
                      sx={BillingTableStyles.modalCheckBoxContainer}
                    >
                      <RadioSubscriptionUnChecked />
                    </Box>
                  )}
                  <Box>
                    <Typography variant="subtitle1">{profileData?.data?.name}</Typography>
                    <Typography variant="subtitle2" sx={BillingTableStyles.cardNo}>
                      **** **** **** {item?.card?.last4}
                    </Typography>
                    <Typography variant="subtitle2">
                      {item?.card?.exp_month}/{item?.card?.exp_year}
                    </Typography>
                  </Box>
                </Box>
              );
            })}

            <Box sx={BillingTableStyles.addCardContainer}>
              <Box onClick={() => handleAddCard()} sx={BillingTableStyles.addCardIconNText}>
                <PlusIcon />
                <Typography variant="subtitle1">Add new card</Typography>
              </Box>
            </Box>
          </Box>

          <LoadingBtn
            sx={BillingTableStyles.payNowBtn}
            loading={isPaymentDataLoading || isPayingBill || isChangingSubscriptions}
          >
            Pay Now
          </LoadingBtn>
        </Paper>
      </form>
    </Modal>
  );
}
