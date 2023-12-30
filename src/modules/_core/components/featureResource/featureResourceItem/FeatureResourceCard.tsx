import React from 'react';
import Image from 'next/image';
import { Box } from '@mui/material';
import { Typography } from '@mui/material';

import Link from 'next/link';
import tempImage from '/public/assets/images/resource.png';
import { FeatureResourceCardWrapper } from '~/modules/_core/styles/FeatureResourceCardWrapper';

interface IFeatureResourceCard {
  author: string;
  imageSrc: string;
  title: string;
  id: string;
}
export const FeatureResourceCard = ({ author, title, imageSrc, id }: IFeatureResourceCard) => {
  return (
    <FeatureResourceCardWrapper>
      <Box sx={{ position: 'relative', cursor: 'pointer' }}>
        <Link href={`user/learn/resources/detail/${id}`}>
          <Image
            src={imageSrc ? imageSrc : tempImage}
            width="280px"
            height="212px"
            alt="resource image"
            layout="responsive"
            objectFit="cover"
          />
        </Link>
      </Box>

      <Link href={`user/learn/resources/detail/${id}`}>
        <Box className="content">
          <h4 className="line-clamp-2">{title}</h4>
          <Typography sx={{ mt: '8px' }}>{author}</Typography>
        </Box>
      </Link>
    </FeatureResourceCardWrapper>
  );
};
