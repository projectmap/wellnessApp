import styled from 'styled-components';

export const LearnResources = styled.div`
  .card-item {
    width: 44%;
  }
  .card-desc {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2;
  }
  .amplify-image-container {
    display: flex;
    justify-content: center;
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
  .articles-share-options {
    button,
    a {
      display: flex;
      align-items: center;
      width: 100%;
      cursor: pointer;
      margin-bottom: 12px;
      div {
        margin-right: 10px;
      }
    }
  }
`;
