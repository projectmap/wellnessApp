import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Typography } from '@mui/material';
import { Box, Container } from '@mui/system';

import { HalfLeftArrow } from '~/icons';
import BlogCard from '~/modules/learn/BlogCard';
import { LayoutArea } from '~/modules/_core/layout/LayoutArea';
import { LearnToday } from '~/modules/_core/styles/LearnToday';
import { RESOURCES_LOADING_THUMBNAIL } from '~/state/constants';
import { LearnResources } from '~/modules/_core/styles/LearnResources';
import { ButtonWithIcon } from '~/modules/_core/bits/buttons/IconButton';
import { LearnTodayStyles } from '~/modules/learn/styles/LearnTodayStyles';
import { useGetCurrentUserFavouriteRecipeQuery } from '@newstart-online/sdk';

const LatestArticles: NextPage = () => {
  const { data: getCurrentUserFavRecipe } = useGetCurrentUserFavouriteRecipeQuery();

  const router = useRouter();

  return (
    <LearnToday>
      <LayoutArea>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'center', my: 4 }}>
            <ButtonWithIcon
              icon={<HalfLeftArrow />}
              onClick={() => router.back()}
              sx={{ fontSize: '32px', fontWeight: 700 }}
            >
              Favorite Recipes
            </ButtonWithIcon>
          </Box>
          <Box>
            <Box sx={{ display: 'flex', alignitems: 'center', gap: '12px', cursor: 'pointer', flexWrap: 'wrap' }}>
              {getCurrentUserFavRecipe?.data?.favouriteRecipe &&
                getCurrentUserFavRecipe?.data?.favouriteRecipe.map((item: any) => (
                  <div key={item?._id} style={{ width: '24%' }}>
                    <BlogCard
                      isRecipe={true}
                      title={item?.title}
                      author={item?.author}
                      imgSrc={item?.featuredImage?.[0]?.completedUrl || RESOURCES_LOADING_THUMBNAIL}
                      id={item?._id}
                      onClick={() => router.push(`/user/learn/resources/${item._id}`)}
                    />
                  </div>
                ))}
            </Box>
          </Box>
        </Container>
      </LayoutArea>
    </LearnToday>
  );
};

export default LatestArticles;
