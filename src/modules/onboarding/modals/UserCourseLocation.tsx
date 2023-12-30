import React from 'react';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import { useCreateUserProfileMutation, useGetCurrentUserProfileDetailsQuery, USER_TYPE } from '@newstart-online/sdk';

import { PrimaryButton } from '~/modules/_core/bits/buttons/PrimaryButton';
import {
  CEUIcon,
  CloseBlue,
  NewstartOnlineUser,
  NewstartOnPremiseUser,
  RadioSubscriptionChecked,
  RadioSubscriptionUnChecked,
} from '~/icons';

import { USER_ONBOARDING_ROUTING, USER_SUBSCRIPTION_TYPE } from '~/state/constants';
import { GenericOnboardingSectionModal } from '~/modules/onboarding/modals/GenericOnboardingSectionModal';

interface IUserCourseLocation {
  locationType: USER_TYPE;
  isOpen: boolean;
  updateUserLocation: () => void;
  handleClose: (event: any, reason: any) => void;
  setUserLocationType: (data: USER_TYPE) => void;
  showCrossIcon?: boolean;
}
export const UserCourseLocation = (props: IUserCourseLocation) => {
  const { isOpen, locationType, updateUserLocation, handleClose, setUserLocationType, showCrossIcon } = props;
  const { data: profileData } = useGetCurrentUserProfileDetailsQuery();

  return (
    <GenericOnboardingSectionModal
      isOpen={isOpen && window?.location?.pathname !== USER_ONBOARDING_ROUTING.SIGN_IN}
      onCloseModal={handleClose}
      showCloseButton={false}
      sx={{ width: '600px' }}
    >
      <Box>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="h6">Programs</Typography>
            <Typography variant="body2">My NEWSTART experience started with</Typography>
          </Box>
          {showCrossIcon && (
            <Box sx={{ position: '', top: '-36px', right: '-16px' }}>
              <CloseBlue className="cursor-pointer" onClick={handleClose} />
            </Box>
          )}
        </Box>

        <Box sx={{ width: '100%', mt: 3 }}>
          <Box
            sx={{
              mb: 3,
              border: locationType === USER_TYPE.ONLINE ? '1px solid #0C72E0' : '1px solid #B8B8C3',
              height: '90px',
              padding: 2,
              borderRadius: 1,
              display: 'flex',
            }}
            onClick={() => setUserLocationType(USER_TYPE.ONLINE)}
            style={{ cursor: 'pointer' }}
          >
            <Box>
              {locationType === USER_TYPE.ONLINE ? (
                <RadioSubscriptionChecked style={{ cursor: 'pointer' }} />
              ) : (
                <RadioSubscriptionUnChecked />
              )}
            </Box>
            <Box sx={{ pl: '10px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <NewstartOnlineUser />
                <Typography variant="h6">Online</Typography>
              </Box>
              <Typography variant="body2">I’m a NEWSTART Online subscriber.</Typography>
            </Box>
          </Box>
          <Box
            sx={{
              mb: 3,
              border: locationType === USER_TYPE.ONPREMISES ? '1px solid #0C72E0' : '1px solid #B8B8C3',
              height: '90px',
              padding: 2,
              borderRadius: 1,
              display: 'flex',
            }}
            onClick={() => setUserLocationType(USER_TYPE.ONPREMISES)}
            style={{ cursor: 'pointer' }}
          >
            <Box>
              {locationType === USER_TYPE.ONPREMISES ? (
                <RadioSubscriptionChecked style={{ cursor: 'pointer' }} />
              ) : (
                <RadioSubscriptionUnChecked />
              )}
            </Box>
            <Box sx={{ pl: '10px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <NewstartOnPremiseUser />
                <Typography variant="h6">Residential</Typography>
              </Box>

              <Typography variant="body2">I’m a NEWSTART Lifestyle Program alumnus.</Typography>
            </Box>
          </Box>
          {!profileData?.data?.hasAccessToCeuCredits && (
            <Box
              sx={{
                mb: 3,
                border: locationType === USER_TYPE.CEUCREDITS ? '1px solid #0C72E0' : '1px solid #B8B8C3',
                height: '90px',
                padding: 2,
                borderRadius: 1,
                display: 'flex',
              }}
              onClick={() => setUserLocationType(USER_TYPE.CEUCREDITS)}
              style={{ cursor: 'pointer' }}
            >
              <Box>
                {locationType === USER_TYPE.CEUCREDITS ? (
                  <RadioSubscriptionChecked style={{ cursor: 'pointer' }} />
                ) : (
                  <RadioSubscriptionUnChecked />
                )}
              </Box>

              <Box sx={{ pl: '10px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CEUIcon />
                  <Typography variant="h6">
                    CEU credit
                    <span style={{ color: '#5A5A72', fontWeight: '400' }}>(Required nursing license number)</span>
                  </Typography>
                </Box>
                <Typography variant="body2">I’m a NEWSTART Online subscriber.</Typography>
              </Box>
            </Box>
          )}
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <PrimaryButton sx={{ borderRadius: '44px', px: '24px', py: '10px' }} onClick={updateUserLocation}>
              Continue
            </PrimaryButton>
          </Box>
        </Box>
      </Box>
    </GenericOnboardingSectionModal>
  );
};
