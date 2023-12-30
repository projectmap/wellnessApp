import * as Yup from 'yup';
import Image from 'next/image';
import { Box } from '@mui/system';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Typography } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  IUser,
  MESSAGE_GROUP,
  useCreateMessageGroupMutation,
  useGetMessageGroupDetailsByIdQuery,
  useUpdateMessageGroupDetailsMutation,
} from '@newstart-online/sdk';
import { useRouter } from 'next/router';
import { UploadPhotoInGroupChatIcon } from '~/icons';
import { GroupNameInput } from '../styles/GroupNameInput';
import { useAppDispatch, useAppSelector } from '~/state/app/hooks';
import { LoadingBtn } from '~/modules/_core/bits/buttons/LoadingBtn';
import { GenericModal } from '~/modules/_core/bits/modals/DragableModal';
import { PrimaryButton } from '~/modules/_core/bits/buttons/PrimaryButton';
import { getImageExtensionFileOnlyAndCheckIfFileisOtherThanImage } from '~/utils/fileValidator';
import { setGroupChat, setIsGroupCreated, setNewGroupModal, setNewGroupName } from '~/state/services/chats/chatSlice';

interface IGroupName {
  groupName?: string;
  groupId?: string;
  image?: File;
  members?: IUser[];
}

export const GroupName = ({ groupId }: IGroupName) => {
  const newGroupName = useAppSelector((state) => state.chats.newGroupName);

  const groupChatData = useAppSelector((state) => state.chats.groupChatInfo);

  // to check if group has been already created or not
  const isGroupCreated = useAppSelector((state) => state.chats.isGroupCreated);

  const router = useRouter();
  const dispatch = useAppDispatch();

  // blob or mediasource for displaying uploaded image in input type=file and in this case UploadPhotoInGroupChatIcon
  const [groupProfileImg, setGroupProfileImg] = useState<Blob | MediaSource>();
  const [isPhotoSelected, setIsPhotoSelected] = useState(false);

  // api call for creating the group
  const [createMessageGroup, loading] = useCreateMessageGroupMutation();

  // api call for updating group properties
  const [updateMessageGroup, { isLoading: isGroupBeingCreated }] = useUpdateMessageGroupDetailsMutation();

  // api call for getting already existed group name and group image
  const { data: getCurrentGroupChatDetails } = useGetMessageGroupDetailsByIdQuery(
    (router?.query?.group as string) || '',
    {
      skip: !router?.query?.group,
    },
  );

  // state for setting the group name in the input field
  const [GroupName, setGroupName] = useState<string>(getCurrentGroupChatDetails?.data?.groupName as string);

  // func that closes the modal
  const handleClose = () => {
    dispatch(setNewGroupName(false));
    dispatch(setIsGroupCreated(false));
  };

  const groupValidaton = Yup.object().shape({
    groupName: Yup.string().trim().max(40, 'group name should not exceed 40 characters.'),
    image: Yup.string(),
  });

  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
    getValues,
  } = useForm<IGroupName>({ mode: 'onChange', resolver: yupResolver(groupValidaton) });

  // function that handles uploading gorup image from the computer
  const handleFileUpload = async () => {
    document.getElementById('image-file')?.click();
  };

  const onSubmit = (data: IGroupName) => {
    // simple ifelse to check if group has been created or not. If group is already created the we call updateMessageGroup
    if (!isGroupCreated) {
      createMessageGroup({
        associatedUser: groupChatData?.associatedUser?.map((item) => item?._id) as any,
        groupName: data?.groupName?.trim() || '',
        type: MESSAGE_GROUP.GROUP,
        image: groupProfileImg,
      })
        .unwrap()
        .then((data) => {
          toast.success(data?.message);
          dispatch(setNewGroupName(false));
          dispatch(
            setGroupChat({
              associatedUser: undefined || [],
            }),
          );
          router.push(`/user/community/chat/?group=${data?.data?._id}`); // path to push to new groupId
          handleClose(); // set isGroupCreated state to false
        })
        .catch((data) => toast.error(data?.message));
    } else {
      if (data?.groupName?.trim().length !== 0 || GroupName !== '') {
        updateMessageGroup({
          groupId: groupId as string,
          groupName: data?.groupName
            ? (data?.groupName as string)
            : (getCurrentGroupChatDetails?.data?.groupName as string),
          image: groupProfileImg,
        })
          .unwrap()
          .then((data) => {
            toast.success('Group Updated Successfully');
            handleClose();
          });
      }
    }
  };

  return (
    <>
      <GenericModal
        isOpen={newGroupName}
        onCloseModal={() => {
          setGroupProfileImg(undefined);
          handleClose();
        }}
        showCloseButton={false}
        closeModalCross={true}
        title={isGroupCreated ? 'Change Group Name' : 'New Group'}
        sx={{ width: '509px' }}
      >
        <GroupNameInput>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {!isGroupCreated && groupProfileImg === undefined && (
                  <Box
                    sx={{
                      marginY: 3,
                      cursor: 'pointer',
                    }}
                  >
                    <UploadPhotoInGroupChatIcon onClick={handleFileUpload} className="cursor-pointer" />
                  </Box>
                )}

                {!isGroupCreated && groupProfileImg && (
                  <Image
                    className="avatar cursor-pointer"
                    src={URL.createObjectURL(groupProfileImg)}
                    height={109.85}
                    width={109.85}
                    alt={groupProfileImg && getCurrentGroupChatDetails?.data?.groupName}
                    onClick={handleFileUpload}
                  />
                )}

                {/* UploadPhotoInGroupChatIcon is rendered only if groupProfileImg state is undfined and a new group has to be created or existing group has to be updated */}
                {/*  when to render UploadPhotoInGroupChatIcon ? when groupProfileImg is undefined and when groupImage is not available(i.e. it donot exits in DB)
                      when to render groupImage ? when groupProfileImg is FILE or Blob and when groupImage exits in the database */}
                {isGroupCreated &&
                  groupProfileImg === undefined &&
                  !getCurrentGroupChatDetails?.data?.groupImage?.completedUrl && (
                    <Box
                      sx={{
                        marginY: 3,
                        cursor: 'pointer',
                      }}
                    >
                      <UploadPhotoInGroupChatIcon onClick={handleFileUpload} className="cursor-pointer" />
                    </Box>
                  )}
                {isGroupCreated && getCurrentGroupChatDetails?.data?.groupImage?.completedUrl && (
                  // inside src on below mentioned image we have groupProfileImg state and if it's state is not undefined then
                  // we render the image uploaded from
                  // computer otherwise we render the existing groupImage if we have it on DB

                  <Image
                    className="avatar cursor-pointer"
                    src={
                      groupProfileImg !== undefined
                        ? URL.createObjectURL(groupProfileImg)
                        : getCurrentGroupChatDetails?.data?.groupImage?.completedUrl
                    }
                    height={109.85}
                    width={109.85}
                    alt={groupProfileImg && getCurrentGroupChatDetails?.data?.groupName}
                    onClick={handleFileUpload}
                  />
                )}

                <input
                  id="image-file"
                  type="file"
                  accept="image/png, image/jpeg"
                  {...register('image')}
                  hidden
                  onChange={(e) => {
                    if (e?.target?.files) {
                      // not to accept svg or any other file format
                      const { containsInvalidFormatFile } = getImageExtensionFileOnlyAndCheckIfFileisOtherThanImage(
                        (e?.target?.files as any) || [],
                      );
                      if (containsInvalidFormatFile) {
                        toast.error('Can accept any image file');

                        return;
                      }
                      setGroupProfileImg(e.target.files?.[0]);
                      setIsPhotoSelected(true);
                    }
                  }}
                />
              </Box>

              <div className="input-wrapper">
                <Typography variant="body1" sx={{ mb: '3px' }}>
                  Group chat name
                </Typography>

                <input
                  type="text"
                  {...register('groupName', {
                    required: { value: true, message: 'Please enter your group name.' },
                  })}
                  style={{ border: errors.groupName?.message ? '1px solid #F81E1E' : '1px solid #b8b8c3' }}
                  placeholder={isGroupCreated ? getCurrentGroupChatDetails?.data?.groupName : ''}
                  onChange={(e) => setGroupName(e.target.value)}
                />
                {errors.groupName && (
                  <span role="alert" className="error-msg">
                    {errors.groupName.message}
                  </span>
                )}
              </div>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3 }}>
                <PrimaryButton
                  onClick={() => {
                    dispatch(setNewGroupModal(true));
                    dispatch(setNewGroupName(false));
                  }}
                  type="button"
                  sx={{
                    borderRadius: '36px',
                    border: '1px solid #147AE9',
                    width: '45%',
                    backgroundColor: 'transparent',
                    color: '#147AE9',
                    '&:hover': {
                      color: '#FFF',
                    },
                  }}
                >
                  Back
                </PrimaryButton>
                <LoadingBtn
                  sx={{ borderRadius: '36px', width: '45%' }}
                  loading={loading?.isLoading || isGroupBeingCreated}
                  disabled={
                    !isPhotoSelected &&
                    (GroupName?.trim() === '' ||
                      typeof GroupName === 'undefined' ||
                      getCurrentGroupChatDetails?.data?.groupName === GroupName?.trim())
                  }
                >
                  Save
                </LoadingBtn>
              </Box>
            </form>
          </div>
        </GroupNameInput>
      </GenericModal>
    </>
  );
};
