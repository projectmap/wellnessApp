import styled from 'styled-components';

export const GroupNameInput = styled.div`
  height: fit-content;
  width: 100%;
  position: relative;
  form {
    width: 100%;
    input {
      background-color: ${(props) => props.theme.palette.background.default};
      width: 100%;
      border: 1px solid #b8b8c3;
      border-radius: 4px;
      height: 48px;
      padding: 12.5px 12px;
      font-size: 16px;
    }
    .error-msg {
      color: ${(props) => props.theme.palette.error.main};
      display: block;
      width: 90%;
      margin-top: 8px;
     }    
    }
  }
`;
