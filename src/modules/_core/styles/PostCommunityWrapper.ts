import styled from 'styled-components';

export const PostCommunityWrapper = styled.div`
  padding: 24px;
  border-radius: 12px;
  background-color: #ffff;
  .title {
    font-size: 24px;
    font-weight: 700;
    text-align: center;
    line-height: 31.2px;
    letter-spacing: -0.005em;
    text-transform: capitalize;
    span {
      color: ${(props) => props.theme.palette.primary.main};
    }
  }
  .post__form {
    width: 428px;
    margin: auto;
    margin-top: 24px;
  }
  .post__bottom {
    gap: 42px;
    display: flex;
    flex-wrap: wrap;
    margin-top: 15px;
    align-items: center;
    justify-content: center;
    .slash {
      width: 21px;
      height: 0px;
      border: 1px solid #d0d0d7;
      transform: rotate(90deg);
    }
  }
`;
