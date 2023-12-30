import { useAppSelector } from '~/state/app/hooks';
import { IMessageGroupResponse } from '@newstart-online/sdk';
import { useGetPrivateChatMemberInfo } from './useGetPrivateChatMemberInfo';

export const useGetOnlineUser = (groupChatDetails: IMessageGroupResponse) => {
  const privateChatMember = useGetPrivateChatMemberInfo(groupChatDetails);
  const onLineUsers = useAppSelector((state) => state.chats.onlineUsers);
  const onlineUser = onLineUsers?.includes(privateChatMember?._id);

  return onlineUser;
};
