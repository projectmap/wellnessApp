import styled from 'styled-components';

export const HomePrayerWrapper = styled.div`
  width: 300px;
  padding: 24px;
  margin-left: auto;
  border-radius: 12px;
  background-color: #fff;
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
    display: block;
    font-size: 16px;
    margin-top: 32px;
    line-height: 24px;
    transition: all 0.3s ease-in;
    color: ${(props) => props.theme.palette.primary.main};
    &:hover {
      text-decoration: underline;
    }
  }
`;
