import styled from 'styled-components';

export const HeaderWrapper = styled.header`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  width: 100%;
  z-index: 10;
  .header {
    &__wrap {
      display: flex;
      background-color: #131336;
    }
    &__nav {
      margin-left: auto;
      .nav--link {
        &:not(:first-child) {
          margin-left: 41px;
        }
        a {
          font-size: 12px;
          font-weight: 500;
          line-height: 13px;
          transition: all 0.3s ease-in;
        }
        &:hover {
          a {
            color: ${(props) => props.theme.palette.primary.main};
          }
        }
      }
    }
  }
`;
