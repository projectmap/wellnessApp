import React from 'react';
import { Box } from '@mui/system';
import { useForm, Controller } from 'react-hook-form';
import FormHelperText from '@mui/material/FormHelperText';
import { Button, IconButton, InputAdornment, TextField } from '@mui/material';

import { ContestIcon, PlusAttachmentIcon } from '~/icons';
import { CreatePostWrapper } from '~/modules/_core/styles/CreatePostWrapper';

const requiredRules = {
  required: {
    value: true,
    message: 'required*',
  },
};
export const CreatePostArea = () => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    alert(JSON.stringify(data));
    reset(data);
  };

  return (
    <CreatePostWrapper>
      <h4 className="title">Create a new post</h4>
      <Box className="form__wrapper">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <Box>
              <Controller
                control={control}
                name="post"
                rules={requiredRules}
                render={({ field }) => (
                  <TextField
                    placeholder="What's going on?"
                    fullWidth
                    multiline
                    defaultValue=""
                    rows={8}
                    className="text--field"
                    variant="outlined"
                    {...field}
                  />
                )}
              />
              {errors.post?.message && (
                <FormHelperText error={true}>
                  <>{errors?.post?.message}</>
                </FormHelperText>
              )}
            </Box>
            <Box className="control__wrap">
              <Controller
                control={control}
                name="message"
                rules={requiredRules}
                render={({ field }) => (
                  <TextField
                    className="form--control"
                    placeholder="Message"
                    fullWidth
                    defaultValue=""
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton>
                            <PlusAttachmentIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    {...field}
                  />
                )}
              />

              <IconButton className="icon--add">
                <ContestIcon />
              </IconButton>
              <FormHelperText error={errors?.message?.message ? true : false}>
                <>{errors?.message?.message}</>
              </FormHelperText>
            </Box>
          </Box>
          <Box className="btn__wrap">
            <Button type="submit" size="medium" color="primary" variant="contained" className="btn--create">
              Post
            </Button>
          </Box>
        </form>
      </Box>
    </CreatePostWrapper>
  );
};
