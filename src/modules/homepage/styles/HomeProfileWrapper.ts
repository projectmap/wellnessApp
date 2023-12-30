import styled from 'styled-components';

export const HomeProfileWrapper = styled.div`
  width: 300px;
  padding: 24px;
  border-radius: 12px;
  background-color: #fff;
  .profile {
    gap: 17px;
    display: flex;
    align-items: center;
    picture {
      display: block;
      overflow: hidden;
      flex-shrink: 0;
      border-radius: 50%;
    }
    &--view {
      font-size: 16px;
      margin-top: 13px;
      line-height: 24px;
      transition: all 0.3s ease-in;
      color: ${(props) => props.theme.palette.primary.main};
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .user--name {
    font-size: 20px;
    line-height: 26px;
    letter-spacing: -0.005em;
    text-transform: capitalize;
    color: ${(props) => props.theme.palette.text.primary};
  }
  .address {
    margin-top: 36px;
    &__item {
      gap: 12px;
      display: flex;
      align-items: center;
      &:not(:first-child) {
        margin-top: 15px;
      }
    }
  }
`;
