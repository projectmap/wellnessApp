import { FC, useState, useEffect } from 'react';
import {
  useGetCurrentUserProfileDetailsQuery,
  useGetProfileQuery,
  useUpdateUserByTokenMutation,
} from '@newstart-online/sdk';

import { useAppDispatch } from '~/state/app/hooks';
import { SubscriptionModal } from '../onboarding/modals/SubscriptionModal';
import { MultiFormModal } from '~/modules/onboarding/modals/multiFormModal';
import { UserCourseLocationModal } from '../onboarding/modals/UserCourseLocationModal';
import { setUserOnboardingLocation } from '~/state/services/onboarding/onboardingSlice';
import { GatherInformationModal } from '~/modules/onboarding/modals/GatherInformationModal';
interface IOnBoardingModal {}

const OnBoardingModal: FC<IOnBoardingModal> = () => {
  const [open, setOpen] = useState<boolean>(true);

  const dispatch = useAppDispatch();

  const [updateUser] = useUpdateUserByTokenMutation();
  const { data: profileData } = useGetCurrentUserProfileDetailsQuery();

  const handleClose = () => {
    setOpen(false);
    dispatch(setUserOnboardingLocation(true));
    updateUser({ isFirstLogin: false });
  };

  const user = useGetProfileQuery();
  const firstTimeLoginByUser = user?.data?.data?.isFirstLogin;

  useEffect(() => {
    setOpen(firstTimeLoginByUser as boolean);
  }, [firstTimeLoginByUser]);

  return (
    <>
      <GatherInformationModal
        handleClose={handleClose}
        username={user.data?.data?.name}
        open={open as boolean}
        setOpen={setOpen}
      />
      {/* first we ask for gathering general information from users */}

      {!open && open !== undefined && <MultiFormModal userProfile={profileData} />}
      {/* then we gather information from users like age, weight, height etc in a multistepform*/}

      <UserCourseLocationModal />
      {/* then we ask for user's location for taking course like online or infield */}

      <SubscriptionModal />
      {/* then we ask for user's subscription type like free trial or premium user */}
    </>
  );
};

export default OnBoardingModal;
