import {
  IChatMessageInput,
  MESSAGE_GROUP,
  useCreateChatMessageMutation,
  useGetMessageGroupDetailsByIdQuery,
} from '@newstart-online/sdk';
import { Theme } from '@mui/system';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Popover from '@mui/material/Popover';
import { Socket, io } from 'socket.io-client';
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react';
import { IconButton, Stack, TextField, Box, SxProps } from '@mui/material';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';

import { useAppDispatch } from '~/state/app/hooks';
import { ContestIcon, PlusAttachmentIcon } from '~/icons';
import { socketEnvironment } from '~/utils/socket-environment';
import { setIsImageLoading } from '~/state/services/chats/chatSlice'; //state for showing loader while sending images
import { textInputWhiteSpaceValidator } from '~/utils/textInputWhiteSpaceValidator';
import { getImageExtensionFileOnlyAndCheckIfFileisOtherThanImage } from '~/utils/fileValidator';

interface IChatMessageInputField {
  sx?: SxProps<Theme> | undefined;
}

const ChatMessageInput = ({ sx }: IChatMessageInputField) => {
  const router = useRouter();
  const [text, setText] = useState<string>('');
  const [socket, setSocket] = React.useState<Socket>();
  const dispatch = useAppDispatch();

  //api call
  const { data: getCurrentGroupChatDetails } = useGetMessageGroupDetailsByIdQuery(
    (router?.query?.group as string) || '',
    {
      skip: !router?.query?.group,
    },
  );

  // mutation call
  const [sendMessage] = useCreateChatMessageMutation();

  const [file, setFile] = useState<File[] | null>(); // for uploading and sending files like images

  const checkIfMemberIsNotActiveAccountUser = () => {
    return (
      getCurrentGroupChatDetails?.data?.type === MESSAGE_GROUP.PRIVATE &&
      getCurrentGroupChatDetails?.data?.associatedUser?.some((item) => !item.isActive)
    );
  };

  const onMessageSend = () => {
    if (router?.query?.group) {
      let filteredFile: File[] = [];
      const postData: IChatMessageInput = { messageGroup: router.query.group as string };

      const ifMessageContainsOnlyWhiteSpace = textInputWhiteSpaceValidator(text);

      if (file) {
        const fileList = file;

        const { filteredFile: files, containsInvalidFormatFile } =
          getImageExtensionFileOnlyAndCheckIfFileisOtherThanImage(fileList);
        filteredFile = [...files];

        if (containsInvalidFormatFile) {
          toast.error('You can only send images in chat');
        }

        postData['files'] = filteredFile;
        dispatch(setIsImageLoading(true));
      }

      if (text) {
        postData['text'] = text;
      }

      // validate file format and text before sending messages
      if (filteredFile?.length || (text && !ifMessageContainsOnlyWhiteSpace)) {
        !checkIfMemberIsNotActiveAccountUser() &&
          sendMessage(postData)
            .unwrap()
            .then(() => {
              setText('');
              setFile(null);
              dispatch(setIsImageLoading(false));
            })
            .catch((err) => toast.error(err?.data?.message));
      }
    }
  };

  React.useEffect(() => {
    if (file) {
      onMessageSend();
    }
  }, [file]);

  const onEmojiClick = (e: any) => {
    setText((text) => (text || '') + e.emoji);
  };

  React.useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_API_URL as string, socketEnvironment);
    setSocket(socket);
  }, []);
  let timeout: any = null;

  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        py: 1,
        px: 2,
        ...sx,
        pointerEvents:
          checkIfMemberIsNotActiveAccountUser() ||
          (getCurrentGroupChatDetails?.data && !getCurrentGroupChatDetails?.data?.isActive)
            ? 'none'
            : 'auto',
      }}
    >
      <TextField
        placeholder={
          checkIfMemberIsNotActiveAccountUser()
            ? ' User has deactivated account. You cannot send a message'
            : getCurrentGroupChatDetails?.data && !getCurrentGroupChatDetails?.data?.isActive
            ? 'You are not friend with this user anymore.'
            : 'Message'
        }
        variant="filled"
        value={text}
        multiline
        rows={1}
        sx={{
          position: 'relative',
          '& .MuiFilledInput-root': {
            background: '#F2F3F5',
            border: '1px solid #E1E3E6',
            borderTopLeftRadius: '25px',
            borderBottomLeftRadius: '25px',
            height: '52px',
            overflowY: 'hidden',
            p: '12px 12px 8px',
          },
          '& .MuiFilledInput-root:before': {
            borderBottom: 'none',
            content: 'none',
          },
          '& .MuiFilledInput-root:after': {
            borderBottom: 'none',
            content: 'none',
          },
          width: '94%',
          '& .MuiFilledInput-input': {
            py: 1.25,
            color: '##818C99',
          },
        }}
        onKeyUp={(e) => {
          clearTimeout(timeout);

          // Make a new timeout set to go off in 1000ms (1 second)
          timeout = setTimeout(function () {
            if (socket) {
              socket.emit('typing', { messageGroup: router.query.group as string, isTyping: false });
            }
          }, 5000);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();

            onMessageSend();
          } else {
            if (socket) {
              socket.emit('typing', { messageGroup: router.query.group as string, isTyping: true });
            }
          }
        }}
        onChange={(e) => setText(e.target.value)}
      />

      <Stack
        direction="row"
        alignItems="center"
        sx={{
          position: 'absolute',
          right: '2%',
          background: '#F2F3F5',
          border: '1px solid #E1E3E6',
          borderTopRightRadius: '25px',
          borderBottomRightRadius: '25px',
          height: '52px',
        }}
      >
        <IconButton aria-label="upload picture" component="label">
          <input
            hidden
            accept="image/png, image/jpeg, image/jpg"
            type="file"
            onChange={(e) => setFile(e.target.files as any)}
            multiple
          />
          <PlusAttachmentIcon />
        </IconButton>

        <PopupState variant="popover" popupId="demo-popup-popover">
          {(popupState) => (
            <div>
              <IconButton {...bindTrigger(popupState)}>
                <ContestIcon />
              </IconButton>
              <Popover
                {...bindPopover(popupState)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
              >
                {/* emoji picker where configuration is set to APPLE styles emojis and data is being loaded locally from the assests/emojiData folder with lazy loading */}
                <EmojiPicker
                  onEmojiClick={onEmojiClick}
                  lazyLoadEmojis={true}
                  getEmojiUrl={(unified, emojiStyle) => {
                    return `/assets/emojiData/img-apple-64/${unified}.png`; //for refrence of additional data go to https://github.com/iamcal/emoji-data
                  }}
                  emojiStyle={EmojiStyle.APPLE}
                />
              </Popover>
            </div>
          )}
        </PopupState>
      </Stack>
    </Box>
  );
};

export default ChatMessageInput;
