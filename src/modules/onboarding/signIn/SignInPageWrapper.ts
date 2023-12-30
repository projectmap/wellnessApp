import styled from 'styled-components';

export const SignInPageWrapper = styled.section`
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
    button {
      width: 100%;
      background: #0c72e0;
      border-radius: 4px;
      color: #fff;
      padding: 16px 10px;
      cursor: pointer;
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
      cursor: pointer;
      align-items: center;
      justify-content: center;
      padding: 12px;
      height: 48px;
      margin-right: 12px;
      font-weight: 500;
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
