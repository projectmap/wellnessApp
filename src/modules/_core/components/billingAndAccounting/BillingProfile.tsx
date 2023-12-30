import * as Yup from 'yup';
import moment from 'moment';
import Select from 'react-select';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from 'react';
import { Box, Container } from '@mui/system';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { TextField, Typography, Chip, useMediaQuery } from '@mui/material';

import { GENDER, optionsHealthConditions } from '~/state/constants';
import { UserProfile } from '~/modules/community/UserProfile';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { PrimaryButton } from '~/modules/_core/bits/buttons/PrimaryButton';
import { CommunityFooterLinks } from '~/modules/community/CommunityFooterLinks';
import {
  dynamicBillingStylesForUserProfileFormContainer,
  dynamicBillingStylesForUserProfileInputContainer,
  dynamicBillingStylesForUserProfileInputFieldHolderPassword,
  InvoiceStyles,
  userProfile,
} from '~/modules/_core/styles/BillingAndAccountingStyles';
import {
  SOCIAL_PROVIDER,
  useChangePasswordMutation,
  useCreateUserMeasurementUnitsMutation,
  useCreateUserProfileMutation,
  useGetCurrentUserMeasurementUnitsQuery,
  useGetCurrentUserProfileDetailsQuery,
  useGetProfileQuery,
} from '@newstart-online/sdk';
import 'react-phone-number-input/style.css';

import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import CountryOptions from './CountryOptions';
import SearchGoogleLocation from '~/common-ui/SearchLocation/SearchGoogleLocation';
import { convertCmToFeet } from '~/utils/conversion';

export enum UNITS_FOR_HEIGHT {
  feet = 'feet',
  cm = 'cm',
}

export enum UNITS_FOR_WEIGHT {
  pound = 'pound',
  kilogram = 'kilogram',
}
export enum UNITS_FOR_DISTANCE {
  miles = 'miles',
  kilometer = 'kilometer',
}

interface BillingProfileInput {
  name: string;
  nickname: string;
  gender: string;
  email: string;
  city: string;
  state: string;
  streetAddress: string;
  country: string;
  postCode: string;
  phoneNumber: string;
  birthDate: Date;
  height: string;
  healthConditions: Array<{ label: string; value: string }>;
  license: string;
  weight: string;
  unitForDistance: { value: UNITS_FOR_DISTANCE.kilometer; label: 'Kilometer' };
  unitForHeight: { value: UNITS_FOR_HEIGHT.cm; label: 'CM' };
  unitForWeight: { value: UNITS_FOR_WEIGHT.kilogram; label: 'Kilogram' };
}

interface PasswordChangeInput {
  oldPassword: string;
  newPassword: string;
  rePassword: string;
}

const optionsForHeight = [
  { value: UNITS_FOR_HEIGHT.cm, label: 'CM' },
  { value: UNITS_FOR_HEIGHT.feet, label: 'Feet' },
];
const optionsForWeight = [
  { value: UNITS_FOR_WEIGHT.kilogram, label: 'Kilogram' },
  { value: UNITS_FOR_WEIGHT.pound, label: 'Pound' },
];
const optionsForDistance = [
  { value: UNITS_FOR_DISTANCE.kilometer, label: 'Kilometer' },
  { value: UNITS_FOR_DISTANCE.miles, label: 'Miles' },
];

