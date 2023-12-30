import React from 'react';
import * as yup from 'yup';
import Image from 'next/image';
import { Box, getValue } from '@mui/system';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';

import { ROUTE } from '~/config/routes';
import { debounce } from '~/utils/helpers';
import { useAppSelector } from '~/state/app/hooks';
import { USER_SUBSCRIPTION_TYPE } from '~/state/constants';
import { CardWrapper, inputStyle } from './styles/CardWrapper';
import { LoadingBtn } from '~/modules/_core/bits/buttons/LoadingBtn';
import {
  setisUserSubscribed,
  setUserOnboardingLocation,
  setUserPayment,
  setUserSubscriptionModal,
} from '~/state/services/onboarding/onboardingSlice';
import {
  useAppDispatch,
  useCreateSubscriptionsMutation,
  useListPlanQuery,
  USER_TYPE,
  useCreateUserProfileMutation,
  useLazyGetProfileQuery,
} from '@newstart-online/sdk';
import { HalfLeftArrow } from '~/icons';
import { GenericOnboardingSectionModal } from '~/modules/onboarding/modals/GenericOnboardingSectionModal';

interface IPaymentAndBillingModal {
  planType: string;
  isCardValid?: boolean;
  couponCode?: string;
  locationType?: string;
}

const PaymentAndBillingModal = ({ planType }: IPaymentAndBillingModal) => {
  const [subscriptionPrice, setSubscriptionPrice] = React.useState<string>(USER_SUBSCRIPTION_TYPE.ANNUAL);
  const [isPaymentProcessing, setIsPaymentProcessing] = React.useState<boolean>(false);

  const [cardValidationError, setCardValidationError] = React.useState<string>('');

  const [cardExpirationError, setCardExpirationError] = React.useState<string>('');

  const [cardSecurityError, setCardSecurityError] = React.useState<string>('');

  const [getUserProfile] = useLazyGetProfileQuery();

  const showPayment = useAppSelector((state) => state.onboarding.showPayment);

  const locationType = useAppSelector((state) => state.onboarding.locationType);

  const stripe = useStripe();

  const elements = useElements();

  const router = useRouter();

  const dispatch = useAppDispatch();

  const { data: getPrice } = useListPlanQuery(); // getprice id from backend

  const annualPrice: any = getPrice?.data?.find(
    (price) => price?.recurring?.interval === 'year' && !price.metadata.isCEUPlan,
  );

  const monthlyPrice = getPrice?.data?.find((price) => price?.recurring?.interval === 'month');

  const trialMode = planType === USER_SUBSCRIPTION_TYPE.FREE_TRIAL ? true : false;

  const [createSub, isLoading] = useCreateSubscriptionsMutation(); // create subscription mutation from sdk

  const [updateUsers] = useCreateUserProfileMutation();

  const schema = yup
    .object()
    .shape({
      isCardValid: yup.boolean().required('Card information is required').oneOf([true], ''),
      locationType: yup.string(),
      couponCode:
        locationType === USER_TYPE.CEUCREDITS
          ? yup.string().required('Please enter your nursing license number').trim()
          : yup.string(),
    })
    .required();

  const {
    handleSubmit,
    control,
    register,

    formState: { errors },
  } = useForm<IPaymentAndBillingModal>({
    resolver: yupResolver(schema),
    defaultValues: {
      couponCode: '',
      locationType: 'Online',
    },
  });

  React.useEffect(() => {
    if (annualPrice?.id) {
      setSubscriptionPrice(annualPrice?.id);
    }
  }, [annualPrice?.id]);

  const getSubscriptionPrice = (planType: string) => {
    if (planType === USER_SUBSCRIPTION_TYPE.ANNUAL) {
      return annualPrice?.id;
    } else if (planType === USER_SUBSCRIPTION_TYPE.MONTHLY) {
      return monthlyPrice?.id;
    }

    return subscriptionPrice; //defaulted to freetrial
  };

  const handlePayment = async (data: IPaymentAndBillingModal) => {
    setIsPaymentProcessing(true);
    const cardNumberElement = elements?.getElement(CardNumberElement); // to catch cardnumber element input

    const price = getSubscriptionPrice(planType);

    if (data.isCardValid && stripe && cardNumberElement) {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberElement!,
      });

      if (!error) {
        try {
          const id = paymentMethod?.id as string; //please fix this after reviewing backend data
          if (locationType !== USER_TYPE.CEUCREDITS) {
            createSub({
              paymentMethod: id,
              price: price || '',
              isTrail: trialMode,
              promoCode: data?.couponCode,
              isPriceIdCeuCredits: false,
            })
              .unwrap()
              .then((data) => {
                router.push(ROUTE.HOME);
                dispatch(setisUserSubscribed(true));
                getUserProfile();
                toast.success(data?.message);
              })
              .catch((error) => toast.error(error?.data?.message));
          }

          if (locationType === USER_TYPE.CEUCREDITS) {
            updateUsers({
              medicalLicenseNumber: data?.couponCode, //this is not couponcode but license number however we have one input name couponcode
            });
            createSub({
              paymentMethod: id,
              price: locationType === USER_TYPE.CEUCREDITS ? (getPrice?.data?.[0]?.id as string) : (price as string),
              isTrail: false,
              isPriceIdCeuCredits: true,
            })
              .unwrap()
              .then((data) => {
                toast.success(data?.message);
                router.push(ROUTE.HOME);
                getUserProfile();
                dispatch(setisUserSubscribed(true));
              })
              .catch((error) => toast.error(error?.data?.message));
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
    setIsPaymentProcessing(false);
  };

  const handleClose = (event: any, reason: any) => {
    if (reason && reason === 'backdropClick') return;

    dispatch(setUserPayment(false));
  };

  const handleBack = () => {
    dispatch(setUserPayment(false));
    if (locationType === USER_TYPE.CEUCREDITS) {
      dispatch(setUserOnboardingLocation(true));
    } else {
      dispatch(setUserSubscriptionModal(true));
    }
  };

  // Define your debounced submit handler
  const debouncedSubmit = React.useCallback(
    debounce((data) => {
      handlePayment(data);
      // Handle your form submission here
    }, 800), // Specify the debounce delay in milliseconds
    [planType, subscriptionPrice],
  );
  const onSubmit = (data: IPaymentAndBillingModal) => {
    debouncedSubmit(data);
  };

  return (
    <>
      <GenericOnboardingSectionModal
        isOpen={showPayment}
        onCloseModal={handleClose}
        showCloseButton={false}
        sx={{ width: '551px', p: 4 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleBack}>
            <HalfLeftArrow />
            {locationType === USER_TYPE.ONLINE ? (
              <Typography variant="h6" sx={{ ml: 1 }}>
                {planType === USER_SUBSCRIPTION_TYPE.MONTHLY
                  ? 'Online - $12.99 USD'
                  : planType === USER_SUBSCRIPTION_TYPE.FREE_TRIAL
                  ? 'Free Trial'
                  : 'Online - $9.99 USD'}
              </Typography>
            ) : planType === USER_SUBSCRIPTION_TYPE.FREE_TRIAL ? (
              <Typography variant="h6" sx={{ ml: 1 }}>
                {planType === USER_SUBSCRIPTION_TYPE.FREE_TRIAL && USER_SUBSCRIPTION_TYPE.FREE_TRIAL}
              </Typography>
            ) : (
              <Typography variant="h6" sx={{ ml: 1 }}>
                {planType === USER_SUBSCRIPTION_TYPE.MONTHLY && locationType === USER_TYPE.CEUCREDITS
                  ? 'Registration for CEU credit - $349 USD'
                  : planType === USER_SUBSCRIPTION_TYPE.MONTHLY
                  ? 'Residential - $12.99 USD'
                  : 'Residential - $9.99 USD'}
              </Typography>
            )}
          </Box>
          {planType !== USER_SUBSCRIPTION_TYPE.FREE_TRIAL}
          <Typography>
            {planType === USER_SUBSCRIPTION_TYPE.FREE_TRIAL
              ? '14 days'
              : locationType === USER_TYPE.CEUCREDITS
              ? '1 year'
              : '1 month'}
          </Typography>
        </Box>
        <Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ pb: 3 }}>
              {locationType === USER_TYPE.CEUCREDITS ? (
                <Typography variant="body1" sx={{ pb: '3px' }}>
                  Nursing license number *
                </Typography>
              ) : (
                <Typography variant="body1" sx={{ pb: '3px' }}>
                  {planType === USER_SUBSCRIPTION_TYPE.FREE_TRIAL ? 'Coupon Code (optional)' : 'Coupon Code'}
                </Typography>
              )}

              <CardWrapper>
                <div>
                  <input
                    type="text"
                    {...register('couponCode', {
                      required: {
                        value: true,
                        message: 'Please enter your Coupon Code.',
                      },
                    })}
                    style={{
                      border: errors?.couponCode ? '1px solid #F81E1E' : '1px solid #b8b8c3',
                      height: '45.2px',
                      width: '100%',
                      borderRadius: '4px',
                      paddingLeft: '12px',
                    }}
                  />
                  {errors?.couponCode?.message && (
                    <span role="alert" className="error-msg" style={{ display: 'block', marginTop: '4px' }}>
                      {errors?.couponCode?.message}
                    </span>
                  )}
                </div>
              </CardWrapper>
            </Box>
            <Box sx={{ pb: 3 }}>
              <Typography variant="body1" sx={{ pb: '3px' }}>
                Card Number
              </Typography>
              <Box>
                <Controller
                  name="isCardValid"
                  control={control}
                  render={({ field }) => (
                    <CardWrapper>
                      <div className={`card-number ${cardValidationError ? 'invalid' : ''}`}>
                        <CardNumberElement
                          options={{
                            style: {
                              base: inputStyle,
                              invalid: {
                                color: '#ED2F00',
                              },
                            },
                          }}
                          onChange={({ empty, complete, error }) => {
                            field.onChange(empty ? undefined : complete);
                            setCardValidationError(error?.message || '');
                          }}
                        />
                      </div>

                      <span role="alert" className={`${errors.isCardValid ? 'card-error' : ''}`}>
                        {cardValidationError}
                      </span>
                    </CardWrapper>
                  )}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', mb: 4 }}>
              <Box sx={{ width: '48%' }}>
                <Typography variant="body1" sx={{ pb: '3px' }}>
                  Expiration date
                </Typography>
                <Box>
                  <Controller
                    name="isCardValid"
                    control={control}
                    render={({ field }) => (
                      <CardWrapper>
                        <div className={`card-number ${cardValidationError ? 'invalid' : ''}`}>
                          <CardExpiryElement
                            options={{
                              style: {
                                base: inputStyle,
                                invalid: {
                                  color: '#ED2F00',
                                },
                              },
                            }}
                            onChange={({ empty, complete, error }) => {
                              field.onChange(empty ? undefined : complete);
                              setCardExpirationError(error?.message || '');
                            }}
                          />
                        </div>

                        <span role="alert">{cardExpirationError}</span>
                      </CardWrapper>
                    )}
                  />
                </Box>
              </Box>
              <Box sx={{ width: '48%' }}>
                <Typography variant="body1" sx={{ pb: '3px' }}>
                  Security code
                </Typography>
                <Box>
                  <Controller
                    name="isCardValid"
                    control={control}
                    render={({ field }) => (
                      <CardWrapper>
                        <div className={`card-number ${cardValidationError ? 'invalid' : ''}`}>
                          <CardCvcElement
                            options={{
                              style: {
                                base: inputStyle,
                                invalid: {
                                  color: '#ED2F00',
                                },
                              },
                            }}
                            onChange={({ empty, complete, error }) => {
                              field.onChange(empty ? undefined : complete);
                              setCardSecurityError(error?.message || '');
                            }}
                          />
                        </div>
                        <span role="alert">{cardSecurityError}</span>
                      </CardWrapper>
                    )}
                  />
                </Box>
              </Box>
            </Box>
            {planType === USER_SUBSCRIPTION_TYPE.FREE_TRIAL ? (
              <Box>
                <Typography variant="body1">Which plan do you wish to renew when the trail is finished?</Typography>
                <FormControl>
                  <RadioGroup
                    aria-labelledby="payment_options"
                    name="payment_options"
                    defaultValue={'yearly'}
                    sx={{ display: 'flex', flexDirection: 'row', pb: 3 }}
                    value={subscriptionPrice}
                  >
                    {getPrice?.data?.map((item) => {
                      if (item?.metadata?.isCEUPlan) {
                        return null;
                      }

                      return (
                        <FormControlLabel
                          value={item?.id}
                          control={<Radio defaultValue={'yearly'} />}
                          label={`Pay ${item?.recurring?.interval}ly`}
                          key={item?.id}
                          onChange={() => setSubscriptionPrice(item?.id)}
                        />
                      );
                    })}
                  </RadioGroup>
                </FormControl>
              </Box>
            ) : null}
            <LoadingBtn
              loading={isLoading?.isLoading || isPaymentProcessing}
              sx={{ width: '100%', borderRadius: '32px', py: '10.5px' }}
            >
              {planType === USER_SUBSCRIPTION_TYPE.FREE_TRIAL ? 'Start My Free Trial' : 'Pay'}
            </LoadingBtn>
          </form>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 5 }}>
            <Typography variant="body2" sx={{ color: '#717186', pr: '6px' }}>
              Secured by
            </Typography>
            <Image src="/assets/icons/Stripe.svg" alt="stripe" width={58.19} height={24} />
          </Box>
        </Box>
      </GenericOnboardingSectionModal>
    </>
  );
};

export default PaymentAndBillingModal;
