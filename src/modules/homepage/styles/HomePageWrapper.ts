import styled from 'styled-components';

export const HomePageWrapper = styled.section`
  height: 100%;
  padding-top: 32px;
  padding-bottom: 32px;
  background-color: ${(props) => props.theme.palette.common.white};
  .home {
    &__wrapper {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }

    &__left,
    &__right {
    }
    &__left--sticky {
      position: sticky;
      margin-top: -70px;
      top: 80px;
    }
    &__container {
    }
    &__right {
      gap: 16px;
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      &--sticky {
        position: sticky;
        top: 80px;
      }
    }
  }
  .post__list {
    gap: 16px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
  }
`;
