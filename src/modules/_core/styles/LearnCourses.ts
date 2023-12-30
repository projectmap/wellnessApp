import styled from 'styled-components';

export const LearnCourses = styled.div`
  margin-top: 24px;
  .amplify-image-container {
    width: 75px;
    height: 75px;
    border-radius: 50%;
    overflow: hidden;
    amplify-s3-image {
      --height: 100%;
      --width: 100%;
      object-fit: contain;
    }
  }
`;
