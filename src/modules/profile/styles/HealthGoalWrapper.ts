import styled from 'styled-components';

export const HealthGoalWrapper = styled.div`
  padding: 24px;
  border-radius: 12px;
  background-color: #fff;
  .goal {
    &__title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      h3 {
        font-size: 18px;
        line-height: 27px;
        font-weight: 600;
        color: ${(props) => props.theme.palette.text.primary};
      }
    }
    &__list {
      ul {
        display: flex;
        flex-wrap: wrap;
        li {
          width: 50%;
          padding: 16px;
          text-align: center;
          p {
            font-size: 16px;
            line-height: 22.64px;
            color: ${(props) => props.theme.palette.text.primary};
          }
          h3 {
            margin-top: 9px;
            font-size: 26px;
            line-height: 39px;
            letter-spacing: 0.0015em;
          }
          &:nth-child(3),
          &:nth-child(4) {
            border-top: 1px solid ${(props) => props.theme.palette.border.light};
          }
        }
      }
    }
  }
`;
