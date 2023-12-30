import styled from 'styled-components';

export const PrayerModalWrapper = styled.div`
  padding: 32px;
  width: 557.25px;
  text-align: center;
  border-radius: 12px;
  background-color: #fff;
  .wrap {
    width: 340px;
    margin: auto;
    color: ${(props) => props.theme.palette.text.primary};
  }
  .title {
    font-size: 24px;
    line-height: 31.2px;
    letter-spacing: -0.005em;
  }
  .para {
    font-size: 14px;
    line-height: 21px;
    margin-top: 11px;
    letter-spacing: 0.004em;
  }
  .form {
    margin-top: 24px;
    input {
      font-size: 14px;
    }
    .text--field {
      > div {
        padding: 16px;
      }
    }
  }
`;
