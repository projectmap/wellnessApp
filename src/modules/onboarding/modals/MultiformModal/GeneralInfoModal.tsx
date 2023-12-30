/* eslint-disable no-case-declarations */
import * as yup from 'yup';
import moment from 'moment';
import { Box } from '@mui/system';
import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button, MobileStepper, Modal, Paper, Typography, useMediaQuery } from '@mui/material';

import { ModalWrapper } from '../styles/ModalWrapper';
import { useAppDispatch, useAppSelector } from '~/state/app/hooks';
import { FemaleSignIcon, MaleSignIcon, OtherGenderIcon } from '~/icons';
import { IMultiFormModalInputs } from './MuiltiformModalInputs.interface';
import { GENDER, USER_MINIMUM_AGE_DIFFERENCE, USER_ONBOARDING_STEPS } from '~/state/constants';
import { setActiveStepInMultiForm, setUserOnboardingLocation } from '~/state/services/onboarding/onboardingSlice';
import {
  IUserProfileResponse,
  UNITS_FOR_DISTANCE,
  UNITS_FOR_WEIGHT,
  useCreateUserProfileMutation,
  useUpdateUserByTokenMutation,
} from '@newstart-online/sdk';
import { LoadingBtn } from '~/modules/_core/bits/buttons/LoadingBtn';
import { convertCmToFeet, convertFeetToCm } from '~/utils/conversion';
import { UNITS_FOR_HEIGHT } from '~/modules/_core/components/billingAndAccounting/BillingProfile';

const GenderTypeData = [
  {
    type: GENDER.MALE,
    icon: <MaleSignIcon />,
    id: 1,
  },
  {
    type: GENDER.FEMALE,
    icon: <FemaleSignIcon />,
    id: 2,
  },
  {
    type: GENDER.PREFER_NOT_SAY,
    icon: <OtherGenderIcon />,
    id: 3,
  },
];

type IProps = {
  userProfile: IUserProfileResponse | undefined;
};

