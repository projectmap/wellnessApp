import { IMessageGroupResponse, IUser } from '@newstart-online/sdk';

export const useGetGroupName = (groupChatDetails: IMessageGroupResponse) => {
  let name = groupChatDetails?.data?.associatedUser
    ?.filter((item) => item.isActive)
    ?.map((item: IUser) => item?.name)
    ?.slice(0, 2)
    ?.join(',');

  if (groupChatDetails?.data?.groupName) {
    name = groupChatDetails?.data?.groupName;
  }

  return name;
};
