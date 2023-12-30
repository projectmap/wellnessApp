import React from 'react';
import moment from 'moment';
import { useRouter } from 'next/router';
import { Socket, io } from 'socket.io-client';
import { Box, CircularProgress, Modal, Typography } from '@mui/material';

import { MessagesLog } from './MessagesLog';
import { useGetUser } from '~/utils/useGetUser';
import { ChatGroupMessage, IMessages } from './Types';
import { MESSAGE_DELETED_TEXT } from '~/state/constants';
import { MessagesSentByUser } from './MessagesSentByUser';
import { socketEnvironment } from '~/utils/socket-environment';
import MessageLogSkeleton from '../Skeletons/MessageLogSkeleton';
import { MessagesReceivedByUser } from './MessagesReceivedByUser';
import { useAppDispatch, useAppSelector } from '~/state/app/hooks';
import { setIsImageLoading } from '~/state/services/chats/chatSlice';
import MessageSentByUserSkeleton from '../Skeletons/MessageSentByUserSkeleton';
import MessageReceivedByUserSkeleton from '../Skeletons/MessageReceivedByUserSkeleton';
import {
  CHAT_MESSAGE_ACTIONS,
  CHAT_MESSAGE_TYPE,
  IChatMessage,
  IUser,
  useListMessageListByGroupIdQuery,
} from '@newstart-online/sdk';
import { ImageBoxForChatMessage } from './ImageBoxForChatMessage';

