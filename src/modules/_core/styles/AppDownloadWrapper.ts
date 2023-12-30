import styled from 'styled-components';

export const AppDownloadWrapper = styled.div`
  padding: 32px;
  width: 557px;
  border-radius: 12px;
  background-color: #fff;
  .download {
    &__header {
      color: ${(props) => props.theme.palette.text.primary};
      h3 {
        font-size: 24px;
        line-height: 31px;
        letter-spacing: -0.005em;
      }
    }
    &__wrapper {
      display: flex;
      gap: 10px;
    }
    &__store {
      margin-top: 11px;
      p {
        font-size: 14px;
        line-height: 21px;
        letter-spacing: 0.004em;
      }
      ul {
        margin-top: 20.5px;
        li {
          &:not(:first-child) {
            margin-top: 16px;
          }
        }
      }
    }
    &__mobile {
      flex-shrink: 0;
    }
  }
`;
