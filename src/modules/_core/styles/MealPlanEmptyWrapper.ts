import styled from 'styled-components';

export const MealPlanEmptyWrapper = styled.div`
  padding: 47px;
  text-align: center;
  border-radius: 12px;
  background-color: #fff;
  .title {
    font-size: 20px;
    line-height: 26px;
    font-weight: 700;
    letter-spacing: -0.005em;
    color: ${(props) => props.theme.palette.text.primary};
  }
  .content {
    h4 {
      color: #000;
      font-size: 16px;
      font-weight: 700;
      line-height: 24px;
      letter-spacing: 0.002em;
    }
    p {
      font-size: 14px;
      line-height: 21px;
      letter-spacing: 0.004em;
      color: ${(props) => props.theme.palette.text.primary};
    }
  }
  .btn__wrap {
    margin-top: 32px;
  }
`;