// component that will fetch all the messages sent and received by the user and rendering of those lists
const ChatMessageLists = ({ isGroupChat }: IMessages) => {
  const [page, setPage] = React.useState(1);
  const router = useRouter();
  const messagesEndRef = React.useRef<any>(null);
  const prevScrollY = React.useRef(0);
  const user = useGetUser();
  const dispatch = useAppDispatch();
  const [messageLists, setMessageLists] = React.useState<IChatMessage[]>([]);
  const [typingUser, setTypingUser] = React.useState<string>('');
  const [isFetching, setIsFetching] = React.useState<boolean>(false);
  const [imageModal, setImageModal] = React.useState<boolean>(false);
  const [clickedImageSrc, setClickedImageSrc] = React.useState<string>('');
  const debounceTimeoutRef = React.useRef<any>(null);

  const isImageSending = useAppSelector((state) => state.chats.isImageSending);

  const [groupByDateMessageLists, setGroupByDateMessageLists] =
    React.useState<{ date: string; chats: IChatMessage[] }[]>();

  // api call
  const {
    data: chatList,
    isFetching: messageLoading,
    isLoading: dataLoading,
  } = useListMessageListByGroupIdQuery({ messageGroupId: router?.query?.group as string, page, perPage: 10 } || '', {
    skip: !router?.query?.group,
  });

  const [socket, setSocket] = React.useState<Socket>();
  // function to automatically scroll the user to the bottom of the page when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  // socket connection config
  React.useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_CHAT_RESPONSE_API_URL as string, socketEnvironment);
    setSocket(socket);
  }, []);

  // get and listen data from socket while sending, receiving and deleting messages
  React.useEffect(() => {
    if (router?.query?.group && socket && user) {
      socket.on(router?.query?.group as string, (data: IChatMessage) => {
        if (data?.mediaFiles?.length !== 0) {
          //to show loader while sending images
          dispatch(setIsImageLoading(false));
        }

        if (data?.action === CHAT_MESSAGE_ACTIONS.DELETE) {
          //to render deleted messages
          setMessageLists((prevChat) => {
            const deletedDataIndex = prevChat?.findIndex((msg) => msg?._id === data?._id);

            let newMessageLists = [...prevChat];

            if (deletedDataIndex) {
              newMessageLists = newMessageLists.map((item) => {
                if (item._id === data?._id) {
                  return {
                    ...item,
                    text: MESSAGE_DELETED_TEXT.DELETE_MSG,
                    mediaFiles: [],
                  };
                }

                return {
                  ...item,
                };
              });
            }

            return [...newMessageLists];
          });
        } else {
          setMessageLists((prevChat) => [...prevChat, { ...data }]);
        }

        scrollToBottom();
      });
    }
  }, [router?.query?.group, socket, user]);

  // todo future refrence
  React.useEffect(() => {
    if ((router?.query?.group as string) && socket) {
      socket.on((router?.query?.group as string) + 'check typing', (data) => {
        let typing = '';

        data?.forEach((item: IUser, index: number) => {
          const userLists: any = [...data].filter((item) => item._id !== user?._id);
          if (item._id !== user?._id) {
            typing =
              typing + item.name + (userLists.length > 1 ? (userLists.length === index - 1 ? ' and ' : ', ') : '');
          }
        });
        scrollToBottom();

        setTypingUser(typing);
      });
    }
  }, [router?.query?.group, user?._id, socket]);

  //to get group messages chuncks datewise
  const getMessageGroupByDate = (data: IChatMessage[]) => {
    const groups = data.reduce((groups, chat) => {
      const date = chat?.createdAt?.toString().split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(chat);

      return groups;
    }, {} as ChatGroupMessage);

    // Edit: to add it in the array format instead
    const groupArrays = Object.keys(groups).map((date) => {
      return {
        date,
        chats: groups[date],
      };
    });

    return groupArrays;
  };

  React.useEffect(() => {
    if (chatList?.data) {
      const reverseChats = [...(chatList?.data || [])].reverse();
      const newChats = [...reverseChats, ...(messageLists || [])];
      setMessageLists(newChats);
    }
  }, [chatList]);

  React.useEffect(() => {
    if (messageLists && chatList) {
      const newChats = [...(messageLists || [])];
      const groupByDateMessages = getMessageGroupByDate(newChats);
      setGroupByDateMessageLists(groupByDateMessages as any);
      if (chatList.currentPage === 2) {
        scrollToBottom();
      }
    }
  }, [messageLists]);

  // part of custom infinite scroll component which handles scroll to top of page and fetches paginated message list
  const handleScroll = React.useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      const currentScrollY = document.documentElement.scrollTop;
      // this statement checks if the user is scrolling up
      const isScrollingUp =
        currentScrollY < (prevScrollY.current === 0 ? document.documentElement.offsetHeight : prevScrollY.current);
      if (chatList?.totalPage !== page && !dataLoading && isScrollingUp) {
        setPage((page) => page + 1);
      }
      prevScrollY.current = document.documentElement.scrollTop;
    }, 200);
  }, [chatList?.totalPage, messageLoading, page, dataLoading]);

  // next js requirement for window to be defined
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const checkIfSentByIsCurrentUser = (id: string) => id === user?._id;

  const handleOnImageClicked = (imgSrc: string) => {
    setClickedImageSrc(imgSrc);
    setImageModal(true);
  };

  return (
    <>
      <Modal open={imageModal} onClose={() => setImageModal(false)}>
        <ImageBoxForChatMessage closeModal={() => setImageModal(false)} imageSrc={clickedImageSrc} />
      </Modal>
      <Box className="hide-scrollbar" sx={{ pb: '20px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {dataLoading && <CircularProgress sx={{ color: '#cccccc' }} />}
        </Box>
        {groupByDateMessageLists?.map((item, id) => {
          return (
            <Box key={id}>
              <Typography sx={{ fontSize: '13px', fontWeight: 400, color: '#717186', my: '25px', textAlign: 'center' }}>
                {moment(item?.date?.split('T')[0]).calendar().split('at')[0] + ''}
              </Typography>

              {item?.chats?.map((msg, idx) => {
                const isLastMessage = idx === item?.chats?.length - 1 ? true : false;

                if (checkIfSentByIsCurrentUser(msg?.sentBy?._id) && msg?.messageType !== CHAT_MESSAGE_TYPE.LOG) {
                  return messageLoading && groupByDateMessageLists?.length === 0 ? (
                    <MessageSentByUserSkeleton key={idx} />
                  ) : (
                    <MessagesSentByUser
                      setClickedImageSrc={handleOnImageClicked}
                      key={idx}
                      msg={msg}
                      isGroupChat={isGroupChat}
                      isLastMsg={isLastMessage}
                    />
                  );
                }
                if (msg?.messageType !== CHAT_MESSAGE_TYPE.LOG) {
                  return messageLoading && groupByDateMessageLists?.length === 0 ? (
                    <MessageReceivedByUserSkeleton key={idx} />
                  ) : (
                    <MessagesReceivedByUser setClickedImageSrc={handleOnImageClicked} msg={msg} key={idx} />
                  );
                } else {
                  return messageLoading ? <MessageLogSkeleton key={idx} /> : <MessagesLog msg={msg} key={idx} />;
                }
              })}
            </Box>
          );
        })}
        {typingUser && (
          <Typography
            sx={{ fontSize: '13px', fontWeight: 400, color: '#717186', my: '25px' }}
            textTransform="capitalize"
            id="typing"
          >
            {typingUser} typing...
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        {isImageSending && <CircularProgress sx={{ color: '#cccccc' }} />}
      </Box>
      <div ref={messagesEndRef} id="messageRef" />
    </>
  );
};

export default ChatMessageLists;
