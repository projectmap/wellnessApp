import Link from 'next/link';
import Image from 'next/image';
import OtpInput from 'react-otp-input';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { Box, Container } from '@mui/system';
import 'react-toastify/dist/ReactToastify.css';
import React, { MouseEventHandler, useEffect, useState } from 'react';
import { CircularProgress, Button as MuiButton, Typography } from '@mui/material';

import { useResendVerificationCodeMutation, useVerifyEmailMutation } from '@newstart-online/sdk';
import { LoadingBtn } from '~/modules/_core/bits/buttons/LoadingBtn';
import BgWrapperOnboarding from '~/modules/onboarding/signUp/bgWrapper';
import { OTPPageWrapper } from '~/modules/onboarding/otp/OtpPageWrapper';
import { FooterOnboarding } from '~/modules/onboarding/footer/FooterOnboardingArea';
import { USER_ID_FOR_USER_VERIFICATION, USER_ONBOARDING_ROUTING } from '~/state/constants';
import { debounce } from '~/utils/helpers';

export const OTP = () => {
  const router = useRouter();
  const [code, setCode] = useState<string>('');
  const userid = localStorage.getItem(USER_ID_FOR_USER_VERIFICATION) || '';

  const handleOtpChange = (code: string) => {
    setCode(code);
  };

  const [verifyEmail, loading] = useVerifyEmailMutation();
  const [resendEmail, isLoading] = useResendVerificationCodeMutation();

  const handleVerify: MouseEventHandler = async (e) => {
    e.preventDefault();

    await verifyEmail({
      userID: userid,
      code,
    })
      .unwrap()
      .then((data: any) => {
        toast.success(() => data.message);
        localStorage.removeItem(USER_ID_FOR_USER_VERIFICATION);
        router.push(USER_ONBOARDING_ROUTING.SIGN_IN);
      })
      .catch((error: any) => {
        toast.error(() => error.data.message);
      });
  };

  const handleResend: MouseEventHandler = async (e) => {
    e.preventDefault();

    await resendEmail({
      userId: userid,
    })
      .unwrap()
      .then((data: any) => {
        toast.success(() => data?.message);
      })
      .catch((error: any) => {
        toast.error(() => error?.data?.message);
      });
  };

  // Define your debounced submit handler
  const debouncedSubmit = React.useCallback(
    debounce((e) => {
      handleResend(e);
      // Handle your form submission here
    }, 800), // Specify the debounce delay in milliseconds
    [],
  );
  const debounceHandleResend = (e: any) => {
    debouncedSubmit(e);
  };

  return (
    <BgWrapperOnboarding>
      <OTPPageWrapper>
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
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
            <Link href="/user/signin">
              <a>
                <Image src="/assets/icons/Logo-Onboarding.svg" alt="logo" width={133} height={32} />
              </a>
            </Link>
          </Box>
          <section className="signup-section">
            <div>
              <Box></Box>
              <Box sx={{ display: 'flex' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <Typography variant="h5">You’re almost there!</Typography>

                  <Typography variant="h5">Just enter the OTP sent to your email</Typography>
                  <Typography variant="h5">and you’ll be on your way to your NEWSTART.</Typography>
                  <Box
                    sx={{
                      my: 6,
                    }}
                  >
                    <OtpInput isInputNum numInputs={6} inputStyle="otp-input" value={code} onChange={handleOtpChange} />
                  </Box>

                  {/* 6 is to check string's lenght which should be equal to number of otp input box fields */}
                  {code?.length === 6 && (
                    <Box
                      sx={{
                        marginBottom: 2.5,
                      }}
                    >
                      <LoadingBtn onClick={handleVerify} loading={loading?.isLoading}>
                        Verify Email
                      </LoadingBtn>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        marginTop: {
                          xs: '108px',
                          sm: '0',
                        },
                      }}
                    >
                      Didn&apos;t receive a code?
                    </Typography>
                    <Box>
                      {isLoading?.isLoading ? (
                        <CircularProgress />
                      ) : (
                        <MuiButton
                          color="primary"
                          sx={{
                            textTransform: 'capitalize',
                            fontWeight: 'bold',
                            fontSize: '16px',
                          }}
                          onClick={debounceHandleResend}
                        >
                          Resend email
                        </MuiButton>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </div>
          </section>
          <Box sx={{ mb: 3 }}>
            <FooterOnboarding />
          </Box>
        </Container>
      </OTPPageWrapper>
    </BgWrapperOnboarding>
  );
};
