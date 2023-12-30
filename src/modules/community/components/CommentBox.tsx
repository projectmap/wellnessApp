import Image from 'next/image';
import React, { useEffect } from 'react';

import { Avatar, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { Controller, useForm } from 'react-hook-form';

import { CommentBoxProps, IFormInput } from './CommentBoxTypes';
import { useGetProfileQuery } from '@newstart-online/sdk';
import { DEFAULT_AVATAR } from '~/state/constants';
import { DefaultUserPhoto } from './Chat/DefaultUserPhoto';

const CommentBox = ({ onSubmit, edit, prevComment = '', loading }: CommentBoxProps) => {
  const { data: profileData } = useGetProfileQuery();
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    setValue,
    watch,
    trigger,
    control,
    reset,
  } = useForm<IFormInput>();

  useEffect(() => {
    if (edit) {
      setValue('comment', prevComment);
    }
  }, [edit, prevComment, setValue]);

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'row', marginTop: 2 }}
      component="form"
      onSubmit={handleSubmit((data) => onSubmit({ data, reset }))}
      autoComplete="off"
    >
      {profileData?.data?.photo?.completedUrl ? (
        <Box sx={{ position: 'relative' }}>
          <Image
            className="avatar"
            src={profileData?.data?.photo?.completedUrl}
            height={40}
            width={40}
            alt={profileData?.data?.name || 'user profile'}
          />
        </Box>
      ) : (
        <DefaultUserPhoto
          userName={profileData?.data?.name || profileData?.data?.email}
          fontNewSize={{ fontSize: '24px' }}
          sx={{ background: `${profileData?.data?.color}`, width: '40px', height: '40px' }}
        />
      )}

      <Controller
        name="comment"
        control={control}
        defaultValue=""
        rules={{ required: true, maxLength: 240 }}
        render={({ field, fieldState }) => (
          <TextField
            variant="outlined"
            id="comment"
            label="Write a comment..."
            type="text"
            placeholder="Shift + Enter for New line"
            multiline
            fullWidth
            {...field}
            error={fieldState.invalid}
            helperText={fieldState.invalid && 'Comment is required and must be less than 240 characters.'}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (watch().comment === '') {
                  trigger();
                } else {
                  if (!loading) {
                    onSubmit({ data: getValues(), reset });
                  }
                }
              }
            }}
            sx={{ width: '100%', marginLeft: 1 }}
          />
        )}
      />
    </Box>
  );
};

export default CommentBox;
