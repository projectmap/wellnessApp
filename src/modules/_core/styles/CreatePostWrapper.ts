import styled from 'styled-components';

export const CreatePostWrapper = styled.div`
  width: 577px;
  padding: 30px;
  border-radius: 12px;
  background-color: #fff;
  .title {
    font-size: 24px;
    font-weight: 700;
    line-height: 32px;
    letter-spacing: -0.005em;
    color: ${(props) => props.theme.palette.text.primary};
  }
  .form {
    &__wrapper {
      margin-top: 25px;
    }
  }
  .btn {
    &__wrap {
      display: flex;
      margin-top: 48px;
      justify-content: center;
    }
    &--create {
      width: 229px;
      height: 53px;
    }
  }
  .control__wrap {
    margin-top: 13px;
    position: relative;
    .icon--add {
      top: 10px;
      right: 65px;
      position: absolute;
      svg {
        width: 23px;
        height: 23px;
      }
    }
    .form--control {
      font-size: 17px;
      background: ${(props) => props.theme.palette.background.default};
    }
  }
  .text--field {
    font-size: 16px;
  }
`;
