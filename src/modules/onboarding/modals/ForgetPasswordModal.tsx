import * as Yup from 'yup';
import { Box } from '@mui/system';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CloseBtnGray, LogoIcon } from '~/icons';
import { Paper, Typography } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForgetPasswordMutation } from '@newstart-online/sdk';

import { LoadingBtn } from '~/modules/_core/bits/buttons/LoadingBtn';

interface IForgetPassWordModalProps {
  handleClose?: () => void;
  sendResetEmail?: '';
  setOpen?: (status: boolean) => void;
}

export const ForgetPasswordModal = ({ handleClose, setOpen }: IForgetPassWordModalProps) => {
  const [resetEmail, loading] = useForgetPasswordMutation();

  const onSubmit = (data: IForgetPassWordModalProps) => {
    resetEmail({ email: data?.sendResetEmail as string })
      .unwrap()
      .then((res) => {
        toast.success(res?.data.message);
        setOpen && setOpen(false);
      })
      .catch((err) => {
        toast.error(err?.data?.message);
      });
  };

  const forgetPasswordValidationSchema = Yup.object().shape({
    sendResetEmail: Yup.string().email('Please enter a valid email').required('Email is required'),
  });

  const {
    register,
    formState: { errors, isSubmitSuccessful },
    reset,
    handleSubmit,
  } = useForm<IForgetPassWordModalProps>({ mode: 'onChange', resolver: yupResolver(forgetPasswordValidationSchema) });

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ sendResetEmail: '' });
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <div>
      <Paper sx={{ width: '509px', height: '100%', p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 4 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              pt: 4,
              width: '80%',
              margin: 'auto',
              alignItems: 'center',
            }}
          >
            <LogoIcon />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'right', pt: 4.5, cursor: 'pointer' }}>
            <CloseBtnGray onClick={handleClose} />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            px: 7,
          }}
        >
          <Typography variant="h5" sx={{ pt: 2, textAlign: 'center' }}>
            Forget your Password?
          </Typography>
          <Typography variant="body1" sx={{ pt: 1.5, width: '85%', textAlign: 'center', pb: 3 }}>
            Enter the email address you used to register. We’ll send you a password reset link.
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Typography variant="body1" sx={{ mb: '3px' }}>
                Email address
              </Typography>

              <input
                type="email"
                {...register('sendResetEmail', {
                  required: { value: true, message: 'Please enter a valid email' },
                })}
                style={{ border: errors.sendResetEmail?.message ? '1px solid #F81E1E' : '1px solid #b8b8c3' }}
                placeholder="Enter email"
              />
              {errors.sendResetEmail && (
                <span role="alert" className="error-msg">
                  {errors.sendResetEmail.message}
                </span>
              )}
            </div>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '50%',
                justifyContent: 'center',
                margin: 'auto',
                mt: 4,
              }}
            >
              <LoadingBtn loading={loading?.isLoading}>Send Verification</LoadingBtn>
            </Box>
          </form>
        </Box>
      </Paper>
    </div>
  );
};
