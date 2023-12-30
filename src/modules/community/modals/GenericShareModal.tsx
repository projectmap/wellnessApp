import React from 'react';
import Image from 'next/image';
import { Box } from '@mui/system';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { LoadingButton } from '@mui/lab';
import { TextField, Typography } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';

import { initializeApp } from 'firebase/app';
import { logEvent } from 'firebase/analytics';
import { getAnalytics } from 'firebase/analytics';
import { GenericShareModaStyles } from '../GenericModalStyles';
import { DefaultUserPhoto } from '../components/Chat/DefaultUserPhoto';
import { BluePlayIcon, CloseBlue, CourseCompletionIcon } from '~/icons';
import GoogleAnalytics from '~/common-ui/GoogleAnalytics/GoogleAnalytics';
import { firebaseConfig, FIREBASE_EVENTS_ENUM } from '~/config/firebase.config';
import { useCreateFeedsMutation, useGetProfileQuery } from '@newstart-online/sdk';
import { COMMUNITY_SHARE_MODAL_TYPE, RESOURCES_LOADING_THUMBNAIL } from '~/state/constants';

interface IGenericShareModal {
  showModal: boolean;
  handleCloseParentModal?: () => void;
  setShowGenericShareModal: (status: boolean) => void;
  title?: string;
  description?: string;
  imageUrl?: string;
  shareModalType?: COMMUNITY_SHARE_MODAL_TYPE;
  isRepostedFromFeed?: boolean;
  isBadge?: boolean;
  isCertificate?: boolean;
  id?: string;
  authorDetails?: {
    imageUrl?: string;
    name?: string;
    createdTimeSpan?: string;
    authorImageColor?: string;
  };
}

