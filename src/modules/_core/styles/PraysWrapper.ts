import styled from 'styled-components';

export const PraysWrapper = styled.div`
  padding: 24px;
  border-radius: 12px;
  background-color: #fff;
  background: #f4f5fc;
  .pray {
    &__content {
      text-align: center;
      h3 {
        font-size: 20px;
        margin-top: 17px;
        line-height: 26px;
        letter-spacing: -0.005em;
        color: ${(props) => props.theme.pale};
      }
    }
  }
  .pray--send {
    cursor: pointer;
    display: block;
    margin: 0 auto;
    margin-top: 32px;
    line-height: 24px;
    transition: all 0.3s ease-in;
    text-transform: capitalize;
    font-size: 14px;
    background: #0c72e0;
    padding: 12px 28px;
    width: 60%;
    border-radius: 40px;
    color: #fff;
  }
`;
