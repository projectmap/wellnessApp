import Link from 'next/link';
import React, { useEffect } from 'react';
import * as yup from 'yup';
import { Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';

import { useRouter } from 'next/router';
import { debounce } from '~/utils/helpers';

import { useGetUser } from '~/utils/useGetUser';
import { useAppSelector } from '~/state/app/hooks';
import { LoadingBtn } from '~/modules/_core/bits/buttons/LoadingBtn';
import { isNumberPositiveAndNotZero, isValidEmail } from '~/utils/isValidEmail';
import { GIFT_CARD_COST, GIFT_CETIFICATE_ROUTING } from '~/state/constants';
import { validateInputForBlankSpaces } from '~/utils/isInputAllWhiteSpaves';
import { CommunityFooterLinks } from '~/modules/community/CommunityFooterLinks';
import { Logo, RadioSubscriptionChecked, RadioSubscriptionUnChecked } from '~/icons';
import { useCapturePaymentIntentMutation, useCreatePaymentIntentMutation } from '@newstart-online/sdk';
import { CardWrapper, CardWrapperForGiftCard, inputStyle } from '~/modules/onboarding/modals/styles/CardWrapper';
import { validateInputForBlankSpacesAndSpecialCharacters } from '~/utils/validateInputForBlankSpacesAndSpecialCharacter';

interface IPaymentAndBillingGiftCard {
  planType: string;
  isCardValid?: boolean;
  isCardDateValid?: boolean;
  isCardCCVvalid?: boolean;
  couponCode?: string;
  locationType?: string;
  emailOfSender?: string;
  nameOfSender?: string;
  emailOfReceiver?: string;
  nameOfReceiver?: string;
  cost?: number;
  quantity?: number;
  messageToRecipient?: string;
}
export default function GiftCardComponent() {
  const router = useRouter();
  //Local states
  const [cardValidationError, setCardValidationError] = React.useState<string>('');
  const [cardExpirationError, setCardExpirationError] = React.useState<string>('');
  const [cardSecurityError, setCardSecurityError] = React.useState<string>('');
  const [programType, setProgramType] = React.useState('online');
  const [isAllCardDataAvailable, setIsAllCardDataAvailable] = React.useState(true);
  const [totalAmount, setTotalAmount] = React.useState(0);

  const user = useGetUser();

  const locationType = useAppSelector((state) => state.onboarding.locationType);

  //Schema
  const schema = yup
    .object()
    .shape({
      isCardValid: yup.boolean().required('Card information is required').oneOf([true], ''),
      locationType: yup.string(),
    })
    .required();

  const {
    handleSubmit,
    control,
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm<IPaymentAndBillingGiftCard>({
    mode: 'onChange',
  });

  //Submit section
  const [createPaymentIntent, { isLoading: creatingPaymentIntent }] = useCreatePaymentIntentMutation();
  const [capturePaymentIntent, { isLoading: capturingPaymentIntent }] = useCapturePaymentIntentMutation();
  const elements = useElements();
  const stripe = useStripe();

  useEffect(() => {
    if (watch() !== undefined) {
      const _quantity = watch()?.quantity || 0;
      const _total = _quantity * GIFT_CARD_COST;
      setTotalAmount(Math.floor(_total * 100) / 100);
    }
  }, [watch().quantity]);

  useEffect(() => {
    if (user) {
      const data = {
        emailOfSender: user.email,
        nameOfSender: user.name,
      };
      reset(data);
    }
  }, [user]);

  const onSubmit = async (data: any) => {
    const cardNumberElement = elements?.getElement(CardNumberElement); // to catch cardnumber element input
    if (data.isCardValid && data?.isCardDateValid && data?.isCardCCVvalid && stripe && cardNumberElement) {
      setIsAllCardDataAvailable(true);

      await createPaymentIntent({ price: GIFT_CARD_COST * 100 })
        .unwrap()
        .then(async (res: any) => {
          const resp = await stripe?.confirmCardPayment(res?.data?.clientSecret, {
            payment_method: { card: cardNumberElement },
          });
          if (resp?.paymentIntent?.status === 'requires_capture') {
            capturePaymentIntent({
              paymentIntentId: resp.paymentIntent.id,
              quantity: parseInt(data?.quantity, 10),
              amount: totalAmount * 100,
              message: data?.messageToRecipient,
              senderEmail: data?.emailOfSender,
              recipentEmail: data?.emailOfReceiver,
              senderName: data?.nameOfSender,
              reciverName: data?.nameOfReceiver,
            })
              .unwrap()
              .then((res) => {
                if (res.statusCode === 201) {
                  router.push(GIFT_CETIFICATE_ROUTING.GIFT_PURCHAED_SUCCESS_PAGE);
                }
              });
          }
        })
        .catch((err) => console.warn(err));
    }
  };

  const debouncedSubmit = React.useCallback(
    debounce((data) => {
      onSubmit(data);
      // Handle your form submission here
    }, 800), // Specify the debounce delay in milliseconds
    [],
  );
  const createGiftCard = (data: any) => {
    debouncedSubmit(data);
  };

  return (
    <Box className="BGforGiftCard" sx={{ pt: 6, width: '100vw' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          maxWidth: 'xl',
          minHeight: '100vh',
          paddingLeft: '137px',
        }}
      >
        <Box>
          <Link href="/">
            <Box sx={{ cursor: 'pointer' }}>
              <Logo />
            </Box>
          </Link>

          <Box sx={{ width: '476px', mt: '64px' }}>
            <Typography variant="h4" sx={{ mb: '40px' }}>
              Give the Gift of Good Health!
            </Typography>
            <form onSubmit={handleSubmit(createGiftCard)}>
              {/* Todo: This section is temporarily removed and will be used later after the confirmation with the client. */}

              {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: '40px', mb: '24px' }}>
                <Box
                  sx={{ cursor: 'pointer', width: '49%', display: 'flex', alignItems: 'center' }}
                  onClick={() => {
                    programType !== 'online' && setProgramType('online');
                  }}
                >
                  {programType === 'online' ? <RadioSubscriptionChecked /> : <RadioSubscriptionUnChecked />}
                  <Typography sx={{ ml: '12px' }} variant="body1">
                    For residential program
                  </Typography>
                </Box>
                <Box
                  sx={{ cursor: 'pointer', width: '49%', display: 'flex', alignItems: 'center' }}
                  onClick={() => {
                    programType !== 'residential' && setProgramType('residential');
                  }}
                >
                  {programType === 'residential' ? <RadioSubscriptionChecked /> : <RadioSubscriptionUnChecked />}
                  <Typography sx={{ whiteSpace: 'nowrap', ml: '12px' }} variant="body1">
                    For online program
                  </Typography>
                </Box>
              </Box> */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ width: '49%' }}>
                  <Typography variant="body1">Cost</Typography>
                  <CardWrapperForGiftCard>
                    <input
                      disabled
                      defaultValue={GIFT_CARD_COST}
                      placeholder="Cost"
                      type="number"
                      {...register('cost', {
                        required: {
                          value: false,
                          message: 'Please enter cost amount.',
                        },
                        max: { value: 999999999, message: 'Must be less than 999999999' },
                      })}
                      style={{
                        border: errors?.cost ? '1px solid #F81E1E' : '1px solid #A1A1AF',
                        height: '48px',
                        width: '100%',
                        borderRadius: '4px',
                        paddingLeft: '12px',
                      }}
                    />
                    {errors?.cost?.message && (
                      <span role="alert" className="error-msg" style={{ display: 'block', marginTop: '4px' }}>
                        {errors?.cost?.message}
                      </span>
                    )}
                  </CardWrapperForGiftCard>
                </Box>
                <Box sx={{ width: '49%' }}>
                  <Typography variant="body1">Quantity</Typography>
                  <CardWrapperForGiftCard>
                    <input
                      placeholder="Quantity"
                      type="number"
                      {...register('quantity', {
                        required: {
                          value: true,
                          message: 'Please enter quantity.',
                        },
                        max: { value: 999999999, message: 'Must be less than 999999999' },
                        min: { value: 1, message: 'Must be greater than 0' },
                      })}
                      style={{
                        border: errors?.quantity ? '1px solid #F81E1E' : '1px solid #A1A1AF',
                        height: '48px',
                        width: '100%',
                        borderRadius: '4px',
                        paddingLeft: '12px',
                      }}
                    />
                    {errors?.quantity?.message && (
                      <span role="alert" className="error-msg" style={{ display: 'block', marginTop: '4px' }}>
                        {errors?.quantity?.message}
                      </span>
                    )}
                  </CardWrapperForGiftCard>
                </Box>
              </Box>
              <Typography sx={{ mt: '24px', mb: '16px' }} variant="h5">
                To
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ width: '49%' }}>
                  <Typography variant="body1">Name of recipient</Typography>
                  <CardWrapperForGiftCard>
                    <input
                      placeholder="Recipient name"
                      type="text"
                      {...register('nameOfReceiver', {
                        required: {
                          value: true,
                          message: 'Please enter name of receiver.',
                        },
                        validate: validateInputForBlankSpacesAndSpecialCharacters,
                      })}
                      style={{
                        border: errors?.nameOfReceiver ? '1px solid #F81E1E' : '1px solid #A1A1AF',
                        height: '48px',
                        width: '100%',
                        borderRadius: '4px',
                        paddingLeft: '12px',
                      }}
                    />
                    {errors?.nameOfReceiver?.message && (
                      <span role="alert" className="error-msg" style={{ display: 'block', marginTop: '4px' }}>
                        {errors?.nameOfReceiver?.message}
                      </span>
                    )}
                  </CardWrapperForGiftCard>
                </Box>
                <Box sx={{ width: '49%' }}>
                  <Typography variant="body1">Email of recipient</Typography>
                  <CardWrapperForGiftCard>
                    <input
                      placeholder="Recipient email"
                      type="email"
                      {...register('emailOfReceiver', {
                        required: {
                          value: true,
                          message: 'Please enter email of receiver.',
                        },
                        validate: isValidEmail,
                      })}
                      style={{
                        border: errors?.emailOfReceiver ? '1px solid #F81E1E' : '1px solid #A1A1AF',
                        height: '48px',
                        width: '100%',
                        borderRadius: '4px',
                        paddingLeft: '12px',
                      }}
                    />
                    {errors?.emailOfReceiver?.message && (
                      <span role="alert" className="error-msg" style={{ display: 'block', marginTop: '4px' }}>
                        {errors?.emailOfReceiver?.message}
                      </span>
                    )}
                  </CardWrapperForGiftCard>
                </Box>
              </Box>

              <Typography sx={{ mt: '24px', mb: '16px' }} variant="h5">
                From
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <Box sx={{ width: '49%' }}>
                  <Typography variant="body1">Email of sender</Typography>
                  <CardWrapperForGiftCard>
                    <input
                      placeholder="Sender email"
                      type="email"
                      {...register('emailOfSender', {
                        required: {
                          value: true,
                          message: 'Please enter email of sender.',
                        },
                        validate: isValidEmail,
                      })}
                      style={{
                        border: errors?.emailOfSender ? '1px solid #F81E1E' : '1px solid #A1A1AF',
                        height: '48px',
                        width: '100%',
                        borderRadius: '4px',
                        paddingLeft: '12px',
                      }}
                    />
                    {errors?.emailOfSender?.message && (
                      <span role="alert" className="error-msg" style={{ display: 'block', marginTop: '4px' }}>
                        {errors?.emailOfSender?.message}
                      </span>
                    )}
                  </CardWrapperForGiftCard>
                </Box>
                <Box sx={{ width: '49%' }}>
                  <Typography variant="body1">Name of sender</Typography>
                  <CardWrapperForGiftCard>
                    <input
                      placeholder="Name of sender."
                      type="text"
                      {...register('nameOfSender', {
                        required: {
                          value: true,
                          message: 'Please enter name of sender.',
                        },
                        validate: validateInputForBlankSpacesAndSpecialCharacters,
                      })}
                      style={{
                        border: errors?.nameOfSender ? '1px solid #F81E1E' : '1px solid #A1A1AF',
                        height: '48px',
                        width: '100%',
                        borderRadius: '4px',
                        paddingLeft: '12px',
                      }}
                    />
                    {errors?.nameOfSender?.message && (
                      <span role="alert" className="error-msg" style={{ display: 'block', marginTop: '4px' }}>
                        {errors?.nameOfSender?.message}
                      </span>
                    )}
                  </CardWrapperForGiftCard>
                </Box>

                <Box sx={{ width: '49%', mt: '16px' }}>
                  <Typography variant="body1">Message to recipient</Typography>
                  <CardWrapperForGiftCard>
                    <input
                      placeholder="Message to recipient"
                      type="text"
                      {...register('messageToRecipient', {
                        required: {
                          value: true,
                          message: 'Please enter message.',
                        },
                        validate: validateInputForBlankSpaces,
                      })}
                      style={{
                        border: errors?.messageToRecipient ? '1px solid #F81E1E' : '1px solid #A1A1AF',
                        height: '48px',
                        width: '100%',
                        borderRadius: '4px',
                        paddingLeft: '12px',
                      }}
                    />
                    {errors?.messageToRecipient?.message && (
                      <span role="alert" className="error-msg" style={{ display: 'block', marginTop: '4px' }}>
                        {errors?.messageToRecipient?.message}
                      </span>
                    )}
                  </CardWrapperForGiftCard>
                </Box>
              </Box>

              <Typography sx={{ mt: '24px', mb: '16px' }} variant="h5">
                Payment Method
              </Typography>
              {!isAllCardDataAvailable && (
                <Typography sx={{ mt: '24px', mb: '16px', color: 'red' }} variant="h6">
                  You need to fill out all card info.
                </Typography>
              )}
              <Box sx={{ pb: 3 }}>
                <Typography variant="body1" sx={{ pb: '3px' }}>
                  Credit Card
                </Typography>
                <Box>
                  <Controller
                    name="isCardValid"
                    control={control}
                    rules={{ required: 'Last name is required' }}
                    render={({ field, fieldState }) => (
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
                      name="isCardDateValid"
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
                    CVC
                  </Typography>
                  <Box>
                    <Controller
                      name="isCardCCVvalid"
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

              <Typography sx={{ mt: '16px' }} variant="subtitle1">
                Total: ${totalAmount}
              </Typography>

              <LoadingBtn
                onClick={() => {
                  if (
                    watch().isCardValid === undefined ||
                    watch().isCardCCVvalid === undefined ||
                    watch().isCardDateValid === undefined
                  ) {
                    setIsAllCardDataAvailable(false);
                  } else if (
                    watch().isCardValid !== undefined &&
                    watch().isCardCCVvalid !== undefined &&
                    watch().isCardDateValid !== undefined
                  ) {
                    setIsAllCardDataAvailable(true);
                  }
                }}
                loading={creatingPaymentIntent || capturingPaymentIntent}
                sx={{ mt: '32px', width: 'fit-content', borderRadius: '32px', py: '10.5px', px: '32px' }}
              >
                Submit Now
              </LoadingBtn>
            </form>
          </Box>
        </Box>
        <Box sx={{ mt: '32px' }}>
          <CommunityFooterLinks />
        </Box>
      </Box>
    </Box>
  );
}
