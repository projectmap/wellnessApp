import styled from 'styled-components';

export const PolicyLinkWrapper = styled.div`
  margin-top: 24px;
  ul {
    gap: 27px;
    display: flex;
    flex-wrap: wrap;
    li {
      .link {
        color: #000;
        opacity: 0.7;
        cursor: pointer;
        font-size: 14px;
        line-height: 21px;
        position: relative;
        letter-spacing: 0.004em;
        transition: all 0.3s ease-in;
        &:hover {
          opacity: 1;
          color: ${(props) => props.theme.palette.primary.main};
        }
      }
    }
  }
`;
