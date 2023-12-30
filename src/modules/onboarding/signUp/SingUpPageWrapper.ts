import styled from 'styled-components';

export const SignUpPageWrapper = styled.section`
  height: fit-content;
  height: 100vh;
  width: 100%;
  .signup-section {
    display: flex;
    justify-content: space-between;
    align-items: end;
  }
  form {
    width: 100%;
    .input-wrapper {
      position: relative;
      margin-bottom: 24px;
    }
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
    button {
      width: 100%;
      background: #0c72e0;
      border-radius: 4px;
      cursor: pointer;
      color: #fff;
      padding: 16px 10px;
      font-size: 16px;
      margin-top: 8px;
      font-weight: 500;
    }
    .social-logins {
      background-color: transparent;
      border: 0.5px solid #d0d0d7;
      border-radius: 4px;
      color: #131336;
      display: flex;
      align-items: center;
      justify-content: center;

      height: 48px;
      cursor: pointer;
      margin-right: 12px;
      font-weight: 500;
      padding: 12px;
    }
    .onboarding-internal-link {
      color: #0c72e0;
      font-family: 'TT Commons Pro', sans-serif;
      text-decoration: none;
      font-size: 16px;
      font-weight: 700;
      display: flex;
      align-items: center;
      width: 100%;
    }
    .showpassword {
      position: absolute;
      right: 6px;
      top: 27px;
      cursor: pointer;
      padding: 12px;
    }
  }
  .onboading-carousel {
    width: 50%;
  }
`;
