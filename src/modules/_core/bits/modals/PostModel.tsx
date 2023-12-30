import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { LoadingButton } from '@mui/lab';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { Box, IconButton, Paper, TextField, Typography } from '@mui/material';

import { CloseBtnModel } from '~/icons';
import { PostObj } from '~/modules/community/Types';
import { useCreateFeedsMutation } from '@newstart-online/sdk';
import { ImageDropzone } from '~/modules/community/ImageDropzone';
import GoogleAnalytics from '~/common-ui/GoogleAnalytics/GoogleAnalytics';
import { FIREBASE_EVENTS_ENUM } from '~/config/firebase.config';

interface Model {
  closeModal: () => void;
  setFeeds?: Dispatch<SetStateAction<PostObj[]>>;
}

interface IPostInputs {
  descriptions: string;
}

const PostModelPopup: FC<Model> = ({ closeModal, setFeeds }) => {
  const router = useRouter();
  const [file, setFile] = useState<File[] | null>(null);

  const [isStatusOnlyWhiteSpaces, setIsStatusOnlyWhiteSpaces] = useState(false);

  let urlToPush = '';
  if (typeof window !== 'undefined' && window.location) {
    urlToPush = window.location.pathname;
  }

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IPostInputs>();

  const [submitPostFeed, { isSuccess, isLoading: createPostLoading }] = useCreateFeedsMutation();
  const onSubmit: SubmitHandler<IPostInputs> = async (data) => {
    const postData: any = { ...data };

    if (file) {
      postData['images'] = file;
    }

    if (!file && !postData.descriptions) {
      setIsStatusOnlyWhiteSpaces(true);

      return;
    }

    if (!!postData.descriptions && postData?.descriptions.replace(/\s/g, '') === '') {
      setIsStatusOnlyWhiteSpaces(true);
    } else {
      setIsStatusOnlyWhiteSpaces(false);
      submitPostFeed(postData)
        .unwrap()
        .then((newFeed) => {
          if (setFeeds) {
            setFeeds((prevFeeds) => [newFeed.data, ...prevFeeds]);
            urlToPush && router.push(urlToPush);
          }
          toast.success('Post Created');
        });
    }
  };

  if (isSuccess) {
    closeModal();
  }

  return (
    <GoogleAnalytics firebaseEvent={FIREBASE_EVENTS_ENUM.POST_ON_FEEDS}>
      <Paper
        sx={{
          pt: 3,
          pb: 4,
          pr: 3,
          pl: 4,
          borderRadius: '12px',
          width: '560px',
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Box component="form" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h5">Create Post</Typography>
            <IconButton onClick={() => closeModal()}>
              <CloseBtnModel />
            </IconButton>
          </Box>
          <TextField
            id="descriptions"
            label="What's on your mind?"
            multiline
            rows={2}
            variant="filled"
            error={errors.descriptions ? true : false}
            autoFocus
            helperText={errors.descriptions ? errors.descriptions.message : null}
            {...register('descriptions', {
              required: { value: false, message: 'Post can not be blank' },
            })}
            sx={{
              opacity: 0.6,
              '& .MuiFilledInput-root': {
                background: 'transparent',
                border: '1px solid transparent',
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
              width: '100%',
            }}
          />
          <Box>
            <ImageDropzone file={file} setFile={setFile} />
          </Box>
          <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LoadingButton
              type="submit"
              variant="contained"
              disableElevation
              loading={createPostLoading}
              sx={{
                paddingY: 2,
                paddingX: 3.5,
                textTransform: 'capitalize',
                fontSize: '16px',
                background: '#0C72E0',
                width: '100%',
                borderRadius: '40px',
              }}
            >
              Post
            </LoadingButton>
          </Box>
          {isStatusOnlyWhiteSpaces && (
            <Typography sx={{ color: 'red', mt: '16px', ml: 'auto', mr: 'auto', width: 'fit-content' }}>
              You should either add descriptions or images to post in community
            </Typography>
          )}
        </Box>
      </Paper>
    </GoogleAnalytics>
  );
};

export { PostModelPopup };
