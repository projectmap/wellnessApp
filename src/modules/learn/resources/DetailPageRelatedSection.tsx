import React from 'react';
import Image from 'next/image';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import { Typography } from '@mui/material';
import { IBlogsResponse } from '@newstart-online/sdk';

import { Play } from '~/icons';
import BlogCard from '../BlogCard';

interface IRelatedSection {
  id?: string;
  relatedBlog?: IBlogsResponse;
  isVideoPlayer?: boolean;
}

const RelatedSection = ({ relatedBlog, isVideoPlayer }: IRelatedSection) => {
  const router = useRouter();

  const goToDetailPage = (id?: string) => () => {
    id && router.push(`/user/learn/resources/detail/${id}`);
  };

  return (
    <Box key={relatedBlog?._id} onClick={goToDetailPage(relatedBlog?._id)} sx={{ cursor: 'pointer', width: '24%' }}>
      <Box>
        <BlogCard
          title={relatedBlog?.title}
          imgSrc={relatedBlog?.vimeoDetails?.thumbNailImage || relatedBlog?.featuredImage}
        />
        {isVideoPlayer && (
          <Box sx={{ position: 'relative' }}>
            <Play />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default RelatedSection;
