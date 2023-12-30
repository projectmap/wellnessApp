import React, { FC, useState } from 'react';

import Image from 'next/image';
import { toast } from 'react-toastify';
import { IUser } from '@newstart-online/sdk';
import PhoneInput from 'react-phone-input-2';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Box, Button, IconButton, Paper, TextField, Typography, Alert, Snackbar } from '@mui/material';

import 'react-phone-input-2/lib/style.css';
import { isObjectEqual } from '~/utils/helpers';
import { useAppDispatch } from '~/state/app/hooks';
import { CloseBtnModel, UploadCameraIcon } from '~/icons';

interface IFormInputs {
  email: string;
  name: string;
}

interface IModelProps {
  handleCloseProfile: () => void;
  user: IUser;
}

const EditProfileModel: FC<IModelProps> = ({ handleCloseProfile, user }) => {
  const [phone, setPhone] = useState<string | null | undefined>(user?.phone);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const [open, setOpen] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    event?.preventDefault();
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    try {
      setIsUpdating(true);
      const file = e.target.files?.[0];

      if (!file) return;

      const fileExtension = file.name.split('.').pop();

      const _fileName = `${user._id}-${user?.name}-Profile`.replace(/\s/g, '-');

      const fileName = `${_fileName}.${fileExtension}`;
    } catch (error: any) {
      setIsUpdating(false);
      setOpen(false);
      console.error('UPDATE', error);
    }
  };

  const defaultValues = {
    name: user?.name || '',
    email: user?.email || '',
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInputs>({
    defaultValues,
  });

  const [updateErr, setUpdateErr] = useState<string>();

  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    try {
      if (!isObjectEqual(data, defaultValues) || phone !== user?.phone) {
        updateProfile(data);
      }
    } catch (err: any) {
      setUpdateErr(err.message);
    }
  };

  async function updateProfile(data: IFormInputs) {
    if (!user?._id) return;

    try {
      // TODO: upadte profile
      toast('Profile updated successfully');

      handleCloseProfile();
      setIsUpdating(false);
    } catch (err: any) {
      setIsUpdating(true);
      setOpen(true);
      setUpdateErr(err.message);
    }
  }

  return (
    <Paper
      sx={{
        pt: 3,
        pb: 6,
        px: 6,
        borderRadius: '12px',
        width: '517px',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
      elevation={0}
      component="div"
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={() => handleCloseProfile()}>
          <CloseBtnModel />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', px: 8, py: 5, position: 'relative' }}>
        <Image className="avatar" src={user.photo || ''} alt="user" width={128} height={128} />
        <IconButton sx={{ position: 'absolute', cursor: 'pointer', right: '185px', top: '100px' }}>
          <label htmlFor="profile-input">
            <UploadCameraIcon />
          </label>
          <input type="file" accept="image/*" id="profile-input" style={{ display: 'none' }} onChange={handleAvatar} />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Box component="form" autoComplete="off" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: '70%' }}>
          <Box
            sx={{
              mb: 2,
            }}
          >
            <Typography variant="body1">Name</Typography>
            <div>
              <TextField
                variant="filled"
                fullWidth
                size="small"
                label="name"
                autoFocus
                type="text"
                id="name"
                error={errors.name ? true : false}
                helperText={errors.name ? errors.name.message : null}
                {...register('name', {
                  required: { value: true, message: 'Please enter your name' },
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
              />
            </div>
          </Box>
          <Box
            sx={{
              mb: 2,
            }}
          >
            <Typography variant="body1">Phone</Typography>
            <div>
              <PhoneInput country={'us'} value={phone} onChange={(phone) => setPhone(phone)} />
            </div>
          </Box>
          <Box
            sx={{
              mb: 6,
            }}
          >
            <Typography variant="body1">Email</Typography>
            <div>
              <TextField
                variant="filled"
                fullWidth
                size="small"
                label="Your email"
                id="email"
                type="email"
                error={errors.email ? true : false}
                helperText={errors.email ? errors.email.message : null}
                {...register('email', {
                  required: { value: true, message: 'Please enter a valid email' },
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
              />
            </div>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button
              variant="contained"
              disableElevation
              type="submit"
              disabled={isUpdating}
              sx={{
                paddingY: 2,
                paddingX: 3.5,
                textTransform: 'capitalize',
                fontSize: '16px',
                background: '#0C72E0',
                width: '100%',
              }}
            >
              {isUpdating ? 'Updating...' : 'Save Profile'}
            </Button>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {updateErr}
        </Alert>
      </Snackbar>
    </Paper>
  );
};
export { EditProfileModel };
