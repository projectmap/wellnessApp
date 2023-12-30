import styled from 'styled-components';

export const FeatureResourceCardWrapper = styled.div`
  margin-right: 16px;
  picture {
    display: block;
    overflow: hidden;
    border-radius: 4.36664px;
  }
  .content {
    margin-top: 16px;
    h4 {
      font-size: 16px;
      font-weight: 700;
      line-height: 24px;
      padding-right: 27px;
      letter-spacing: 0.002em;
      color: ${(props) => props.theme.palette.text.primary};
    }
    p {
      opacity: 0.5;
      font-size: 14px;
      font-weight: 400;
      letter-spacing: 0.004em;
      text-transform: capitalize;
      color: ${(props) => props.theme.palette.text.primary};
    }
  }
`;
