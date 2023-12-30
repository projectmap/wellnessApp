import React from 'react';
import styled from 'styled-components';

const ButtonBorderWrapper = styled.button`
  width: 176px;
  height: 48px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  border-radius: 32px;
  transition: all 0.3s ease-in;
  color: ${(props) => props.theme.palette.primary.main};
  border: 1px solid ${(props) => props.theme.palette.border.main};
  &:hover {
    border-color: ${(props) => props.theme.palette.primary.main};
  }
`;

export const ButtonBorder = ({ children }: any) => {
  return <ButtonBorderWrapper>{children}</ButtonBorderWrapper>;
};
