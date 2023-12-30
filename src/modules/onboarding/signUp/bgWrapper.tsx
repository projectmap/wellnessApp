import { Box } from '@mui/system';
import React, { FC, ReactNode } from 'react';

const BgWrapperOnboarding: FC<{ children: ReactNode }> = ({ children }) => {
  return <Box className="BgWrapperOnboarding">{children}</Box>;
};

export default BgWrapperOnboarding;
