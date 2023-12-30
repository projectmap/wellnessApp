import Link from 'next/link';
import { NextPage } from 'next';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Paper, TextField, Typography } from '@mui/material';
import { DefaultLink } from '~/modules/_core/components/links/DefaultLink';
import { ContainerWrapperArea } from '~/modules/_core/layout/containerWrapper/ContainerWrapperArea';

import { ChevronBlueLeft, Logo, LogoIcon } from '~/icons';
import { useChangePasswordMutation, useLazySignOutQuery } from '@newstart-online/sdk';
import { Button } from '~/modules/_core/bits/buttons/Button';

interface ChangePasswordInput {
  oldPassword: string;
  newPassword: string;
  confirmNewpassword: string;
}

const ChangePassword: NextPage = () => {
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);

  const [logOut] = useLazySignOutQuery();
  const [changePassword, newPassword] = useChangePasswordMutation();

  const handleLogout = async () => {
    await logOut();
    router.push('/');
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useForm<ChangePasswordInput>();

  const onSubmit: SubmitHandler<ChangePasswordInput> = (data) => {
    try {
      handleChangePasswordSubmit(data);
    } catch (err: any) {
      setOpen(true);
    }
  };

  const handleChangePasswordSubmit = (data: ChangePasswordInput) => {
    const { oldPassword, newPassword } = data;

    changePassword({
      oldPassword,
      newPassword,
    })
      .unwrap()
      .then(() => handleLogout())
      .catch((err) => console.warn(err));
  };

  return (
    <div>
      <ContainerWrapperArea>
        <Box
          sx={{
            paddingTop: 6,
            paddingLeft: 12,
            display: {
              xs: 'none',
              sm: 'block',
            },
          }}
        >
          <Link href="/user/login">
            <a>
              <Logo />
            </a>
          </Link>
        </Box>
        <Box
          sx={{
            display: 'flex',
            pt: 9,
            pb: 14,
            width: '100%',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Paper
            variant="outlined"
            sx={{
              paddingTop: {
                xs: '0',
              },
              paddingBottom: {
                xs: '0',
                sm: '48px',
              },
              width: 480,
              border: {
                xs: 'transparent',
                sm: '0.5px solid rgba(161, 161, 175, 0.5)',
              },
              borderRadius: '12px',
              backgroundColor: {
                xs: 'transparent',
              },
            }}
          >
            <Box
              sx={{
                pl: 6,
                pb: 4,
                pt: {
                  xs: '44px',
                  sm: '48px',
                },
              }}
            >
              <Box
                className="backlink-onboardingpage"
                component="div"
                sx={{ cursor: 'pointer', width: '16%' }}
                onClick={() => router.back()}
              >
                <ChevronBlueLeft />
                Back
              </Box>
            </Box>
            <Box
              sx={{
                paddingLeft: 6,
              }}
            >
              <LogoIcon />
            </Box>
            <Box
              sx={{
                paddingLeft: 6,
              }}
            >
              <Typography variant="h5" sx={{ width: '70%', mb: 1.5 }}>
                Create a new password for your account
              </Typography>
              {/* <Typography variant="body2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec.
              </Typography> */}
            </Box>
            <Box
              sx={{
                marginBottom: 3,
              }}
            >
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
                sx={{ paddingLeft: 6, paddingRight: 6, paddingTop: 4 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Box
                    sx={{
                      mb: 4,
                      width: '100%',
                    }}
                  >
                    <Typography variant="body1">Enter your old password</Typography>
                    <TextField
                      required
                      variant="filled"
                      fullWidth
                      size="small"
                      label="Old Password"
                      id="password"
                      error={errors.oldPassword ? true : false}
                      helperText={errors.oldPassword ? errors.oldPassword.message : null}
                      {...register('oldPassword', {
                        required: { value: true, message: 'Please enter a password' },
                        minLength: {
                          value: 8,
                          message: 'password length should be at least 8',
                        },
                      })}
                      sx={{
                        opacity: 0.6,
                        '& .MuiFilledInput-root': {
                          background: 'transparent',
                          border: '1px solid #A1A1AF',
                          borderRadius: '4px',
                        },
                        '& .MuiFilledInput-root:before': {
                          borderBottom: 'none',
                          content: 'none',
                        },
                        '& .MuiFilledInput-root:after': {
                          borderBottom: 'none',
                          content: 'none',
                        },
                      }}
                      type="text"
                    />
                  </Box>
                  <Box
                    sx={{
                      mb: 4,
                      width: '100%',
                    }}
                  >
                    <Box
                      sx={{
                        mb: 4,
                        width: '100%',
                      }}
                    >
                      <Typography variant="body1">Enter a new passoword</Typography>
                      <TextField
                        required
                        variant="filled"
                        fullWidth
                        size="small"
                        label="New Password"
                        id="password"
                        error={errors.newPassword ? true : false}
                        helperText={errors.newPassword ? errors.newPassword.message : null}
                        {...register('newPassword', {
                          required: { value: true, message: 'Please enter a password' },
                          minLength: {
                            value: 8,
                            message: 'password length should be at least 8',
                          },
                        })}
                        sx={{
                          opacity: 0.6,
                          '& .MuiFilledInput-root': {
                            background: 'transparent',
                            border: '1px solid #A1A1AF',
                            borderRadius: '4px',
                          },
                          '& .MuiFilledInput-root:before': {
                            borderBottom: 'none',
                            content: 'none',
                          },
                          '& .MuiFilledInput-root:after': {
                            borderBottom: 'none',
                            content: 'none',
                          },
                        }}
                        type="text"
                      />
                    </Box>
                    <Box
                      sx={{
                        mb: 4,
                        width: '100%',
                      }}
                    ></Box>
                    <Typography variant="body1">Confirm new passoword</Typography>
                    <TextField
                      required
                      variant="filled"
                      fullWidth
                      size="small"
                      label="Confirmation New Password"
                      id="confirmNewpassword"
                      error={errors.confirmNewpassword ? true : false}
                      helperText={errors.confirmNewpassword ? errors.confirmNewpassword.message : null}
                      {...register('confirmNewpassword', {
                        required: { value: true, message: 'Please re enter a password' },
                        validate: (value) => value === getValues().newPassword || 'password did not match',
                      })}
                      sx={{
                        opacity: 0.6,
                        '& .MuiFilledInput-root': {
                          background: 'transparent',
                          border: '1px solid #A1A1AF',
                          borderRadius: '4px',
                        },
                        '& .MuiFilledInput-root:before': {
                          borderBottom: 'none',
                          content: 'none',
                        },
                        '& .MuiFilledInput-root:after': {
                          borderBottom: 'none',
                          content: 'none',
                        },
                      }}
                      type="text"
                    />
                  </Box>
                  <Box
                    sx={{
                      marginTop: {
                        xs: '144px',
                        sm: '0',
                      },
                    }}
                  >
                    <Button onClick={() => handleSubmit(onSubmit)}>Change password</Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>
          <Box
            sx={{
              marginTop: 3,
              width: 400,
              display: {
                xs: 'none',
                sm: 'flex',
              },
              marginX: 'auto',
              justifyContent: 'space-between',
            }}
          >
            <DefaultLink to="/terms-and-conditions">Terms & conditions</DefaultLink>
            <DefaultLink to="/privacy-policy">Privacy policy</DefaultLink>
            <DefaultLink to="/help">Help</DefaultLink>
          </Box>
        </Box>
      </ContainerWrapperArea>
    </div>
  );
};
export default ChangePassword;
