import moment from 'moment';
import { IMessageGroupResponse, IUserProfileResponse, MESSAGE_GROUP } from '@newstart-online/sdk';

import { useGetPrivateChatMemberInfo } from './useGetPrivateChatMemberInfo';

export const useGetUserLastActiveTime = (
  groupChatDetails: IMessageGroupResponse,
  currentUser: IUserProfileResponse | undefined,
) => {
  const privateChatMember =
    groupChatDetails?.data?.type === MESSAGE_GROUP.PRIVATE &&
    groupChatDetails?.data?.associatedUser?.filter((item: any) => item?._id !== currentUser?.data?.user)?.[0];
  const lastActive = moment(privateChatMember?.lastActiveAt).fromNow();

  return lastActive;
};
