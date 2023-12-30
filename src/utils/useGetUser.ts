import { IUser, useGetProfileQuery } from '@newstart-online/sdk';

export const useGetUser = (): IUser | undefined => {
  const { data } = useGetProfileQuery();

  const user = data?.data;

  return user;
};
