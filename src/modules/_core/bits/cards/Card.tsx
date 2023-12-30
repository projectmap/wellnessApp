import { Card as MuiCard, CardContent, CardContentProps, CardProps } from '@mui/material';
import React, { FC, ReactNode } from 'react';

export interface CustomCardProps {
  cardProps?: CardProps;
  cardContentProps?: CardContentProps;
  children: ReactNode;
  cardSxProps?: CardProps['sx'];
  cardContentSxProps?: CardContentProps['sx'];
}

// cardProps and cardContentProps will overide any sx
const Card: FC<CustomCardProps> = ({ children, cardContentProps, cardProps, cardSxProps, cardContentSxProps }) => {
  return (
    <MuiCard
      sx={{ boxShadow: 'none', borderColor: 'transparent', borderRadius: '12px', ...cardSxProps }}
      {...cardProps}
    >
      <CardContent sx={{ ...cardContentSxProps }} {...cardContentProps}>
        {children}
      </CardContent>
    </MuiCard>
  );
};

export { Card };
