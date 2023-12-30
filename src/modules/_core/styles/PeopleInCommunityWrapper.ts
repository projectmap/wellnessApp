import styled from 'styled-components';

export const PeopleInCommunityWrapper = styled.div`
  padding: 24px 16px;
  border-radius: 12px;
  background-color: #fff;
  .title {
    font-size: 20px;
  }
  .community__list {
    margin-top: 30px;
    > div:not(:first-child) {
      margin-top: 26px;
    }
  }
  .view__wrap {
    margin-top: 50px;
    text-align: center;
  }
  .view--community {
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.005em;
    transition: all 0.3s ease-in;
    color: ${(props) => props.theme.palette.primary.main};
    &:hover {
      text-decoration: underline;
    }
  }
`;
