import styled from 'styled-components';

export const ProfileChallengeWrapper = styled.div`
  padding: 24px;
  border-radius: 12px;
  background-color: #fff;
  .challenge {
    &__title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      h3 {
        font-size: 18px;
        line-height: 27px;
        font-weight: 600;
        color: ${(props) => props.theme.palette.text.primary};
        span {
          margin-left: 15px;
          color: ${(props) => props.theme.palette.primary.main};
        }
      }
    }
  }
`;
