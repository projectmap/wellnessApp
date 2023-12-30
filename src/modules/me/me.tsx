import React from 'react';
import { SCREEN_SECTION } from '@newstart-online/sdk';

import Posts from './Posts';
import Profile from './Profile';
import { NoPermission } from '../learn/No-Permission';

type Props = {
  type: string | undefined;
  id: string | undefined;
  hasPermission: boolean | undefined | null;
};

export const MeComponent: React.FC<Props> = ({ type, id, hasPermission }) => {
  if (!hasPermission) {
    return <NoPermission />;
  }

  switch (type) {
    case SCREEN_SECTION.ME_PROFILE:
      return <Profile />;
    case SCREEN_SECTION.ME_POSTS:
      return <Posts />;
    default:
      return <></>;
  }
};
