import { FC } from 'react';
import { createPortal } from 'react-dom';

import { IS_SERVER } from '~/utils/authStore';

const LoaderComponent: FC<{ isOverlay?: boolean }> = ({ isOverlay }) => {
  if (IS_SERVER) {
    return <></>;
  }

  return (
    <div className={isOverlay ? 'overlay-loader' : ''}>
      <div className="container relative mx-auto mt-5">
        <div className="loader inline-block">
          <span className="loader-highlight loader-spin-a"></span>
          <span className="loader-highlight loader-spin-b"></span>
          <span className="loader-highlight loader-spin-c"></span>
        </div>
        <div className="loader-overlay"></div>
      </div>
    </div>
  );
};

export const LoaderArea: FC<{ isOverlay?: boolean }> = ({ isOverlay }) => {
  const loaderRoot = !IS_SERVER && (document.getElementById('loader') as HTMLElement);

  if (isOverlay && loaderRoot) {
    return createPortal(<LoaderComponent isOverlay />, loaderRoot);
  }

  return <LoaderComponent />;
};
