import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Box } from '@mui/system';

import { AppDownloadWrapper } from '~/modules/_core/styles/AppDownloadWrapper';

export const AppDownloadArea = () => {
  return (
    <AppDownloadWrapper>
      <Box className="download__header">
        <h3>
          Get our app and start your <br /> NEWSTART to better health today!.
        </h3>
      </Box>
      <Box className="download__wrapper">
        <Box className="download__store">
          {/* <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</p> */}
          <ul>
            <li>
              <Link href="#">
                <a href="">
                  <Image src="/assets/images/app-store.svg" width={149} height={49} alt="app-store" />
                </a>
              </Link>
            </li>
            <li>
              <Link href="#">
                <a href="">
                  <Image src="/assets/images/google-play.svg" width={149} height={49} alt="app-store" />
                </a>
              </Link>
            </li>
          </ul>
        </Box>
        <Box className="download__mobile">
          <picture>
            <Image src="/assets/images/mobile-device.png" width={186} height={382} alt="mobile app" />
          </picture>
        </Box>
      </Box>
    </AppDownloadWrapper>
  );
};
