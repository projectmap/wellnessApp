import Image from 'next/image';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useListPaginatedRecipeQuery } from '@newstart-online/sdk';

import { HalfLeftArrow } from '~/icons';
import { LayoutArea } from '~/modules/_core/layout/LayoutArea';
import { LearnResources } from '~/modules/_core/styles/LearnResources';
import { ButtonWithIcon } from '~/modules/_core/bits/buttons/IconButton';
import { PrimaryButton } from '~/modules/_core/bits/buttons/PrimaryButton';
import { PolicyLinkArea } from '~/modules/_core/components/policyLink/PolicyLinkArea';
import BlogCard from '~/modules/learn/BlogCard';

const Recipes: NextPage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data: paginatedRecipeLists } = useListPaginatedRecipeQuery({ page: page, perPage: 8 });

  const [recipesLists, setRecipesLists] = useState<any>([]);

  const handleLoadMore = () => {
    setPage((prevState) => prevState + 1);
  };

  useEffect(() => {
    paginatedRecipeLists?.data?.length &&
      setRecipesLists((prevState: any) => [...prevState, ...(paginatedRecipeLists?.data || [])]);
  }, [paginatedRecipeLists?.data]);

  return (
    <LearnResources>
      <LayoutArea>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'center', my: 4 }}>
            <ButtonWithIcon
              icon={<HalfLeftArrow />}
              onClick={() => router.back()}
              sx={{ fontSize: '32px', fontWeight: 700, display: 'flex', alignItems: 'center' }}
            >
              All Recipes
            </ButtonWithIcon>
          </Box>
          <Box sx={{ display: 'flex', alignitems: 'center', gap: '12px', cursor: 'pointer', flexWrap: 'wrap' }}>
            {recipesLists?.map((recipe: any) => (
              <Box sx={{ width: '24%' }} key={recipe._id}>
                <BlogCard
                  title={recipe.title}
                  imgSrc={recipe?.vimeoDetails?.thumbNailImage || recipe?.featuredImage}
                  author={recipe.author}
                  id={recipe?._id}
                  onClick={() => router.push(`/user/learn/recipe/${recipe._id}`)}
                />
              </Box>
            ))}
          </Box>

          {paginatedRecipeLists?.totalData > recipesLists?.length && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: '48px' }}>
              <PrimaryButton onClick={handleLoadMore} sx={{ borderRadius: '32px' }}>
                Load More
              </PrimaryButton>
            </Box>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'center', pb: '12px', mt: '24px' }}>
            <PolicyLinkArea />
          </Box>
        </Container>
      </LayoutArea>
    </LearnResources>
  );
};

export default Recipes;
