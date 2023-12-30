import React from 'react';
import { ProfileAndAppSettings } from '~/modules/profile/profileSettings/ProfileAndAppSettings';

import { LayoutArea } from '~/modules/_core/layout/LayoutArea';

const UserSettings = () => {
  return (
    <LayoutArea>
      <ProfileAndAppSettings />
    </LayoutArea>
  );
};

export default UserSettings;
