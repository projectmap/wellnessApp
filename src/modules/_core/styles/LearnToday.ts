import styled from 'styled-components';

export const LearnToday = styled.div`
  margin-top: 48px;
  .amplify-image-container {
    overflow: hidden;
    amplify-s3-image {
      --height: 100%;
      --width: 100%;
      object-fit: contain;
    }
    img {
      height: 316px;
    }
  }

  .card-desc {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2;
  }
  .card-item {
    width: 44%;
  }
  .learn-today-page-filtered-buttons {
    border: 2px solid #ffffff;
    border-radius: 20px;
    padding: 6px 16px;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 150%;
    cursor: pointer;
  }

  .active {
    border: 2px solid #147ae9;
    border-radius: 20px;
    padding: 6px 16px;
  }
`;
