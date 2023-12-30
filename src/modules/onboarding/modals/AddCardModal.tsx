import React from 'react';
import * as yup from 'yup';
import Image from 'next/image';
import { Box } from '@mui/system';
import { toast } from 'react-toastify';
import { Typography } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';

import { debounce } from '~/utils/helpers';
import { useAppSelector } from '~/state/app/hooks';
import { CardWrapper, inputStyle } from './styles/CardWrapper';
import { LoadingBtn } from '~/modules/_core/bits/buttons/LoadingBtn';
import { GenericModal } from '~/modules/_core/bits/modals/DragableModal';
import { setShowAddCardFormBox } from '~/state/services/onboarding/onboardingSlice';
import { useAddPaymentCardMutation, useAppDispatch } from '@newstart-online/sdk';

interface IAddCardModal {
  isCardValid?: boolean;
}

const AddCardModal = () => {
  const [cardValidationError, setCardValidationError] = React.useState<string>('');

  const [cardExpirationError, setCardExpirationError] = React.useState<string>('');

  const [cardSecurityError, setCardSecurityError] = React.useState<string>('');

  const showAddCardFormBox = useAppSelector((state) => state.onboarding.showAddCardFormBox);

  const stripe = useStripe();

  const elements = useElements();

  const dispatch = useAppDispatch();

  const [addCard, isLoading] = useAddPaymentCardMutation(); // add card mutation from sdk

  const schema = yup
    .object()
    .shape({
      isCardValid: yup.boolean().required('Card information is required').oneOf([true], ''),
    })
    .required();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IAddCardModal>({
    resolver: yupResolver(schema),
  });

  const handlePayment = async (data: IAddCardModal) => {
    const cardNumberElement = elements?.getElement(CardNumberElement); // to catch cardnumber element input

    if (data.isCardValid && stripe && cardNumberElement) {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberElement!,
      });

      if (!error) {
        try {
          const { id } = paymentMethod;
          addCard(id)
            .unwrap()
            .then((data) => {
              toast.success(data?.message);
              dispatch(setShowAddCardFormBox(false));
            })
            .catch((error) => {
              toast.error(error.data.message);
            });
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  const handleClose = () => {
    dispatch(setShowAddCardFormBox(false));
  };

  // Define your debounced submit handler
  const debouncedSubmit = React.useCallback(
    debounce((data) => {
      handlePayment(data);
      // Handle your form submission here
    }, 800), // Specify the debounce delay in milliseconds
    [],
  );
  const onSubmit = (data: IAddCardModal) => {
    debouncedSubmit(data);
  };

  return (
    <>
      <GenericModal
        isOpen={showAddCardFormBox}
        onCloseModal={handleClose}
        showCloseButton={false}
        sx={{ width: '551px', p: 4 }}
        closeModalCross={true}
      >
        <Box>
          <form onSubmit={handleSubmit(onSubmit)}>
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

            <LoadingBtn loading={isLoading?.isLoading} sx={{ width: '100%', borderRadius: '32px', py: '10.5px' }}>
              Add Card
            </LoadingBtn>
          </form>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 5 }}>
            <Typography variant="body2" sx={{ color: '#717186', pr: '6px' }}>
              Secured by
            </Typography>
            <Image src="/assets/icons/Stripe.svg" alt="stripe" width={58.19} height={24} />
          </Box>
        </Box>
      </GenericModal>
    </>
  );
};

export default AddCardModal;
