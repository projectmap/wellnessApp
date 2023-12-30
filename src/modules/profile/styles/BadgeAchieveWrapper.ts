import styled from 'styled-components';

export const BadgeAchieveWrapper = styled.div`
  padding: 24px;
  border-radius: 12px;
  background-color: #fff;
  .award {
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
    &__list {
      display: flex;
      margin-top: 18px;
      text-align: center;
      justify-content: space-between;
      li {
        width: 113px;
        p {
          color: #000;
          margin-top: 7px;
          font-size: 12px;
          line-height: 15px;
        }
      }
    }
  }
`;
