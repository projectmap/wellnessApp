import { Box } from '@mui/system';
import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button, MobileStepper, Modal, Paper, TextField, Typography } from '@mui/material';

import { ModalWrapper } from '../styles/ModalWrapper';
import { optionsHealthConditions, USER_ONBOARDING_STEPS } from '~/state/constants';
import { useAppDispatch, useAppSelector } from '~/state/app/hooks';
import { IMultiFormModalInputs } from './MuiltiformModalInputs.interface';
import {
  setActiveStepInMultiForm,
  setOpenMultiForm,
  setUserOnboardingLocation,
} from '~/state/services/onboarding/onboardingSlice';
import { BlueCheckedIcon, UncheckedIcon } from '~/icons';
import { IUserProfileResponse, useCreateUserProfileMutation, useUpdateUserByTokenMutation } from '@newstart-online/sdk';
import { validateInputForBlankSpacesAndSpecialCharacters } from '~/utils/validateInputForBlankSpacesAndSpecialCharacter';

type IProps = {
  userProfile: any;
};
export const HealthInfoModal: React.FC<IProps> = ({ userProfile }) => {
  const [isOthersHealthConditionsSelected, setIsOthersHealthConditionsSelected] = useState(false);
  const [isHealthConditionsDataEmpty, setIsHealthConditionsDataEmpty] = useState(false);
  const [healthOptions, setHealthOptions] = useState<string>('yes');
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IMultiFormModalInputs>();

  const [submitUserHealthInformation] = useCreateUserProfileMutation();
  const [updateUser] = useUpdateUserByTokenMutation();
  const dispatch = useAppDispatch();
  const activeStep = useAppSelector((state) => state.onboarding.activeStep);
  const [openMultiForm, setOpenMultiForms] = useState(useAppSelector((state) => state.onboarding.openMultiForm));

  const handleBack = () => {};
  const onSubmit: SubmitHandler<IMultiFormModalInputs> = async (data) => {
    if (healthOptions === 'no') {
      updateUser({ isFirstLogin: false });
      dispatch(setActiveStepInMultiForm(USER_ONBOARDING_STEPS.USER_AVATAR));

      return;
    }
    setIsHealthConditionsDataEmpty(false);
    if (!data?.healthConditions?.length && !isOthersHealthConditionsSelected) {
      setIsHealthConditionsDataEmpty(true);
    } else {
      if (data?.userProvidedHealthCondions && isOthersHealthConditionsSelected) {
        if (Array.isArray(data?.healthConditions)) {
          data?.healthConditions?.push(data?.userProvidedHealthCondions?.trim());
        } else {
          data.healthConditions = [data?.userProvidedHealthCondions?.trim()];
        }
      }

      submitUserHealthInformation({
        healthConditions: healthOptions === 'yes' ? data?.healthConditions : [''],
      })
        .unwrap()
        .then(() => {
          setIsHealthConditionsDataEmpty(false);
          toast.success('Information saved successfully');
          updateUser({ isFirstLogin: false });
          dispatch(setOpenMultiForm(true));
          dispatch(setActiveStepInMultiForm(USER_ONBOARDING_STEPS.USER_AVATAR));
        })
        .catch((err: any) => {
          toast.error(err.data?.message);
        });
    }
  };

  useEffect(() => {
    if (userProfile && userProfile?.data?.healthConditions.length === 0) {
      setOpenMultiForms(true);
    }
  }, [userProfile]);

  return (
    <Modal open={openMultiForm}>
      <ModalWrapper>
        <Paper
          sx={{
            width: '557px',
            pb: '12px',
            position: 'absolute',
            left: '50%',
            top: '50%',
            height: 'fit-content',
            borderRadius: '12px',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 4 }}>
            <Typography variant="subtitle1">{activeStep} of 3</Typography>
          </Box>
          <MobileStepper //progress bar
            variant="progress"
            steps={4}
            position="static"
            activeStep={activeStep}
            sx={{
              maxWidth: '100%',
              flexGrow: 1,
              '& .MuiLinearProgress-root': {
                width: '100%',
                backgroundColor: 'rgba(0,0,0, 0.2)',
                height: '2px',
              },
              background: 'none',
              padding: '0',
            }}
            nextButton={
              //hidden but only needed for mui typesafe needs
              <Button
                size="small"
                onClick={() => dispatch(setActiveStepInMultiForm(USER_ONBOARDING_STEPS.HEALTH_INFO))}
                disabled={activeStep === USER_ONBOARDING_STEPS.USER_AVATAR}
                sx={{ display: 'none' }}
              >
                Next
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={handleBack}
                disabled={activeStep === USER_ONBOARDING_STEPS.GENERAL_INFO}
                sx={{ display: 'none' }}
              >
                Back
              </Button>
            }
          />
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', p: 4 }}>
              <Typography variant="h5" sx={{ pb: 3 }}>
                About me
              </Typography>
              <Typography variant="subtitle1" sx={{ pb: 2 }}>
                Do you have any of these health conditions?
              </Typography>
              <Box sx={{ mb: 3 }}>
                <div className="onboarding-info-unit-btn">
                  <button
                    type="button"
                    className={` ${healthOptions === 'yes' ? 'selected' : 'unit_btn'}`}
                    onClick={() => setHealthOptions('yes')}
                  >
                    Yes
                  </button>
                  <button
                    className={` ${healthOptions === 'no' ? 'selected' : 'unit_btn'}`}
                    type="button"
                    onClick={() => setHealthOptions('no')}
                  >
                    No
                  </button>
                </div>
              </Box>
              {healthOptions !== 'no' ? (
                <Box sx={{ height: '100%' }}>
                  {optionsHealthConditions.map((item, index) => {
                    return (
                      <label htmlFor={item.value} className="checkbox-container" key={index}>
                        <input {...register('healthConditions')} type="checkbox" value={item.value} id={item.value} />
                        <span className="checkmark"></span>
                        {item.label}
                      </label>
                    );
                  })}
                  <Box>
                    <Box
                      sx={{ display: 'flex', cursor: 'pointer' }}
                      onClick={() => setIsOthersHealthConditionsSelected(!isOthersHealthConditionsSelected)}
                    >
                      {!isOthersHealthConditionsSelected ? <UncheckedIcon /> : <BlueCheckedIcon />}

                      <Typography sx={{ ml: '9px' }}>Others</Typography>
                    </Box>
                    {isOthersHealthConditionsSelected && (
                      <Box sx={{ width: '100%', mt: '16px', position: 'relative' }}>
                        <TextField
                          type="text"
                          placeholder="Enter your health conditions. "
                          inputProps={{ maxLength: 40 }}
                          {...register('userProvidedHealthCondions', {
                            required: { value: true, message: 'Please enter your health conditions.' },
                            validate: validateInputForBlankSpacesAndSpecialCharacters,
                          })}
                          sx={{
                            width: '100%',
                            borderRadius: '4px',
                            outline: 'none',
                            '& .MuiInputBase-input.Mui-disabled': {
                              WebkitTextFillColor: '#000000',
                            },
                            '& fieldset': { border: 'none' },
                          }}
                          style={{
                            border: errors.userProvidedHealthCondions?.message
                              ? '1px solid #F81E1E'
                              : '1px solid #b8b8c3',
                          }}
                        />
                        {errors.userProvidedHealthCondions && (
                          <Typography role="alert" sx={{ color: 'red', mt: '8px' }}>
                            {errors.userProvidedHealthCondions.message}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>
              ) : null}
              <Box sx={{ marginX: 'auto', mt: 3 }}>
                <div className="button-wrapper">
                  <button className="button-filled" type="submit">
                    Continue
                  </button>
                  {isHealthConditionsDataEmpty && healthOptions === 'yes' && (
                    <Typography sx={{ color: 'red', mt: '12px' }}>
                      {`Please select your health conditions or choose option 'No' if you do not have any.`}
                    </Typography>
                  )}
                </div>
              </Box>
            </Box>
          </form>
        </Paper>
      </ModalWrapper>
    </Modal>
  );
};