const BillingProfile = () => {
  const [changePassword] = useChangePasswordMutation();
  const [submitUserHealthInformation] = useCreateUserProfileMutation();

  const { data: profileData } = useGetCurrentUserProfileDetailsQuery();
  const { data: userProfileData } = useGetProfileQuery();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [healthConditionsOptions, setHealthConditionsOptions] = useState(optionsHealthConditions);

  const [showOldAndNewPasswordMatched, setOldAndNewPasswordMatched] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [isPasswordChangeDisabled, setIsPasswordChangeDisabled] = useState(false);

  const { data: currentUserMeasurementUnits } = useGetCurrentUserMeasurementUnitsQuery();

  const [createUserMeasurementUnits] = useCreateUserMeasurementUnitsMutation();

  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
  } = useForm<BillingProfileInput>({ mode: 'onChange' });

  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required('Please enter your new password.')
      .min(8, 'Password needs to be at least 8 characters.')
      .test('passwordRequirements', 'Must contain at least an uppercase, a number & a special character', (value) =>
        [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].every((pattern) => pattern.test(value as string)),
      ),

    rePassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], "Password doesn't match.")
      .required('Please confirm your new password.'),
    oldPassword: Yup.string().required('Please enter your old password.'),
  });

  const {
    register: registerPasswordChange,
    formState: { errors: errorsPasswordChange },
    handleSubmit: hanldeSubmitPasswordChange,
    reset: resetPassword,
  } = useForm<PasswordChangeInput>({ mode: 'onChange', resolver: yupResolver(validationSchema) });

  const handleValidate = (phoneNumber: any) => {
    if (phoneNumber) {
      return isValidPhoneNumber(phoneNumber);
    }
  };

  // collecting form data from the form
  const onSubmit: SubmitHandler<BillingProfileInput> = async (data) => {
    let dataToSubmit: any = {
      ...data,
      nickname: data?.nickname?.trim(),
      healthConditions: data.healthConditions.map((item) => item.label),
      location: {
        city: data?.city?.trim(),
        country: data?.country,
        postCode: data?.postCode,
        state: data?.state?.trim(),
        streetAddress: data?.streetAddress?.trim(),
      },
      height: currentUserMeasurementUnits?.data?.unitForHeight === UNITS_FOR_HEIGHT.cm ? data.height : data.height,
      weight:
        currentUserMeasurementUnits?.data?.unitForWeight === UNITS_FOR_WEIGHT.pound
          ? data.weight
          : (+data.weight * 2.2).toString(),
    };

    if (data.phoneNumber === '') {
      delete dataToSubmit.phoneNumber;
    }
    if (data.gender === '') {
      delete dataToSubmit.gender;
    }
    if (!data.birthDate) {
      delete dataToSubmit.birthDate;
    }

    isDirty &&
      submitUserHealthInformation({
        ...dataToSubmit,
      })
        .unwrap()
        .then(() => {
          toast.success('Information saved successfully');
        })
        .catch((err: any) => {
          toast.error(err.data?.message);
        });
    createUserMeasurementUnits({
      unitForDistance: data.unitForDistance.value,
      unitForWeight: data.unitForWeight.value,
      unitForHeight: data.unitForHeight.value,
    });
  };

  //collect form data for password change
  const onSubmitPasswordChange: SubmitHandler<PasswordChangeInput> = async (data) => {
    if (data?.newPassword !== data?.oldPassword) {
      setOldAndNewPasswordMatched(false);
      setIsPasswordChangeDisabled(true);
      changePassword({ oldPassword: data?.oldPassword, newPassword: data?.newPassword })
        .unwrap()
        .then((data: any) => {
          setTimeout(() => setIsPasswordChangeDisabled(false), 3000);
          toast.success(data?.message);
          resetPassword();
        })
        .catch((error: any) => {
          setTimeout(() => setIsPasswordChangeDisabled(false), 3000);
          toast.error(error?.data?.message);
        });
    } else {
      setOldAndNewPasswordMatched(true);
    }
  };

  const defaultValues = {
    name: userProfileData?.data?.name,
    nickname: profileData?.data?.nickname,
    gender: profileData?.data?.gender,
    email: userProfileData?.data?.email,
    phoneNumber: profileData?.data?.phoneNumber,
    city: profileData?.data?.location?.city,
    state: profileData?.data?.location?.state,
    postCode: profileData?.data?.location?.postCode,
    streetAddress: profileData?.data?.location?.streetAddress,
    country: profileData?.data?.location?.country,
    birthDate: profileData?.data?.birthDate ? moment(profileData?.data?.birthDate).format('YYYY-MM-DD') : null,
    height:
      currentUserMeasurementUnits?.data?.unitForHeight === UNITS_FOR_HEIGHT.cm
        ? profileData?.data?.height
        : convertCmToFeet(+(profileData?.data?.height ?? 0)),
    healthConditions: profileData?.data?.healthConditions?.map((item) => {
      if (!item) {
        return;
      }

      return { label: item, value: item };
    }),
    license: profileData?.data?.medicalLicenseNumber,
    weight:
      currentUserMeasurementUnits?.data?.unitForWeight === UNITS_FOR_WEIGHT.pound
        ? profileData?.data?.weight
        : (+(profileData?.data?.weight ?? 0) * 2.2).toString(),
    unitForDistance: optionsForDistance.find(
      (item) => item.value === currentUserMeasurementUnits?.data?.unitForDistance,
    ),
    unitForWeight: optionsForWeight.find((item) => item.value === currentUserMeasurementUnits?.data?.unitForWeight),
    unitForHeight: optionsForHeight.find((item) => item.value === currentUserMeasurementUnits?.data?.unitForHeight),
  };
  useEffect(() => {
    const healthConditionsKeys = Object.keys(optionsHealthConditions);
    profileData?.data?.healthConditions?.map((item) => {
      if (!healthConditionsKeys.includes(item)) {
        const newOptions = {
          value: item,
          label: item,
        };

        const prevValue = [...healthConditionsOptions];

        prevValue.push(newOptions);

        setHealthConditionsOptions(prevValue);
      }
    });

    reset(defaultValues as any);
  }, [profileData, userProfileData]);

  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      height: 56,
      minHeight: 56,
    }),
  };

  const validateInput = (value: any) => {
    const text = value?.trim();
    if (value === '') {
      return true;
    }
    if (text === '') {
      return text?.length || 'Input cannot be all white spaces';
    } else {
      return !/[!@#$%^&*(),.?":{}|<>]/.test(value) || 'Special characters are not allowed';
    }
  };

  const validateDate = (value: any) => {
    const selected = new Date(value).getFullYear();
    const now = new Date().getFullYear();

    return now - selected >= 18 || 'You must be more than 18 years old.';
  };

  const isDecimalNumber = (value: any) => {
    return /^(?:\d+)?(?:\.\d{1,2})?$/.test(value.toString());
  };

  const matchesSmallTB = useMediaQuery('(max-width:1022px)');
  const dynamicStylesForUserProfileFormContainer = {
    ...(matchesSmallTB && { width: '100%' }),
  };

  const dynamicStylesForUserProfileInputContainer = {
    ...(matchesSmallTB && { ml: 0, mt: '32px' }),
  };

  const dynamicStylesForUserProfileInputFieldHolderPassword = {
    ...(matchesSmallTB && { width: '49%' }),
  };

  return (
    <Container maxWidth="xl" sx={{ mt: '24px' }}>
      <Box sx={{ display: 'flex', flexDirection: `${matchesSmallTB ? 'column' : 'row'}` }}>
        <Box>
          <UserProfile
            showCertificateDownloadOption={true}
            showUserDeactivateButton={true}
            userProfileShowStatus={true}
            showCameraIcon={true}
          />
        </Box>

        <Box sx={dynamicBillingStylesForUserProfileFormContainer(dynamicStylesForUserProfileFormContainer)}>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
            noValidate
            sx={{
              width: '100%',
            }}
          >
            <Box sx={dynamicBillingStylesForUserProfileInputContainer(dynamicStylesForUserProfileInputContainer)}>
              <Typography variant="subtitle1">About Me</Typography>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  mt: '24px',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={userProfile.userProfileInputFieldHolder}>
                  <Typography variant="body1" sx={{ mb: '3px' }}>
                    Name
                  </Typography>
                  <TextField
                    disabled={userProfileData?.data?.name ? true : false}
                    type="text"
                    {...register('name', {
                      required: { value: false, message: 'Please enter your name' },
                    })}
                    sx={userProfile.userProfileInputField}
                    style={{
                      border: errors.name?.message ? '1px solid #F81E1E' : '1px solid #b8b8c3',
                      backgroundColor: userProfileData?.data?.name ? '#E7E7EB' : '#FFFF',
                    }}
                  />

                  {errors.name && errors.name.type === 'required' && (
                    <Typography role="alert" sx={userProfile.errorMsg}>
                      {errors.name.message}
                    </Typography>
                  )}
                </Box>
                {/* Todo :This section is removed temporarily. */}
                {/* <Box sx={userProfile.userProfileInputFieldHolder}>
                  <Typography variant="body1" sx={{ mb: '3px' }}>
                    Display Name
                  </Typography>
                  <TextField
                    type="text"
                    placeholder="Enter your display name. "
                    {...register('nickname', {
                      required: { value: false, message: 'Please enter your display name' },
                      validate: validateInput,
                    })}
                    sx={userProfile.userProfileInputField}
                    style={{ border: errors.nickname?.message ? '1px solid #F81E1E' : '1px solid #b8b8c3' }}
                  />
                  {errors.nickname && (
                    <Typography role="alert" sx={userProfile.errorMsg}>
                      {errors.nickname.message}
                    </Typography>
                  )}
                </Box> */}
                <Box sx={{ width: '49%', height: '56px', position: 'relative' }}>
                  <Typography variant="body1" sx={{ mb: '3px' }}>
                    Gender
                  </Typography>

                  <select
                    {...register('gender', {
                      required: { value: false, message: 'Please enter your gender.' },
                    })}
                    style={{
                      width: '100%',
                      height: '56px',
                      outline: 'none',
                      backgroundColor: '#FFFF',
                      borderRadius: '4px',
                      fontSize: '16px',
                      textIndent: '12px',
                      textTransform: 'capitalize',
                      border: errors.gender?.message ? '1px solid #F81E1E' : '1px solid #b8b8c3',
                    }}
                  >
                    <option style={{ textTransform: 'capitalize' }} value="" disabled selected hidden>
                      Select your gender
                    </option>
                    <option style={{ textTransform: 'capitalize' }} value={GENDER.FEMALE}>
                      {GENDER.FEMALE}
                    </option>
                    <option style={{ textTransform: 'capitalize' }} value={GENDER.MALE}>
                      {GENDER.MALE}
                    </option>
                    <option style={{ textTransform: 'capitalize' }} value={GENDER.PREFER_NOT_SAY}>
                      {GENDER.PREFER_NOT_SAY}
                    </option>
                  </select>
                  {errors.gender && errors.gender.type === 'required' && (
                    <Typography role="alert" sx={userProfile.errorMsgGender}>
                      {errors.gender.message}
                    </Typography>
                  )}
                </Box>

                <Box sx={userProfile.userProfileInputFieldHolder}>
                  <Typography variant="body1" sx={{ mb: '3px' }}>
                    Birthday
                  </Typography>
                  <TextField
                    type="date"
                    placeholder="Enter your birthdate. "
                    {...register('birthDate', {
                      required: { value: false, message: 'Please enter your birthdate' },
                      validate: validateDate,
                    })}
                    sx={userProfile.userProfileInputField}
                    style={{ border: errors.birthDate?.message ? '1px solid #F81E1E' : '1px solid #b8b8c3' }}
                  />
                  {errors.birthDate && (
                    <Typography role="alert" sx={userProfile.errorMsg}>
                      {errors.birthDate.message}
                    </Typography>
                  )}
                </Box>
                {profileData?.data?.medicalLicenseNumber && (
                  <Box sx={userProfile.userProfileInputFieldHolder}>
                    <Typography variant="body1" sx={{ mb: '3px' }}>
                      Nursing License Number
                    </Typography>
                    <TextField
                      disabled={profileData?.data?.medicalLicenseNumber ? true : false}
                      type="text"
                      placeholder="Enter your license number. "
                      {...register('license', {
                        required: { value: true, message: 'Please enter your license number' },
                      })}
                      sx={userProfile.userProfileInputField}
                      style={{
                        border: errors.license?.message ? '1px solid #F81E1E' : '1px solid #b8b8c3',
                        backgroundColor: profileData?.data?.medicalLicenseNumber ? '#E7E7EB' : '#FFFF',
                      }}
                    />
                    {errors.license && errors.license.type === 'required' && (
                      <Typography role="alert" sx={userProfile.errorMsg}>
                        {errors.license.message}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>

              <Typography variant="subtitle1">Contact Info</Typography>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  mt: '24px',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={userProfile.userProfileInputFieldHolder}>
                  <Typography variant="body1" sx={{ mb: '3px' }}>
                    Email
                  </Typography>
                  <TextField
                    disabled={userProfileData?.data?.email ? true : false}
                    type="email"
                    placeholder="Enter your e-mail. "
                    {...register('email', {
                      required: { value: false, message: 'Please enter your email' },
                    })}
                    sx={userProfile.userProfileInputField}
                    style={{
                      border: errors.email?.message ? '1px solid #F81E1E' : '1px solid #b8b8c3',
                      backgroundColor: userProfileData?.data?.email ? '#E7E7EB' : '#FFFF',
                    }}
                  />
                  {errors.email && errors.email.type === 'required' && (
                    <Typography role="alert" sx={userProfile.errorMsg}>
                      {errors.email.message}
                    </Typography>
                  )}
                </Box>
                <Box sx={userProfile.userProfileInputFieldHolder}>
                  <Typography variant="body1" sx={{ mb: '3px' }}>
                    Phone
                  </Typography>
                  <Controller
                    name="phoneNumber"
                    control={control}
                    rules={{
                      validate: (value) => handleValidate(value),
                    }}
                    render={({ field: { onChange, value } }) => (
                      <PhoneInput
                        value={value}
                        onChange={onChange}
                        defaultCountry={'US'}
                        placeHolder={'Add your phone number'}
                        id="phoneNumber"
                        style={{
                          border: errors.phoneNumber?.message ? '1px solid #F81E1E' : '1px solid #b8b8c3',
                          backgroundColor: profileData?.data?.phoneNumber ? '#E7E7EB' : '#FFFF',
                          padding: '16.5px 14px',
                          borderRadius: '4px',
                          fontSize: '20px',
                        }}
                      />
                    )}
                  />
                  {watch('phoneNumber') && !handleValidate(watch('phoneNumber')) && (
                    <Typography role="alert" sx={userProfile.errorMsg}>
                      {'Phone number is invalid'}
                    </Typography>
                  )}
                </Box>
                <SearchGoogleLocation
                  handleAddressChange={(area: string, city: string, state: string, zip: string, country: string) => {
                    setValue('streetAddress', area);
                    setValue('city', city);
                    setValue('state', state);
                    setValue('postCode', zip);
                    setValue('country', country);
                  }}
                  label="Search Location"
                />
                <Box sx={userProfile.userProfileInputFieldHolder}>
                  <Typography variant="body1" sx={{ mb: '3px' }}>
                    Street Address
                  </Typography>
                  <TextField
                    type="text"
                    placeholder="Enter your street address. "
                    {...register('streetAddress', {
                      required: { value: false, message: 'Please enter street address' },
                      validate: validateInput,
                    })}
                    sx={userProfile.userProfileInputField}
                    style={{ border: errors.streetAddress?.message ? '1px solid #F81E1E' : '1px solid #b8b8c3' }}
                  />
                  {errors.streetAddress && (
                    <Typography role="alert" sx={userProfile.errorMsg}>
                      {errors.streetAddress.message}
                    </Typography>
                  )}
                </Box>

                <Box sx={userProfile.userProfileInputFieldHolder}>
                  <Typography variant="body1" sx={{ mb: '3px' }}>
                    City
                  </Typography>
                  <TextField
                    type="city"
                    placeholder="Enter your city. "
                    {...register('city', {
                      required: { value: false, message: 'Please enter your city.' },

                      validate: validateInput,
                    })}
                    sx={userProfile.userProfileInputField}
                    style={{ border: errors.city?.message ? '1px solid #F81E1E' : '1px solid #b8b8c3' }}
                  />
                  {errors.city && (
                    <Typography role="alert" sx={userProfile.errorMsg}>
                      {errors.city.message}
                    </Typography>
                  )}
                </Box>

                <Box sx={userProfile.userProfileInputFieldHolder}>
                  <Typography variant="body1" sx={{ mb: '3px' }}>
                    State
                  </Typography>
                  <TextField
                    type="text"
                    placeholder="Enter your state. "
                    {...register('state', {
                      required: { value: false, message: 'Please enter your state' },
                      validate: validateInput,
                    })}
                    sx={userProfile.userProfileInputField}
                    style={{ border: errors.state?.message ? '1px solid #F81E1E' : '1px solid #b8b8c3' }}
                  />
                  {errors.state && (
                    <Typography role="alert" sx={userProfile.errorMsg}>
                      {errors.state.message}
                    </Typography>
                  )}
                </Box>

                <Box sx={userProfile.userProfileInputFieldHolder}>
                  <Typography variant="body1" sx={{ mb: '3px' }}>
                    Post Code
                  </Typography>
                  <TextField
                    type="number"
                    placeholder="Enter your postal code. "
                    {...register('postCode', {
                      required: { value: false, message: 'Please enter your postal code' },
                    })}
                    sx={userProfile.userProfileInputField}
                    style={{ border: errors.postCode?.message ? '1px solid #F81E1E' : '1px solid #b8b8c3' }}
                  />
                  {errors.postCode && errors.postCode.type === 'required' && (
                    <Typography role="alert" sx={userProfile.errorMsg}>
                      {errors.postCode.message}
                    </Typography>
                  )}
                </Box>

                <Box sx={userProfile.userProfileInputFieldHolder}>
                  <Typography variant="body1" sx={{ mb: '3px' }}>
                    Country
                  </Typography>

                  <select
                    placeholder="Please enter your country"
                    defaultValue={profileData?.data?.location?.country ? profileData?.data?.location?.country : 'US'}
                    {...register('country', {
                      required: { value: false, message: 'Please enter your country.' },
                    })}
                    style={{
                      width: '100%',
                      height: '56px',
                      outline: 'none',
                      backgroundColor: '#FFFF',
                      borderRadius: '4px',
                      fontSize: '16px',
                      textIndent: '12px',
                      textTransform: 'capitalize',
                      border: errors.country?.message ? '1px solid #F81E1E' : '1px solid #b8b8c3',
                    }}
                    id="country"
                    name="country"
                  >
                    <CountryOptions />
                  </select>
                </Box>
              </Box>

              <Typography variant="subtitle1">Measurements</Typography>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  mt: '24px',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={userProfile.userProfileInputFieldHolder}>
                  <Typography variant="body1" sx={{ mb: '3px' }}>
                    Height ({currentUserMeasurementUnits?.data?.unitForHeight})
                  </Typography>
                  <TextField
                    type="number"
                    placeholder="Enter your height in cm. "
                    {...register('height', {
                      required: { value: false, message: 'Please enter your height in cm' },
                      min: { value: 20, message: 'Must be more than 20 cm' },
                      max: { value: 300, message: 'Must be less than 300 cm' },
                      validate: (value) => isDecimalNumber(value) || 'Enter a value upto two decimal places.',
                    })}
                    sx={userProfile.userProfileInputField}
                    style={{ border: errors.height?.message ? '1px solid #F81E1E' : '1px solid #b8b8c3' }}
                  />
                  {errors.height && (
                    <Typography role="alert" sx={userProfile.errorMsg}>
                      {errors.height.message}
                    </Typography>
                  )}
                </Box>
                <Box sx={userProfile.userProfileInputFieldHolder}>
                  <Typography variant="body1" sx={{ mb: '3px' }}>
                    Weight ({currentUserMeasurementUnits?.data?.unitForWeight})
                  </Typography>
                  <TextField
                    type="number"
                    placeholder="Enter your weight in pound. "
                    {...register('weight', {
                      required: { value: false, message: 'Please enter your weight in pound' },
                      min: { value: 30, message: 'Must be more than 30 pound' },
                      max: { value: 1000, message: 'Must be less than 1000 pound' },
                      validate: (value) => isDecimalNumber(value) || 'Enter a value upto two decimal places.',
                    })}
                    sx={userProfile.userProfileInputField}
                    style={{ border: errors.weight?.message ? '1px solid #F81E1E' : '1px solid #b8b8c3' }}
                  />
                  {errors.weight && (
                    <Typography role="alert" sx={userProfile.errorMsg}>
                      {errors.weight.message}
                    </Typography>
                  )}
                </Box>
                <Box sx={userProfile.healthConditionContainer}>
                  <Typography variant="body1" sx={{ mb: '3px' }}>
                    Health Conditions
                  </Typography>

                  <Controller
                    name="healthConditions"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        value={value}
                        isMulti
                        name="healthConditions"
                        options={optionsHealthConditions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        styles={customStyles}
                        onChange={onChange}
                      />
                    )}
                  />
                </Box>
              </Box>

              <Typography variant="subtitle1" sx={{ mt: '24px' }}>
                Preference Units
              </Typography>

              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  mt: '24px',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={userProfile.healthConditionContainer}>
                  <Typography variant="body1" sx={{ mb: '3px' }}>
                    Height
                  </Typography>

                  <Controller
                    name="unitForHeight"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        value={value}
                        name="unitForHeight"
                        options={optionsForHeight as []}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        styles={customStyles}
                        onChange={onChange}
                      />
                    )}
                  />
                </Box>

                <Box sx={userProfile.healthConditionContainer}>
                  <Typography variant="body1" sx={{ mb: '3px' }}>
                    Weight
                  </Typography>

                  <Controller
                    name="unitForWeight"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        value={value}
                        name="unitForWeight"
                        options={optionsForWeight as []}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        styles={customStyles}
                        onChange={onChange}
                      />
                    )}
                  />
                </Box>

                <Box sx={userProfile.healthConditionContainer}>
                  <Typography variant="body1" sx={{ mb: '3px', mt: '3px' }}>
                    Distance
                  </Typography>

                  <Controller
                    name="unitForDistance"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        value={value}
                        name="unitForDistance"
                        options={optionsForDistance as []}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        styles={customStyles}
                        onChange={onChange}
                      />
                    )}
                  />
                </Box>
              </Box>

              <Box sx={{ width: '100%' }}>
                <PrimaryButton
                  disabled={!isDirty}
                  type="submit"
                  sx={{ p: '16px 71px', borderRadius: '50px', mt: '34px' }}
                >
                  Save
                </PrimaryButton>
              </Box>
            </Box>
          </Box>
          {/* don't show this field if the user has logged in with google account because we don't need to change password for Login with Google */}
          {userProfileData?.data?.socialProvider !== SOCIAL_PROVIDER.GOOGLE &&
            userProfileData?.data?.socialProvider !== SOCIAL_PROVIDER.APPLE && (
              <Box sx={userProfile.userProfileFormContainerPassword}>
                <Box
                  component="form"
                  onSubmit={hanldeSubmitPasswordChange(onSubmitPasswordChange)}
                  autoComplete="off"
                  noValidate
                  sx={{
                    width: '100%',
                  }}
                >
                  <Box sx={dynamicBillingStylesForUserProfileInputContainer(dynamicStylesForUserProfileInputContainer)}>
                    <Typography variant="h6" sx={{ width: '100%', mb: '10px', mt: '42px' }}>
                      Change your Password
                    </Typography>
                    <Box
                      sx={dynamicBillingStylesForUserProfileInputFieldHolderPassword(
                        dynamicStylesForUserProfileInputFieldHolderPassword,
                      )}
                    >
                      <Typography variant="body1" sx={{ mb: '3px' }}>
                        Old Password
                      </Typography>
                      <Box sx={{ display: 'flex', position: 'relative' }}>
                        <TextField
                          type={showOldPassword ? 'text' : 'password'}
                          placeholder="Enter your old password "
                          maxLength={35}
                          {...registerPasswordChange('oldPassword', {
                            required: { value: true, message: 'Please enter your old password' },
                          })}
                          sx={userProfile.userProfileInputField}
                          inputProps={{ maxLength: 35 }}
                          style={{
                            border: errorsPasswordChange.oldPassword?.message
                              ? '1px solid #F81E1E'
                              : '1px solid #b8b8c3',
                          }}
                        />
                        <Box sx={{ position: 'absolute', right: '8px', top: '20%' }}>
                          {showOldPassword ? (
                            <VisibilityIcon
                              onClick={() => setShowOldPassword(!showOldPassword)}
                              sx={{
                                color: ' #09121F',
                                opacity: '0.5',
                                cursor: 'pointer',
                              }}
                            />
                          ) : (
                            <VisibilityOffIcon
                              onClick={() => setShowOldPassword(!showOldPassword)}
                              sx={{
                                color: ' #09121F',
                                opacity: '0.5',
                                cursor: 'pointer',
                              }}
                            />
                          )}
                        </Box>
                      </Box>

                      <Box sx={{ position: 'absolute', left: 0, bottom: '7px', height: '24px' }}>
                        <Typography role="alert" sx={{ color: 'error.main' }}>
                          {errorsPasswordChange.oldPassword && errorsPasswordChange.oldPassword.message}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={dynamicBillingStylesForUserProfileInputFieldHolderPassword(
                        dynamicStylesForUserProfileInputFieldHolderPassword,
                      )}
                    >
                      <Typography variant="body1" sx={{ mb: '3px' }}>
                        New Password
                      </Typography>
                      <Box sx={{ display: 'flex', position: 'relative' }}>
                        <TextField
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your new password "
                          maxLength={35}
                          {...registerPasswordChange('newPassword', {
                            required: { value: true, message: 'Please enter your new password' },
                          })}
                          sx={userProfile.userProfileInputField}
                          inputProps={{ maxLength: 35 }}
                          style={{
                            border: errorsPasswordChange.newPassword?.message
                              ? '1px solid #F81E1E'
                              : '1px solid #b8b8c3',
                          }}
                        />

                        <Box sx={{ position: 'absolute', right: '8px', top: '20%' }}>
                          {showPassword ? (
                            <VisibilityIcon
                              onClick={() => setShowPassword(!showPassword)}
                              sx={{
                                color: ' #09121F',
                                opacity: '0.5',
                                cursor: 'pointer',
                              }}
                            />
                          ) : (
                            <VisibilityOffIcon
                              onClick={() => setShowPassword(!showPassword)}
                              sx={{
                                color: ' #09121F',
                                opacity: '0.5',
                                cursor: 'pointer',
                              }}
                            />
                          )}
                        </Box>
                      </Box>

                      <Box sx={{ position: 'absolute', left: 0, bottom: '7px', height: '24px' }}>
                        <Typography role="alert" sx={{ color: 'error.main' }}>
                          {errorsPasswordChange.newPassword && errorsPasswordChange.newPassword.message}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={dynamicBillingStylesForUserProfileInputFieldHolderPassword(
                        dynamicStylesForUserProfileInputFieldHolderPassword,
                      )}
                    >
                      <Typography variant="body1" sx={{ mb: '3px' }}>
                        Re-enter password
                      </Typography>
                      <Box sx={{ display: 'flex', position: 'relative' }}>
                        <TextField
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Re-enter your new password "
                          {...registerPasswordChange('rePassword', {
                            required: { value: true, message: 'Please confirm your new password' },
                          })}
                          sx={userProfile.userProfileInputField}
                          inputProps={{ maxLength: 35 }}
                          style={{
                            border: errorsPasswordChange.rePassword?.message
                              ? '1px solid #F81E1E'
                              : '1px solid #b8b8c3',
                          }}
                        />
                        <Box sx={{ position: 'absolute', right: '8px', top: '20%' }}>
                          {showConfirmPassword ? (
                            <VisibilityIcon
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              sx={{
                                color: ' #09121F',
                                opacity: '0.5',
                                cursor: 'pointer',
                              }}
                            />
                          ) : (
                            <VisibilityOffIcon
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              sx={{
                                color: ' #09121F',
                                opacity: '0.5',
                                cursor: 'pointer',
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                      <Box sx={{ position: 'absolute', left: 0, bottom: '7px', height: '24px' }}>
                        <Typography role="alert" sx={{ color: 'error.main' }}>
                          {errorsPasswordChange.rePassword && errorsPasswordChange.rePassword.message}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <PrimaryButton
                    disabled={isPasswordChangeDisabled}
                    type="submit"
                    sx={{ p: '16px 71px', borderRadius: '50px', mt: '34px', ml: '27px' }}
                  >
                    Confirm Password Change
                  </PrimaryButton>
                  <Box sx={{ position: 'relative', ml: '27px' }}>
                    {showOldAndNewPasswordMatched && (
                      <Typography role="alert" className="error-msg" sx={userProfile.errorMessageOldNewPasswordSame}>
                        You can not make old and new password same.
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            )}
        </Box>
      </Box>
      <Box sx={InvoiceStyles.footerContainer}>
        <CommunityFooterLinks />
      </Box>
    </Container>
  );
};

export default BillingProfile;
