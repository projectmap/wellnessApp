import * as Yup from 'yup';
import { Box } from '@mui/system';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { Paper, Typography } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useResetPasswordMutation } from '@newstart-online/sdk';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { CloseBtnGray, Lock } from '~/icons';
import { LoadingBtn } from '~/modules/_core/bits/buttons/LoadingBtn';

interface IResetPassWordModalProps {
  password?: string;
  repassword?: string;
  verificationCode: string;
  email?: string;
  handleClose: () => void;
  id?: string;
}

export const ResetPasswordModal = ({ verificationCode, handleClose, id }: IResetPassWordModalProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const [resetPassword, loading] = useResetPasswordMutation();

  const resetPasswordValidationSchema = Yup.object().shape({
    password: Yup.string()
      .required('Password is required.')
      .min(8, 'Password needs to be at least 8 characters.')
      .test('passwordRequirements', 'Must contain at least an uppercase, a number & a special character', (value) =>
        [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].every((pattern) => pattern.test(value as string)),
      ),
    repassword: Yup.string()
      .oneOf([Yup.ref('password'), null], "Password doesn't Match")
      .required('Confirm password is required'),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IResetPassWordModalProps>({ mode: 'onChange', resolver: yupResolver(resetPasswordValidationSchema) });

  const onSubmit: SubmitHandler<IResetPassWordModalProps> = async (data) => {
    await resetPassword({
      id: id,
      code: verificationCode,
      newPassword: data.password as string,
    })
      .unwrap()
      .then((data) => {
        toast.success('Password reset success.');
      })
      .catch((err) => {
        toast.error(err?.data?.message);
      });
    handleClose();
  };

  return (
    <Paper sx={{ width: '509px', height: 'fit-content', paddingTop: '16px', paddingBottom: '42px' }}>
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
          <Lock />
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
        <Typography variant="h5" sx={{ py: 2, textAlign: 'center' }}>
          Create a new password for your account
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="input-wrapper">
            <Typography variant="body1" sx={{ mb: '3px' }}>
              Enter new password
            </Typography>
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: { value: true, message: 'Please enter a password' },
              })}
              aria-label="toggle password visibility"
              style={{ border: errors.password?.message ? '1px solid #F81E1E' : '1px solid #b8b8c3' }}
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
                  onClick={handleClickShowPassword}
                  sx={{
                    color: ' #09121F',
                    opacity: '0.5',
                  }}
                />
              )}
            </Box>
          </div>
          <div className="input-wrapper">
            <Typography variant="body1" sx={{ mb: '3px' }}>
              Confirm password
            </Typography>
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('repassword', {
                required: { value: true, message: 'Please enter a password' },
                minLength: {
                  value: 8,
                  message: 'password length should be at least 8',
                },
              })}
              aria-label="toggle password visibility"
              style={{ border: errors.repassword?.message ? '1px solid #F81E1E' : '1px solid #b8b8c3' }}
            />
            {errors.repassword && errors.repassword.message && (
              <span role="alert" className="error-msg">
                {errors.repassword.message}
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
              alignItems: 'center',
              width: '50%',
              justifyContent: 'center',
              margin: 'auto',
              cursor: 'pointer',
            }}
          >
            <LoadingBtn loading={loading?.isLoading}>Save Password</LoadingBtn>
          </Box>
        </form>
      </Box>
    </Paper>
  );
};
