import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Typography } from '@mui/material';
import { Box, Container } from '@mui/system';

import { HalfLeftArrow } from '~/icons';
import { LayoutArea } from '~/modules/_core/layout/LayoutArea';
import { useListBlogsCategoriesQuery } from '@newstart-online/sdk';
import { LearnResources } from '~/modules/_core/styles/LearnResources';
import { ButtonWithIcon } from '~/modules/_core/bits/buttons/IconButton';

const MoreRecommendations: NextPage = () => {
  const { data } = useListBlogsCategoriesQuery();

  const router = useRouter();

  const blogsByArticlesCategory = data?.data;

  return (
    <LearnResources>
      <LayoutArea>
        <Container sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 6.5 }}>
            <ButtonWithIcon
              icon={<HalfLeftArrow />}
              onClick={() => router.back()}
              sx={{ fontSize: '32px', fontWeight: 700 }}
            >
              More Recommendations
            </ButtonWithIcon>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', my: '24px', flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignitems: 'center' }}>
              {blogsByArticlesCategory &&
                blogsByArticlesCategory.map((item: any) => (
                  <div key={item.id} onClick={() => router.push(`/user/learn/resources/${item.blog.id}`)}>
                    <Box sx={{ mr: '12px', width: '280px' }}>
                      <div className="amplify-image-container">
                        {/* <AmplifyS3Image imgKey={item.blog.media[0]} alt={item.blog.title} /> */}
                      </div>
                      <Typography variant="subtitle1" sx={{ mt: '16px', color: '#000' }}>
                        {item.blog.title}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: '0.5', mt: '12px' }}>
                        {item.blog.author}
                      </Typography>
                    </Box>
                  </div>
                ))}
            </Box>
          </Box>
        </Container>
      </LayoutArea>
    </LearnResources>
  );
};

export default MoreRecommendations;
