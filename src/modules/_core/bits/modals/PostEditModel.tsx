import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import { useForm, SubmitHandler } from 'react-hook-form';

import { LoadingButton } from '@mui/lab';
import { Box, IconButton, Paper, TextField, Typography } from '@mui/material';
import { useRemoveFeedsImagesMutation, useUpdateFeedsMutation } from '@newstart-online/sdk';

import { removeDuplicates } from '~/utils/helpers';
import { PostObj } from '~/modules/community/Types';
import { BluePlayIcon, CloseBtnModel } from '~/icons';
import { RESOURCES_LOADING_THUMBNAIL } from '~/state/constants';
import { ImageDropzone } from '~/modules/community/ImageDropzone';
import { GenericShareModaStyles } from '~/modules/community/GenericModalStyles';
import { DefaultUserPhoto } from '~/modules/community/components/Chat/DefaultUserPhoto';

interface Model {
  closeModal: () => void;
  postId: string;
  postobj: PostObj;
  setFeeds: Dispatch<SetStateAction<PostObj[]>>;
  imageUrlToShare?: string;
  enableUserToUpdateImageAndPost?: boolean;
  descriptionToShare?: string;
}

interface IPostInputs {
  descriptions: string;
}

const EditPostModelPopup: FC<Model> = ({
  closeModal,
  postobj,
  postId,
  imageUrlToShare,
  enableUserToUpdateImageAndPost,
  setFeeds,
  descriptionToShare,
}) => {
  const router = useRouter();
  const [file, setFile] = useState<File[] | null>(null);
  const [images, setImages] = useState(postobj.images);
  const [deleteImageIds, setDeleteImageIds] = useState<string[]>([]);
  const [isStatusOnlyWhiteSpaces, setIsStatusOnlyWhiteSpaces] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<IPostInputs>();

  const [submitPostUpdateFeed, { isSuccess, isLoading: postUpdateLoading }] = useUpdateFeedsMutation();
  const [deleteImage] = useRemoveFeedsImagesMutation();

  let urlToPush = '';
  if (typeof window !== 'undefined' && window.location) {
    urlToPush = window.location.pathname;
  }

  const onSubmit: SubmitHandler<IPostInputs> = async (data) => {
    const postData: any = { ...data, _id: postId };
    if (file) {
      postData['images'] = file;
    }
    if (!postobj?.sharedPost && images?.length === 0 && !file && !postData.descriptions) {
      setIsStatusOnlyWhiteSpaces(true);

      return;
    }

    if (!!postData.descriptions && postData?.descriptions.replace(/\s/g, '') === '') {
      setIsStatusOnlyWhiteSpaces(true);
    } else {
      setIsStatusOnlyWhiteSpaces(false);
      if (deleteImageIds.length > 0) {
        deleteImage({ feedsId: postId, deletingImageId: deleteImageIds })
          .unwrap()
          .then(() => {
            submitPostUpdateFeed(postData)
              .unwrap()
              .then((updatedFeed) => {
                setFeeds((prevFeed) => {
                  let updatedFeeds = prevFeed;
                  const updatedFeedIndex = updatedFeeds.findIndex((feed) => feed._id === updatedFeed.data._id);
                  updatedFeeds[updatedFeedIndex] = updatedFeed.data;

                  return removeDuplicates(updatedFeeds);
                });
                toast.success('Post Updated Successfully');
                urlToPush && router.push(urlToPush);
              })
              .catch((err) => {
                toast.error(
                  err?.data?.message === 'Cannot PUT /api/feeds'
                    ? 'Cannot Update Post at the moment, Please try again later'
                    : err.data.message,
                );
              });
          })
          .catch((err) => {
            toast.error(err.data.message);
          });
      } else {
        submitPostUpdateFeed(postData)
          .unwrap()
          .then((updatedFeed) => {
            setFeeds((prevFeed) => {
              let updatedFeeds = prevFeed;
              const updatedFeedIndex = updatedFeeds.findIndex((feed) => feed._id === updatedFeed.data._id);
              updatedFeeds[updatedFeedIndex] = updatedFeed.data;

              return removeDuplicates(updatedFeeds);
            });
            toast.success('Post Updated Successfully');
            urlToPush && router.push(urlToPush);
          })
          .catch((err) => {
            toast.error(
              err?.data?.message === 'Cannot PUT /api/feeds'
                ? 'Cannot Update Post at the moment, Please try again later'
                : err.data.message,
            );
          });
      }
    }
  };

  if (isSuccess) {
    closeModal();
  }

  const handleRemoveImg = (imageId: string) => {
    setImages((prevImages) => prevImages.filter((prevImage) => prevImage._id !== imageId));
    setDeleteImageIds((prev) => [...prev, imageId]);
  };

  useEffect(() => {
    setValue('descriptions', postobj.descriptions);
  }, [postobj.descriptions, setValue]);

  return (
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
          <Typography variant="h5">Edit your post</Typography>
          <IconButton onClick={() => closeModal()}>
            <CloseBtnModel />
          </IconButton>
        </Box>
        <TextField
          id="descriptions"
          label="What's going on?"
          multiline
          autoFocus
          rows={2}
          variant="filled"
          error={errors.descriptions ? true : false}
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
            marginBottom: '8px',
          }}
        />
        {enableUserToUpdateImageAndPost && (
          <Box>
            <ImageDropzone file={file} setFile={setFile} images={images} onClose={handleRemoveImg} />
          </Box>
        )}

        {descriptionToShare && (
          <Typography
            sx={{ mb: '16px' }}
            className="line-clamp"
            dangerouslySetInnerHTML={{ __html: descriptionToShare }}
            variant="body1"
          />
        )}
        {!enableUserToUpdateImageAndPost && (
          <Box sx={{ height: '300px', position: 'relative' }}>
            <Image
              src={imageUrlToShare || RESOURCES_LOADING_THUMBNAIL}
              alt="resources"
              width="100%"
              height="100%"
              objectFit="cover"
              layout="fill"
            />
            {postobj?.sharedLecture || postobj?.sharedPost?.sharedLecture ? (
              <Box sx={GenericShareModaStyles.playIconContainer}>
                <BluePlayIcon />
              </Box>
            ) : null}
          </Box>
        )}
        {postobj?.sharedPost && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: '16px' }}>
            <Box sx={{ position: 'relative', width: '48px', height: '48px' }}>
              {postobj?.sharedPost?.author?.photo?.completedUrl ? (
                <Image
                  className="rounded-image"
                  src={postobj?.sharedPost?.author?.photo?.completedUrl}
                  objectFit="cover"
                  layout="fill"
                  alt={postobj?.sharedPost?.author?.name}
                />
              ) : (
                <DefaultUserPhoto
                  userName={postobj?.sharedPost?.author?.name}
                  fontNewSize={{ fontSize: '24px' }}
                  sx={{ background: `${postobj?.sharedPost?.author?.color}`, width: '48px', height: '48px' }}
                />
              )}
            </Box>
            <Box>
              <Typography sx={GenericShareModaStyles.authorNameShareModal} variant="subtitle1">
                {postobj?.sharedPost?.author?.name}
              </Typography>
              <Typography sx={GenericShareModaStyles.marginLeft12} variant="body1">
                {moment(postobj?.sharedPost?.createdAt).fromNow()}
              </Typography>
            </Box>
          </Box>
        )}

        <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LoadingButton
            type="submit"
            variant="contained"
            disableElevation
            loading={postUpdateLoading}
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
            Update
          </LoadingButton>
        </Box>
        {isStatusOnlyWhiteSpaces && (
          <Typography sx={{ color: 'red', mt: '16px', ml: 'auto', mr: 'auto', width: 'fit-content' }}>
            You should either add descriptions or images to post in community.
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export { EditPostModelPopup };
