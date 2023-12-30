import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Box } from '@mui/system';
import { IconButton } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { MsgIcon, CallIcon, DoubleUsers } from '~/icons';
import { ProfileContactWrapper } from '../styles/ProfileContactWrapper';

export const ProfileContactArea = () => {
  return (
    <ProfileContactWrapper>
      <ul className="contact__list">
        <li>
          <CallIcon /> <span>+1 (123) 456–7890</span>
        </li>
        <li>
          <MsgIcon /> <span>Brooklyn Simmons@gmail.com</span>
        </li>
        <li>
          <DoubleUsers /> <span>Friends (100)</span>
        </li>
      </ul>
      <Box className="user__list">
        <ul>
          <li>
            <Link href="/user">
              <a href="" title="user-name">
                <picture>
                  <Image src="/assets/images/profile/user-1.png" width={32} height={32} alt="user-1" />
                </picture>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/user">
              <a href=" " title="user-name">
                <picture>
                  <Image src="/assets/images/profile/user-2.png" width={32} height={32} alt="user-2" />
                </picture>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/user">
              <a href="" title="user-name">
                <picture>
                  <Image src="/assets/images/profile/user-3.png" width={32} height={32} alt="user-3" />
                </picture>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/user">
              <a href="" title="user-name">
                <picture>
                  <Image src="/assets/images/profile/user-4.png" width={32} height={32} alt="user-4" />
                </picture>
              </a>
            </Link>
          </li>
        </ul>
        <IconButton>
          <ArrowForwardIosIcon color="primary" />
        </IconButton>
      </Box>
    </ProfileContactWrapper>
  );
};