// generic into modal
export const GeneralInfoModal: React.FC<IProps> = ({ userProfile }) => {
  const [weightMeasureUnit, setWeightMeasureUnit] = useState<UNITS_FOR_WEIGHT>(UNITS_FOR_WEIGHT.pound);
  const [heightMeasureUnit, setHeightMeasureUnit] = useState<UNITS_FOR_HEIGHT>(UNITS_FOR_HEIGHT.cm);
  const [weightValue, setWeightValue] = useState<number>();
  const [heightValue, setHeightValue] = useState<number | null>();
  const [heightFeetValue, setHeightFeetValue] = useState<number | null>();
  const [heightInchValue, setHeightInchValue] = useState<number | null>();

  const [ageValue, setAgeValue] = useState<string>();
  const [openMultiForm, setOpenMultiForms] = useState(useAppSelector((state) => state.onboarding.openMultiForm));

  const activeStep = useAppSelector((state) => state.onboarding.activeStep);
  const matchesLG = useMediaQuery('(max-height:900px)');

  const dispatch = useAppDispatch();

  const [maxMinWeightValue, setMaxWeightValue] = useState({
    maxWeightValue: weightMeasureUnit === UNITS_FOR_WEIGHT.pound ? 1000 : 453.59,
    minWeightValue: weightMeasureUnit === UNITS_FOR_WEIGHT.pound ? 30 : 13.6,
  });

  useEffect(() => {
    weightMeasureUnit === UNITS_FOR_WEIGHT.pound && setMaxWeightValue({ maxWeightValue: 1000, minWeightValue: 30 });
    weightMeasureUnit === UNITS_FOR_WEIGHT.kilogram &&
      setMaxWeightValue({ maxWeightValue: 453.59, minWeightValue: 13.6 });
  }, [weightMeasureUnit]);

  useEffect(() => {
    if (userProfile && userProfile.data === null) {
      setOpenMultiForms(true);
      dispatch(setUserOnboardingLocation(false));
    }
  }, [userProfile]);

  const [submitUserGeneralInformation, isLoading] = useCreateUserProfileMutation(); //to create user profile
  const [updateUser] = useUpdateUserByTokenMutation();
  const schema = yup
    .object()
    .shape({
      weight: yup
        .number()
        .typeError('Weight cannot be empty')
        .positive('Weight cannot be negative or zero.')
        .max(
          maxMinWeightValue.maxWeightValue,
          `Must be less than ${maxMinWeightValue.maxWeightValue} ${weightMeasureUnit}`,
        )
        .min(
          maxMinWeightValue.minWeightValue,
          `Must be more than ${maxMinWeightValue.minWeightValue} ${weightMeasureUnit}`,
        ),
      height: yup
        .number()
        .typeError('Height cannot be empty')
        .positive('Height cannot be negative or zero.')
        .max(300, `Must be less than 300 cm`)
        .min(60, `Must be more than 60 cm`),
      age: yup.string().typeError('Age cannot be empty').required('Age is required'),
      gender: yup.string().typeError('Gender selection is required').required(),
    })
    .required();

  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    setValue,
    clearErrors,
    watch,
    control,
  } = useForm<IMultiFormModalInputs>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const handleBack = () => {};

  // function that converts the user input for height and weight from one unit to another with their respective value chages
  const changeMeasureValuesOnButtonPress = (measureUnit: string) => {
    switch (measureUnit) {
      case UNITS_FOR_WEIGHT.kilogram:
        if (weightMeasureUnit !== UNITS_FOR_WEIGHT.kilogram) {
          setValue('weight', Number((weightValue as number) / 2.2));
          setWeightValue(getValues('weight'));
        }
        clearErrors('weight');

        break;
      case UNITS_FOR_WEIGHT.pound:
        if (weightMeasureUnit !== UNITS_FOR_WEIGHT.pound) {
          setWeightValue(Number(watch('weight') * 2.2));
        }
        clearErrors('weight');

        break;
      case UNITS_FOR_HEIGHT.cm:
        let heightInCm = convertFeetToCm(heightFeetValue ?? 0, heightInchValue ?? 0);
        if (heightInCm) {
          setValue('height', heightInCm);
        }
        if (getValues('height')) {
          setHeightValue(getValues('height'));
        } else {
          setHeightValue(null);
        }
        clearErrors('height');

        break;
      case UNITS_FOR_HEIGHT.feet:
        const { feetValue, inchValue } = convertCmToFeet(heightValue ?? 0);
        if (feetValue) {
          setHeightFeetValue(feetValue ?? null);
        } else {
          setHeightFeetValue(null);
        }

        if (inchValue) {
          setHeightInchValue(inchValue ?? null);
        } else {
          setHeightInchValue(null);
        }
        clearErrors('height');

        break;
      default:
    }
  };

  const onSubmit: SubmitHandler<IMultiFormModalInputs> = async (data) => {
    // to get exact number of years from the calender picker
    const ageToBeSavedtoDB = moment(new Date(ageValue as string)).fromNow();
    const weightInPound =
      weightMeasureUnit === UNITS_FOR_WEIGHT.kilogram ? Number((data?.weight as number) * 2.2) : weightValue;
    const heightValueInCM = heightValue;

    submitUserGeneralInformation({
      ...data,
      weight: String(weightInPound).slice(0, 6), //send converted weight and height upto 2 decimal places only
      height: String(heightValueInCM).slice(0, 6),
      age: ageToBeSavedtoDB,
      birthDate: data?.age,
      unitForHeight: heightMeasureUnit,
      unitForWeight: weightMeasureUnit,
      unitForDistance: UNITS_FOR_DISTANCE.kilometer,
    })
      .unwrap()
      .then(() => {
        toast.success('Information saved successfully');
        updateUser({ isFirstLogin: false });
        dispatch(setActiveStepInMultiForm(USER_ONBOARDING_STEPS.HEALTH_INFO));
      })
      .catch((err) => {
        toast.error(err.data?.message);
      });
  };

  const maxAge = moment().subtract(USER_MINIMUM_AGE_DIFFERENCE.MIN, 'years').format('YYYY-MM-DD');
  const minAge = moment().subtract(USER_MINIMUM_AGE_DIFFERENCE.MAX, 'years').format('YYYY-MM-DD');

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

          <Box>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box
                sx={{ overflowY: `${matchesLG ? 'scroll' : 'hidden'}`, height: `${matchesLG ? '350px' : ''}`, p: 4 }}
              >
                <Typography variant="h5" sx={{ pb: 3 }}>
                  About me
                </Typography>
                <Typography variant="subtitle1" sx={{ pb: 2 }}>
                  Gender
                </Typography>
                <input type="text" />
                <Box sx={{ display: 'flex', alignContent: 'center' }}>
                  {GenderTypeData.map((gender) => {
                    return (
                      <Box key={gender.id} className="">
                        <label
                          htmlFor="gender"
                          className={`${watch('gender') === gender.type ? 'gender-label-selected' : 'gender-label'} `}
                        >
                          {gender.icon}
                          <input {...register('gender')} type="radio" value={gender.type} className="gender" />

                          {gender.type}
                        </label>
                      </Box>
                    );
                  })}
                </Box>
                <span role="alert" style={{ color: '#F81E1E', marginTop: '8px', display: 'block' }}>
                  {errors.gender && errors.gender.message}
                </span>
                <Box>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, mb: 2 }}>
                      <Typography variant="subtitle1">Weight</Typography>
                      <Box>
                        <div className="onboarding-info-unit-btn">
                          <button
                            className={` ${weightMeasureUnit === UNITS_FOR_WEIGHT.pound ? 'selected' : 'unit_btn'}`}
                            onClick={() => {
                              setWeightMeasureUnit(UNITS_FOR_WEIGHT.pound);
                              changeMeasureValuesOnButtonPress(UNITS_FOR_WEIGHT.pound);
                            }}
                            type="button"
                          >
                            Pound
                          </button>
                          <button
                            className={` ${weightMeasureUnit === UNITS_FOR_WEIGHT.kilogram ? 'selected' : 'unit_btn'}`}
                            onClick={() => {
                              setWeightMeasureUnit(UNITS_FOR_WEIGHT.kilogram);
                              changeMeasureValuesOnButtonPress(UNITS_FOR_WEIGHT.kilogram);
                            }}
                            type="button"
                          >
                            KG
                          </button>
                        </div>
                      </Box>
                    </Box>
                    <input
                      type="number"
                      {...register('weight', {
                        required: { value: true, message: 'Please enter a valid weight' },
                      })}
                      onChange={(e: any) => {
                        setWeightValue(+e.target.value);
                        clearErrors('weight');
                      }}
                      placeholder="Please enter your weight"
                      value={(weightValue && +weightValue?.toFixed(2)) as number}
                      step="0.01"
                      style={{ border: errors.weight?.message ? '1px solid #F81E1E' : '1px solid #b8b8c3' }}
                      className="onboarding_input"
                    />
                    <span role="alert" style={{ color: '#F81E1E', marginTop: '8px', display: 'block' }}>
                      {errors.weight && errors.weight.message}
                    </span>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, mb: 2 }}>
                      <Typography variant="subtitle1">Height</Typography>
                      <Box>
                        <div className="onboarding-info-unit-btn">
                          <button
                            className={` ${heightMeasureUnit === UNITS_FOR_HEIGHT.feet ? 'selected' : 'unit_btn'}`}
                            onClick={() => {
                              setHeightMeasureUnit(UNITS_FOR_HEIGHT.feet);
                              changeMeasureValuesOnButtonPress(UNITS_FOR_HEIGHT.feet);
                            }}
                            type="button"
                          >
                            Feet
                          </button>
                          <button
                            className={` ${heightMeasureUnit === UNITS_FOR_HEIGHT.cm ? 'selected' : 'unit_btn'}`}
                            onClick={() => {
                              setHeightMeasureUnit(UNITS_FOR_HEIGHT.cm);
                              changeMeasureValuesOnButtonPress(UNITS_FOR_HEIGHT.cm);
                            }}
                            type="button"
                          >
                            CM
                          </button>
                        </div>
                      </Box>
                    </Box>
                    {heightMeasureUnit === UNITS_FOR_HEIGHT.cm && (
                      <>
                        <input
                          type="number"
                          {...register('height', {
                            required: { value: true, message: 'Please enter a valid height' },
                            valueAsNumber: true,
                          })}
                          style={{ border: errors.height?.message ? '1px solid #F81E1E' : '1px solid #b8b8c3' }}
                          className="onboarding_input"
                          onChange={(e: any) => {
                            if (+e.target.value) {
                              setHeightValue(+e.target.value);
                            } else {
                              setHeightValue(null);
                            }
                            clearErrors('height');
                          }}
                          value={(heightValue && +heightValue?.toFixed(2)) as number}
                          step="0.01"
                          placeholder="Please enter your height"
                        />
                        <span role="alert" style={{ color: '#F81E1E', marginTop: '8px', display: 'block' }}>
                          {errors.height && errors.height.message}
                        </span>
                      </>
                    )}

                    {heightMeasureUnit === UNITS_FOR_HEIGHT.feet && (
                      <Box display="flex" gap={2}>
                        <Box>
                          <input
                            type="number"
                            className="onboarding_input"
                            name="height-feet"
                            onChange={(e: any) => {
                              if (e.target.value) {
                                setHeightFeetValue(+e.target.value);
                                const height = convertFeetToCm(+e.target.value, heightInchValue ?? 0);
                                setValue('height', height);
                              } else {
                                setHeightFeetValue(null);
                              }
                            }}
                            value={(heightFeetValue && +heightFeetValue?.toFixed(2)) as number}
                            step="0.01"
                            placeholder="Please enter feet"
                          />
                          {errors.height && errors.height.message && (
                            <span role="alert" style={{ color: '#F81E1E', marginTop: '8px', display: 'block' }}>
                              {heightFeetValue && heightFeetValue > 10
                                ? 'Cannot be greater than 10 feet'
                                : heightFeetValue && heightFeetValue >= 2
                                ? null
                                : 'Should be atleast 2ft'}
                            </span>
                          )}
                        </Box>

                        <Box>
                          <input
                            type="number"
                            className="onboarding_input"
                            name="height-inch"
                            onChange={(e: any) => {
                              if (e.target.value) {
                                setHeightInchValue(+e.target.value);
                                const height = convertFeetToCm(heightFeetValue ?? 0, +e.target.value);
                                setValue('height', height);
                              } else {
                                setHeightInchValue(null);
                              }
                            }}
                            value={(heightInchValue && +heightInchValue?.toFixed(2)) as number}
                            step="0.01"
                            placeholder="Please enter inch"
                          />
                          <span role="alert" style={{ color: '#F81E1E', marginTop: '8px', display: 'block' }}>
                            {heightInchValue && heightInchValue > 11 ? 'Cannot be greater than 11 inch' : null}
                          </span>
                        </Box>
                      </Box>
                    )}
                  </Box>
                  <Typography variant="subtitle1" sx={{ pt: 3, pb: 2 }}>
                    Birth Date
                  </Typography>
                  <input
                    type="date"
                    {...register('age', {
                      required: { value: true, message: 'Please enter a valid age' },
                    })}
                    className="onboarding_input"
                    value={ageValue}
                    max={maxAge}
                    min={minAge}
                    onChange={(e: any) => {
                      setAgeValue(e.target.value);
                      clearErrors('age');
                    }}
                    style={{ border: errors.age?.message ? '1px solid #F81E1E' : '1px solid #b8b8c3' }}
                  />
                  <span role="alert" style={{ color: '#F81E1E', marginTop: '8px', display: 'block' }}>
                    {errors.age && errors.age.message}
                  </span>
                </Box>

                <Box sx={{ marginX: 'auto', mt: 3 }}>
                  <div className="button-wrapper">
                    <LoadingBtn sx={{ borderRadius: '30px', width: '176px' }} loading={isLoading?.isLoading}>
                      Continue
                    </LoadingBtn>
                  </div>
                </Box>
              </Box>
            </form>
          </Box>
        </Paper>
      </ModalWrapper>
    </Modal>
  );
};