interface IPostInputs {
  descriptions: string;
}
export default function GenericShareModal({
  showModal,
  setShowGenericShareModal,
  handleCloseParentModal,
  imageUrl,
  title,
  description,
  shareModalType,
  isRepostedFromFeed = false,
  id,
  isBadge = false,
  isCertificate = false,
  authorDetails,
}: IGenericShareModal) {
  const router = useRouter();
  const { data: profileData, isFetching: profileDataFetching } = useGetProfileQuery();

  const [submitPostFeed, { isSuccess, isLoading: createPostLoading }] = useCreateFeedsMutation();

  const [notes, setNotes] = React.useState('');

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IPostInputs>();
  const onSubmit: SubmitHandler<IPostInputs> = async (data) => {
    if (shareModalType) {
      const postData: any = {
        sharedItemKey: shareModalType,
        sharedItemValue: id,
        descriptions: data?.descriptions,
      };
      const app = initializeApp(firebaseConfig);

      //@ts-ignore
      const analytics = getAnalytics(app);
      //@ts-ignore

      if (isRepostedFromFeed) {
        submitPostFeed({ sharedPost: id, descriptions: data?.descriptions })
          .unwrap()
          .then((data) => {
            //@ts-ignore
            logEvent(analytics, 'SHARE_POST');

            setShowGenericShareModal(false);

            toast.success(data.message);
          });
      } else {
        submitPostFeed(postData)
          .unwrap()
          .then((data) => {
            //@ts-ignore
            logEvent(analytics, shareModalType);
            setShowGenericShareModal(false);
            if (shareModalType === COMMUNITY_SHARE_MODAL_TYPE.sharedBadge && handleCloseParentModal) {
              handleCloseParentModal();
            }
            toast.success(data.message);
          })

          .catch((data) => toast.error(data.message));
      }
    }
    if (isCertificate) {
      submitPostFeed({ courseCertificateId: id, descriptions: data?.descriptions })
        .unwrap()
        .then((data) => {
          handleCloseParentModal && handleCloseParentModal();

          toast.success(data.message);
        });
    }
  };

  return (
    <Box className={showModal ? 'common-backdrop' : 'hide'} sx={GenericShareModaStyles.modalBackdrop}>
      <Box onClick={() => setShowGenericShareModal(false)} sx={GenericShareModaStyles.modalContainerOutermost} />
      <Box
        component="form"
        autoComplete="off"
        className={showModal ? 'showShareModalOnCenter' : 'hide'}
        sx={GenericShareModaStyles.modalContainer}
        onSubmit={handleSubmit(onSubmit)}
      >
        <GoogleAnalytics firebaseEvent={FIREBASE_EVENTS_ENUM.SHARE_ON_COMMUNITY}>
          <>
            <Box sx={GenericShareModaStyles.modalTitle}>
              <Typography variant="h5">Share</Typography>
              <CloseBlue className="cursor-pointer" onClick={() => setShowGenericShareModal(false)} />
            </Box>
            <Box sx={GenericShareModaStyles.profileInfo}>
              {profileData?.data?.photo?.completedUrl ? (
                <Image
                  className="avatar"
                  src={profileData?.data?.photo?.completedUrl}
                  height={42}
                  width={42}
                  alt={profileData?.data?.name || 'user profile'}
                />
              ) : (
                <DefaultUserPhoto
                  userName={profileData?.data?.name}
                  fontNewSize={{ fontSize: '24px' }}
                  sx={{ background: `${profileData?.data?.color}`, width: '42px', height: '42px' }}
                />
              )}
              <Typography sx={GenericShareModaStyles.profileName} variant="subtitle1">
                {profileData?.data?.name}
              </Typography>
            </Box>
            <TextField
              id="descriptions"
              placeholder="Some text here"
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
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
              }}
            />

            {isRepostedFromFeed && description && (
              <Typography
                sx={GenericShareModaStyles.descriptionText}
                className="line-clamp"
                dangerouslySetInnerHTML={{ __html: description }}
                variant="body1"
              />
            )}
            {isCertificate ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <CourseCompletionIcon />
              </Box>
            ) : (
              <Box sx={GenericShareModaStyles.sharedImage}>
                {shareModalType !== COMMUNITY_SHARE_MODAL_TYPE.sharedBadge && !isBadge && (
                  <Image
                    style={{ borderRadius: '4px' }}
                    src={imageUrl || RESOURCES_LOADING_THUMBNAIL}
                    height="100%"
                    width="100%"
                    objectFit="cover"
                    layout="fill"
                    alt={title}
                  />
                )}

                {imageUrl && shareModalType === COMMUNITY_SHARE_MODAL_TYPE.sharedBadge && (
                  <Box sx={GenericShareModaStyles.sharedBadgeBG}>
                    <img src={imageUrl} alt={title} style={{ height: '220px', width: '220px' }} />
                    {title && (
                      <Typography sx={GenericShareModaStyles.badgeTitle} variant="subtitle1">
                        {title}
                      </Typography>
                    )}
                  </Box>
                )}
                {imageUrl && isBadge && (
                  <Box sx={GenericShareModaStyles.sharedBadgeBG}>
                    <img src={imageUrl} alt={title} style={{ height: '220px', width: '220px' }} />
                    {title && (
                      <Typography sx={GenericShareModaStyles.badgeTitle} variant="subtitle1">
                        {title}
                      </Typography>
                    )}
                  </Box>
                )}

                {shareModalType === COMMUNITY_SHARE_MODAL_TYPE.sharedLecture && (
                  <Box sx={GenericShareModaStyles.playIconContainer}>
                    <BluePlayIcon />
                  </Box>
                )}
              </Box>
            )}

            {title && shareModalType !== COMMUNITY_SHARE_MODAL_TYPE.sharedBadge && !isRepostedFromFeed && (
              <Typography sx={GenericShareModaStyles.badgeTitle} variant="subtitle1">
                {title}
              </Typography>
            )}

            {!isRepostedFromFeed && description && (
              <Typography className="line-clamp" dangerouslySetInnerHTML={{ __html: description }} variant="body1" />
            )}
            {isRepostedFromFeed && (
              <Box sx={GenericShareModaStyles.postFeedContainer}>
                <Box sx={GenericShareModaStyles.feedProfileImage}>
                  {authorDetails?.imageUrl && (
                    <Image
                      style={{ borderRadius: '50%' }}
                      src={authorDetails?.imageUrl}
                      height="100%"
                      width="100%"
                      objectFit="cover"
                      layout="fill"
                      alt="author"
                    />
                  )}
                  {!authorDetails?.imageUrl && (
                    <DefaultUserPhoto
                      userName={authorDetails?.name}
                      fontNewSize={{ fontSize: '18px' }}
                      sx={{ backgroundColor: `${authorDetails?.authorImageColor}`, height: '48px', width: '48px' }}
                    />
                  )}
                </Box>
                <Box>
                  <Typography sx={GenericShareModaStyles.authorNameShareModal} variant="subtitle1">
                    {authorDetails?.name}
                  </Typography>
                  <Typography sx={GenericShareModaStyles.marginLeft12} variant="body1">
                    {authorDetails?.createdTimeSpan}
                  </Typography>
                </Box>
              </Box>
            )}
            <Box sx={GenericShareModaStyles.buttonContainer}>
              <LoadingButton
                type="submit"
                variant="contained"
                disableElevation
                loading={createPostLoading}
                sx={GenericShareModaStyles.loadingButtonStyle}
              >
                Share Post
              </LoadingButton>
            </Box>
          </>
        </GoogleAnalytics>
      </Box>
    </Box>
  );
}
