import styled from 'styled-components';

export const ProfilePageWrapper = styled.section`
  height: 100%;
  padding-top: 16px;
  padding-bottom: 32px;
  background-color: ${(props) => props.theme.palette.primary.light};
  .home {
    &__wrapper {
      gap: 37px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }

    &__left,
    &__right {
      width: 300px;
    }
    &__left--sticky {
      position: sticky;
      top: 80px;
    }
    &__container {
      width: 600px;
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
