import styled from 'styled-components';

export const ModalWrapper = styled.div`
  outline: none;
  border: none;

  .onboarding-info-unit-btn {
    width: 128px;
    height: 32px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 40px;
    display: flex;
    align-items: center;

    .unit_btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      cursor: pointer;
      font-weight: 500;
    }
    .selected {
      border: 1px solid #0c72e0;
      display: flex;
      color: #0c72e0;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 32px;
      padding: 8px, 10px, 8px, 10px;
      border-radius: 40px;
      background: #e8f2fd;
      cursor: pointer;
      transition: width 1s ease-in;
    }
  }

  .skip-btn {
    cursor: pointer;
    font-weight: 700;
    margin-right: 42px;
    font-size: 16px;
  }
  .margin-top-80 {
    margin-top: 80px;
  }
  form {
    width: 100%;
  }
  .onboarding_input {
    background-color: none;
    width: 100%;
    border: 1px solid #b8b8c3;
    border-radius: 4px;
    height: 48px;
    padding: 12.5px 12px;
    font-size: 16px;
  }

  .stepper {
    width: 100%;
  }

  .checkbox-container {
    display: block;
    position: relative;
    margin-bottom: 24px;
    padding-left: 30px;
    cursor: pointer;
    font-size: 16px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }
    .checkmark {
      position: absolute;
      top: -4px;
      left: 0;
      height: 20.75px;
      width: 20.75px;
      border: 2px solid #a1a1af;
      border-radius: 4px;
    }
  }
  .checkbox-container input:checked ~ .checkmark {
    background-image: url('/assets/icons/Subtract.svg');
    border: none;
  }
  .checkbox-container input .checkmark:after {
    content: '';
    position: absolute;
    display: none;
  }
  .checkbox-container input:checked ~ .checkmark:after {
    display: block;
  }
  .checkbox-container .checkmark:after {
    left: 9px;
    top: 5px;
    width: 5px;
    height: 5px;
    border: 1px solid #fff;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }

  .button-wrapper {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    .button-filled {
      background-color: #0c72e0;
      border-radius: 32px;
      color: #fff;
      padding: 16px 53px;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .button-outline {
      background-color: none;
      color: #0c72e0;

      cursor: pointer;
      font-size: 16px;
      width: 100%;
      margin-bottom: 24px;
      margin-top: 24px;
    }
  }
  .gender-wrapper {
    cursor: pointer;
  }
  .gender-label {
    width: 120px;
    height: 90px;
    padding-left: 20px;
    padding-right: 20px;
    text-align: center;
    border-radius: 4px;
    text-transform: capitalize;
    background: transparent;
    border: 1px solid #e8f2fd;
    margin-right: 24px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    font-weight: 600;
    .gender {
      width: 100%;
      height: 90px;
      border-radius: 4px;
      position: absolute;
      appearance: none;
      cursor: pointer;
    }
  }
  .gender-label-selected {
    width: 120px;
    height: 90px;
    padding-left: 20px;
    padding-right: 20px;
    text-align: center;
    border-radius: 4px;
    background: #e8f2fd;
    border: 1px solid #0c72e0;
    margin-right: 24px;
    display: flex;
    font-weight: 600;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    text-transform: capitalize;
    cursor: pointer;
    .gender {
      appearance: none;
    }
  }
`;
