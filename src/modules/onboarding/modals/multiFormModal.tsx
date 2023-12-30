import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useAppSelector } from '~/state/app/hooks';

import { USER_ONBOARDING_STEPS } from '~/state/constants';
import { HealthInfoModal } from './MultiformModal/HealthInfoModal';
import { UserAvatarModal } from './MultiformModal/UserAvatarModal';
import { GeneralInfoModal } from './MultiformModal/GeneralInfoModal';
import { IUserProfileResponse } from '@newstart-online/sdk';
type IProps = {
  userProfile: IUserProfileResponse | undefined;
};
export const MultiFormModal: React.FC<IProps> = ({ userProfile }) => {
  const activeStep = useAppSelector((state) => state.onboarding.activeStep);

  const renderMultiform = () => {
    switch (activeStep) {
      case 1:
        if (activeStep === USER_ONBOARDING_STEPS.GENERAL_INFO) {
          return <GeneralInfoModal userProfile={userProfile} />;
        }
        break;
      case 2:
        if (activeStep === USER_ONBOARDING_STEPS.HEALTH_INFO) {
          return <HealthInfoModal userProfile={userProfile} />;
        }
        break;
      case 3:
        if (activeStep === USER_ONBOARDING_STEPS.USER_AVATAR) {
          return <UserAvatarModal />;
        }
        break;
      default:
        return null;
    }
  };

  return <>{renderMultiform()}</>;
};
