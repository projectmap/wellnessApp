import styled from 'styled-components';

export const ProfileContactWrapper = styled.div`
  gap: 15px;
  padding: 24px;
  display: flex;
  align-items: end;
  border-radius: 12px;
  background-color: #fff;
  justify-content: space-between;
  .contact__list {
    li {
      gap: 10px;
      display: flex;
      align-items: center;
      &:not(:first-child) {
        margin-top: 20px;
      }
      svg {
        flex-shrink: 0;
      }
    }
  }
  .user__list {
    display: flex;
    align-items: center;
    ul {
      display: flex;
      li {
        width: 32px;
        height: 32px;
        flex-shrink: 0;
        margin-left: -10px;
        position: relative;
        transition: all 0.3s ease-in;
        &:hover {
          z-index: 2;
        }
        picture {
          display: block;
          border-radius: 50%;
        }
      }
    }
  }
`;
