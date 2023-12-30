import * as Yup from 'yup';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { Box, Container } from '@mui/system';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Backdrop, Link, Typography } from '@mui/material';

import { ROUTE } from '~/config/routes';
import { ArrowRightBlue } from '~/icons';
import { setTokens } from '~/utils/authStore';
import { SubmitHandler, useForm } from 'react-hook-form';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { LoadingBtn } from '~/modules/_core/bits/buttons/LoadingBtn';
import BgWrapperOnboarding from '~/modules/onboarding/signUp/bgWrapper';
import { SignInPageWrapper } from '~/modules/onboarding/signIn/SignInPageWrapper';
import { ResetPasswordModal } from '~/modules/onboarding/modals/ResetPasswordModal';
import { FooterOnboarding } from '~/modules/onboarding/footer/FooterOnboardingArea';
import { ForgetPasswordModal } from '~/modules/onboarding/modals/ForgetPasswordModal';
import { USER_ID_FOR_USER_VERIFICATION, USER_ONBOARDING_ROUTING } from '~/state/constants';
import { IToken, storeTokens, useAppDispatch, useLoginMutation } from '@newstart-online/sdk';
import { SocialOnboardingLinks } from '~/modules/onboarding/socialOnboarding/socialOnboardingLinks';

interface SignInFormInputs {
  email: string;
  password: string;
}

export const SingInArea = () => {
  const router = useRouter();
  localStorage.setItem('isCourseCompletedModalShown', 'yes');
  const [open, setOpen] = useState<boolean>(false);
  const [showForgetPassPopup, setShowForgetPassPopup] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [addNewPassword, setAddNewPassword] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>('');

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    event?.preventDefault();
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const loginValidationSchema = Yup.object().shape({
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password needs to be at least 8 characters.')
      .max(40, 'Password must not exceed 40 characters'),
    email: Yup.string().email('Please enter a valid email').required('Email is required'),
  });
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignInFormInputs>({ mode: 'onChange', resolver: yupResolver(loginValidationSchema) });

  const dispatch = useAppDispatch();

  const [emailLogin, isLoading] = useLoginMutation();

  // const verificationCode = router.query?.code as string; //obtain verification code sent to email

  const email = router.query?.email as string; // obtain email from query url

  const id = router.query?.id as string;

  useEffect(() => {
    if (router.query.code) {
      if (typeof router.query.code === 'string') {
        setVerificationCode(router.query.code);
      }
      setAddNewPassword(true);
      setOpen(true);
    }
  }, [router.query.code]);

  // collecting form data from the form
  const onSubmit: SubmitHandler<SignInFormInputs> = async (data) => {
    emailLogin({ ...data, email: data.email.toLowerCase() })
      .unwrap()
      .then((data: any) => {
        toast.success(data.message);
        const tokens = data.data as IToken;
        setTokens(tokens);
        dispatch(storeTokens(tokens));
        router.push(ROUTE.HOME);
      })
      .catch((err) => {
        toast.error(err.message || err.data?.message);
        if (err?.data?.data?.isNotVerified) {
          localStorage.setItem(USER_ID_FOR_USER_VERIFICATION, err?.data?.data?._id);
          router.push(USER_ONBOARDING_ROUTING.VERIFY_USER);
        }
      });
  };

  // only states for opening and closing popup but main logic is in popup itself
  const handleForgetPassword = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setShowForgetPassPopup(true);
    setOpen(true);
    setAddNewPassword(false);
  };

  return (
    <BgWrapperOnboarding>
      <SignInPageWrapper>
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '98vh',
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              paddingTop: 4,
              pb: 6,
              display: {
                xs: 'none',
                sm: 'block',
              },
            }}
          >
            <Link href="/landing-page">
              <a>
                <Image src="/assets/icons/Logo-Onboarding.svg" alt="logo" width={133} height={32} />
              </a>
            </Link>
          </Box>
          <section className="signup-section">
            <Box>
              <Box>
                <Typography variant="h5">Welcome to NEWSTART. </Typography>
                <Typography variant="h5">Ready for the next step in your NEWSTART?</Typography>
                <Typography variant="h5">Log in and let’s go!</Typography>
              </Box>
              <Box
                sx={{
                  marginBottom: 3,
                }}
              >
                <Box
                  component="form"
                  onSubmit={handleSubmit(onSubmit)}
                  autoComplete="off"
                  noValidate
                  sx={{ paddingTop: 4 }}
                >
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
                      placeholder="Enter email"
                    />
                    {errors.email && (
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
                      placeholder="Enter password"
                      aria-label="toggle password visibility"
                      style={{ border: errors.password?.message ? '1px solid #F81E1E' : '1px solid #b8b8c3' }}
                      maxLength={40}
                    />
                    {errors.password && (
                      <span role="alert" className="error-msg">
                        {errors.password.message}
                      </span>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center' }} className="showpassword">
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
                    </Box>
                  </div>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      mb: 3,
                    }}
                  >
                    <Box
                      sx={{
                        mb: 0.5,
                        mt: -1,
                        cursor: 'pointer',
                      }}
                    >
                      <a className="onboarding-internal-link" onClick={handleForgetPassword}>
                        Forgot password?
                      </a>
                    </Box>
                  </Box>
                  <Box sx={{ width: '176px', mb: 3 }}>
                    <LoadingBtn loading={isLoading.isLoading}>Login</LoadingBtn>
                  </Box>
                  <SocialOnboardingLinks />
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 4, mb: 1 }}>
                    <Typography variant="body1" sx={{ color: '#000', fontWeight: '600', pr: 0.5 }}>
                      Don’t have an account?
                    </Typography>
                    <Link href="/user/signup" sx={{ textDecoration: 'none' }}>
                      <a className="onboarding-internal-link">
                        Sign up now <ArrowRightBlue />
                      </a>
                    </Link>
                  </Box>
                </Box>
              </Box>
            </Box>
          </section>

          <FooterOnboarding />
        </Container>
        {(showForgetPassPopup || addNewPassword) && (
          <Backdrop
            open={open}
            sx={{
              color: '#FFFF',
              background: '#00000080',
            }}
          >
            {addNewPassword ? (
              <ResetPasswordModal email={email} verificationCode={verificationCode} handleClose={handleClose} id={id} />
            ) : (
              <ForgetPasswordModal handleClose={handleClose} setOpen={setOpen} />
            )}
          </Backdrop>
        )}
      </SignInPageWrapper>
    </BgWrapperOnboarding>
  );
};
