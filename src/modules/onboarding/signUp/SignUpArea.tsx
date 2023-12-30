import Image from 'next/image';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Container } from '@mui/system';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Link, Typography } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast, ToastContainer } from 'react-toastify';
import { useForm, SubmitHandler } from 'react-hook-form';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { ROUTE } from '~/config/routes';
import BgWrapperOnboarding from './bgWrapper';
import { useSignUpMutation } from '@newstart-online/sdk';
import { LoadingBtn } from '~/modules/_core/bits/buttons/LoadingBtn';
import { SignUpPageWrapper } from '~/modules/onboarding/signUp/SingUpPageWrapper';
import { FooterOnboarding } from '~/modules/onboarding/footer/FooterOnboardingArea';
import { SocialOnboardingLinks } from '~/modules/onboarding/socialOnboarding/socialOnboardingLinks';

interface IFormInputs {
  name: string;
  email: string;
  password: string;
  repassword: string;
}

export const SignUpArea = () => {
  const router = useRouter();
  const OnboardingLogo = '/assets/icons/Logo-Onboarding.svg';
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [signUp, isLoading] = useSignUpMutation();

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password needs to be at least 8 characters')
      .max(40, 'Password must not exceed 40 characters')
      .test('passwordRequirements', 'Must contain at least an uppercase, a number & a special character', (value) =>
        [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].every((pattern) => pattern.test(value as string)),
      ),
    name: Yup.string()
      .required('Please enter your full name')
      .matches(/^[a-zA-ZÀ-ÖÙ-öù-ÿĀ-žḀ-ỿ0-9\s\-/.]+$/, 'Please enter valid name')
      .max(30, 'Name must not exceed 30 characters'),
    email: Yup.string().email('Please enter a valid email').required('Email is required'),
    repassword: Yup.string()
      .oneOf([Yup.ref('password'), null], "Password doesn't match")
      .required('Confirm password is required'),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useForm<IFormInputs>({ mode: 'onChange', resolver: yupResolver(validationSchema) });

  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    signUp({ ...data, email: data.email.toLowerCase() })
      .unwrap()
      .then((res) => {
        toast.success('OTP has been sent to your email');
        router.push('/user/verify-user');
        localStorage.setItem('userid', res.data.userID);
      })
      .catch((err) => {
        toast.error(err?.data?.message);
      });
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <BgWrapperOnboarding>
      <SignUpPageWrapper>
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              py: 4,
              display: {
                xs: 'none',
                sm: 'block',
              },
            }}
          >
            <Link href={`${ROUTE.HOME}`}>
              <a>
                <Image src={OnboardingLogo} alt="logo" width={133} height={32} />
              </a>
            </Link>
          </Box>
          <section className="signup-section">
            <div style={{ width: '35%' }}>
              <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <Box
                  sx={{
                    mb: 3,
                  }}
                >
                  <Typography variant="h5">Hi there, Let&apos;s create </Typography>
                  <Typography variant="h5">a new account for you</Typography>
                </Box>
                <Box>
                  <div className="input-wrapper">
                    <Typography variant="body1" sx={{ mb: '3px' }}>
                      Your full name
                    </Typography>
                    <input
                      type="text"
                      {...register('name', {
                        required: { value: true, message: 'Please enter your full name.' },
                      })}
                      style={{ border: errors.name?.message ? '1px solid #F81E1E' : '1px solid #b8b8c3' }}
                      placeholder="Your name"
                    />
                    {errors.name && errors.name.type === 'matches' ? (
                      <span role="alert" className="error-msg">
                        {errors.name?.message}
                      </span>
                    ) : (
                      <span role="alert" className="error-msg">
                        {errors?.name?.message}
                      </span>
                    )}
                  </div>
                  <div className="input-wrapper">
                    <Typography variant="body1" sx={{ mb: '3px' }}>
                      Email address
                    </Typography>
                    <input
                      type="email"
                      {...register('email', {
                        required: { value: true, message: 'Please enter a valid email' },
                      })}
                      style={{ border: errors.email?.message ? '1px solid #F81E1E' : '1px solid #b8b8c3' }}
                      placeholder="Your email"
                    />
                    {errors.email && errors.email.type === 'required' && (
                      <span role="alert" className="error-msg">
                        {errors.email.message}
                      </span>
                    )}
                  </div>
                  <div className="input-wrapper">
                    <Typography variant="body1" sx={{ mb: '3px' }}>
                      Password
                    </Typography>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password', {
                        required: { value: true, message: 'Please enter a password' },
                      })}
                      aria-label="toggle password visibility"
                      style={{ border: errors.password?.message ? '1px solid #F81E1E' : '1px solid #b8b8c3' }}
                      placeholder="New password"
                      maxLength={40}
                    />

                    <span role="alert" className="error-msg">
                      {errors.password && errors.password.message}
                    </span>

                    <div className="showpassword">
                      {showPassword ? (
                        <VisibilityIcon
                          onClick={handleClickShowPassword}
                          sx={{
                            color: ' #09121F',
                            opacity: '0.5',
                          }}
                        />
                      ) : (
                        <VisibilityOffIcon
                          onClick={() => setShowPassword(!showPassword)}
                          sx={{
                            color: ' #09121F',
                            opacity: '0.5',
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <div className="input-wrapper">
                    <Typography variant="body1" sx={{ mb: '3px' }}>
                      Confirm password
                    </Typography>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...register('repassword', {
                        required: { value: true, message: 'Please enter your password again' },
                        validate: (value) => value === getValues().password || 'password did not match',
                      })}
                      maxLength={40}
                      placeholder="Confirm password"
                      aria-label="toggle password visibility"
                      style={{ border: errors.repassword?.message ? '1px solid #F81E1E' : '1px solid #b8b8c3' }}
                    />
                    <span role="alert" className="error-msg">
                      {errors.repassword && errors.repassword.message}
                    </span>
                    <div className="showpassword">
                      {showConfirmPassword ? (
                        <VisibilityIcon
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          sx={{
                            color: ' #09121F',
                            opacity: '0.5',
                          }}
                        />
                      ) : (
                        <VisibilityOffIcon
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          sx={{
                            color: ' #09121F',
                            opacity: '0.5',
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <Box sx={{ width: '176px' }}>
                    <LoadingBtn loading={isLoading.isLoading}>Create account</LoadingBtn>
                  </Box>
                </Box>
                <Typography variant="body1" sx={{ color: '#000', mt: 4, mb: 1 }}></Typography>
                <SocialOnboardingLinks />
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 4, mb: 3 }}>
                  <Typography variant="body1" sx={{ color: '#000', fontWeight: '600', pr: '2px' }}>
                    Already have an account?
                  </Typography>
                  <Link href="/user/signin" sx={{ textDecoration: 'none' }}>
                    <a className="onboarding-internal-link">Log in</a>
                  </Link>
                </Box>
              </form>
            </div>
          </section>
          <FooterOnboarding />
        </Container>
      </SignUpPageWrapper>
    </BgWrapperOnboarding>
  );
};
