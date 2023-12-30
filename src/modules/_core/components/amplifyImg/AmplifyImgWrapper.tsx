import React from 'react';

interface AmplifyImgWrapperProps {
  imgKey: string;
  alt: string;
}

export const AmplifyImgWrapper = ({ imgKey, alt }: AmplifyImgWrapperProps) => {
  return (
    <div className="amplify-image-container">
      <img src={imgKey} alt={alt} />
    </div>
  );
};
