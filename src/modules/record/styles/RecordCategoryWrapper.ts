import styled from 'styled-components';

export const RecordCategoryWrapper = styled.section`
  padding-top: 24px;
  .record {
    &__category {
      margin: auto;
    }
    &--title {
      font-size: 20px;
      line-height: 26px;
      color: ${(props) => props.theme.palette.text.primary};
    }
  }
  .category__list {
    gap: 16px;
    display: flex;
    flex-wrap: wrap;
  }
`;
