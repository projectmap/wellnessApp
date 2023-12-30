import styled from 'styled-components';

export const FeaturedResourceWrapper = styled.div`
  width: 100%;
  border-radius: 12px;
  background-color: #fff;
  border: 1px solid #e7e7eb;
  .header__title {
    display: flex;
    flex-wrap: wrap;
    padding-top: 24px;
    padding-left: 20px;
    align-items: center;
    padding-right: 20px;
    padding-bottom: 16px;
    justify-content: space-between;
    h3 {
      font-size: 20px;
      line-height: 26px;
      color: ${(props) => props.theme.palette.text.primary};
    }
    p {
      gap: 10px;
      display: flex;
      flex-wrap: wrap;
      cursor: pointer;
      font-size: 14px;
      cursor: pointer;
      align-items: center;
      color: ${(props) => props.theme.palette.primary.main};
    }
  }
  .resource__list {
    overflow: hidden;
    padding-bottom: 24px;
  }
  .resource__items {
    width: 100%;
    transform: translate(20px, 0);
    .slick-arrow {
      z-index: 2;
      opacity: 1;
      top: 40%;
      &::before {
        font-size: 0;
        display: none;
      }
    }
    .slick-next {
      right: 80px;
    }
    .slick-prev {
      left: 60px;
      transform: translateX(0) rotateY(-180deg);
    }
    .slick-disabled {
      display: none !important;
    }
  }
`;
