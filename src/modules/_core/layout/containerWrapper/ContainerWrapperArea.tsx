import React from 'react';
import { Container } from '@mui/material';
import { ContainerWrapper } from '~/modules/_core/styles/ContainerWrapper';

/* Defining the type of the children prop that is being passed into the ContainerWrapperArea
function. */
interface ContainerProps {
  children: React.ReactNode;
}

/* A function that takes in a children prop and returns a ContainerWrapper component with a Container
component inside of it. */
export const ContainerWrapperArea = (children: ContainerProps) => {
  return (
    <ContainerWrapper>
      <Container
        sx={{
          backgroundImage: {
            xs: 'none',
          },
        }}
        maxWidth="xl"
        {...children}
      ></Container>
    </ContainerWrapper>
  );
};
