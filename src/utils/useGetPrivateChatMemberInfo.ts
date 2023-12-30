import { IMessageGroupResponse, MESSAGE_GROUP } from '@newstart-online/sdk';

export const useGetPrivateChatMemberInfo = (groupChatDetails: IMessageGroupResponse) => {
  const privateChatMember: any =
    groupChatDetails?.data?.type === MESSAGE_GROUP.PRIVATE &&
    groupChatDetails?.data?.associatedUser?.filter(
      (item: any) => item?._id !== groupChatDetails?.data?.createdBy?._id,
    )?.[0];

  return privateChatMember;
};
