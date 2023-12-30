import styled from 'styled-components';

export const PeopleCommunityCardWrapper = styled.div`
  gap: 16px;
  display: flex;
  align-items: center;
  picture {
    flex-shrink: 0;
    overflow: hidden;
    border-radius: 50%;
  }
  .content {
    h4 {
      font-size: 16px;
      font-weight: 700;
      line-height: 24px;
      letter-spacing: 0.002em;
      color: ${(props) => props.theme.palette.text.primary};
    }
  }
  .btn {
    margin-top: 15px;
    &--follow {
      width: 102px;
      font-size: 14px;
      text-transform: capitalize;
    }
  }
`;
