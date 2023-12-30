import React from 'react';
import Link from 'next/link';

import { AppDownloadArea } from '../appDownload/AppDownloadArea';
import { Modal, useModal } from '~/modules/_core/bits/commonModal';
import { PolicyLinkWrapper } from '~/modules/_core/styles/PolicyLinkWrapper';

export const PolicyLinkArea = () => {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <PolicyLinkWrapper>
      <ul>
        <li>
          <Link href="/privacy-policy">
            <a className="link">Privacy policy</a>
          </Link>
        </li>
        <li>
          <Link href="/terms-and-conditions">
            <a className="link">Terms and conditions</a>
          </Link>
        </li>
        <li>
          <p className="link" onClick={openModal}>
            Get mobile app
          </p>
        </li>
        <li>
          <Link href="/about">
            <a className="link">About</a>
          </Link>
        </li>
      </ul>
      <Modal isOpen={isOpen} closeIcon={true} closeModal={closeModal} content={<AppDownloadArea />} />
    </PolicyLinkWrapper>
  );
};
