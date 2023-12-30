import styled from 'styled-components';

export const RecordLogQuestionareModalWrapper = styled.section`
  width: 463px;
  padding: 24px;
  border-radius: 12px;
  background-color: #fff;

  form {
    width: 100%;

    .input {
      width: 100%;
      border-radius: 4px;
      height: 48px;
      padding: 12.5px 12px;
      font-size: 16px;
      border: 1px solid #b8b8c3;
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
