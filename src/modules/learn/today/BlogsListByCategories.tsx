import React from 'react';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import { Button, Typography, useMediaQuery } from '@mui/material';
import { useListPaginatedBlogsQuery, IBlogsResponse, BLOGS_STATUS } from '@newstart-online/sdk';

import { ChevronBlueRight } from '~/icons';
import BlogCard from '~/modules/learn/BlogCard';

interface IBlogsListByCategories {
  category: string;
}
const BlogsListByCategories = (props: IBlogsListByCategories) => {
  const matchesSmallScreen = useMediaQuery('(max-width:1024px)');

  const { category } = props;

  const { data: blogsLists } = useListPaginatedBlogsQuery({
    page: 1,
    perPage: matchesSmallScreen ? 3 : 4,
    category,
    status: BLOGS_STATUS.PUBLISHED,
  });
  const router = useRouter();

  if (blogsLists?.data?.length) {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', my: '24px' }}>
          <Typography variant="h5">{category?.replaceAll('-', ' ')}</Typography>

          <Button
            endIcon={<ChevronBlueRight />}
            sx={{
              textTransform: 'none',
              fontSize: '16px',
              padding: '0',
              fontWeight: 'bold',
              '&.MuiButtonBase-root:hover': {
                bgcolor: 'transparent',
              },
            }}
            onClick={() => router.push(`/user/learn/resources/all/?category=${category}`)}
          >
            See all
          </Button>
        </Box>
        <Box sx={{ display: 'flex', alignitems: 'center', gap: '12px' }}>
          {blogsLists?.data?.map((blog: IBlogsResponse) => (
            <div
              key={blog._id}
              onClick={() => router.push(`/user/learn/resources/detail/${blog._id}`)}
              className="card-item"
              style={{ width: '24%' }}
            >
              <BlogCard
                title={blog.title}
                imgSrc={blog?.vimeoDetails?.thumbNailImage || blog?.featuredImage}
                author={blog.author}
              />
            </div>
          ))}
        </Box>
      </Box>
    );
  }

  return null;
};

export default BlogsListByCategories;
