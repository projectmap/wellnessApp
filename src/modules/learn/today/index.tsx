import React from 'react';
import Image from 'next/image';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import { ChevronBlueRight } from '~/icons';
import { Button, Container, Typography, useMediaQuery } from '@mui/material';
import {
  useListBlogsCategoriesQuery,
  useListPaginatedRecipeQuery,
  IRecipeResponse,
  useGetCurrentUserFavouriteRecipeQuery,
  IBlogsCategoriesResponse,
} from '@newstart-online/sdk';

import BlogCard from '~/modules/learn/BlogCard';
import { LearnToday } from '~/modules/_core/styles/LearnToday';
import LearnTodaySkeleton from '../skeletons/LearnTodaySkeleton';
import { LearnTodayStyles } from '~/modules/learn/styles/LearnTodayStyles';
import BlogsListByCategories from '~/modules/learn/today/BlogsListByCategories';
import { CommunityFooterLinks } from '~/modules/community/CommunityFooterLinks';
import {
  LEARN_PAGE_BLOGS_CATEGORIES_FILTER_LIST,
  LEARN_PAGE_BLOGS_ROUTING,
  RESOURCES_LOADING_THUMBNAIL,
} from '~/state/constants';

const Today = () => {
  const matchesSmallScreen = useMediaQuery('(max-width:1024px)');

  const {
    data: paginatedRecipeLists,
    isLoading: loading,
    isError: error,
    isFetching: isRecipeFetching,
  } = useListPaginatedRecipeQuery({ page: 1, perPage: matchesSmallScreen ? 3 : 4 });
  const { data: blogsCategories } = useListBlogsCategoriesQuery();
  const [selectedCategory, setSelectedCategory] = React.useState(LEARN_PAGE_BLOGS_CATEGORIES_FILTER_LIST.ALL);

  const { data: getCurrentUserFavRecipe } = useGetCurrentUserFavouriteRecipeQuery();

  const router = useRouter();

  const handleTopics = (categoryType: string) => (event: any) => {
    setSelectedCategory(categoryType);
  };

  if (error) return <div>Error...</div>;
  const buttons = [
    {
      name: 'All',
      value: LEARN_PAGE_BLOGS_CATEGORIES_FILTER_LIST.ALL,
    },
    {
      name: 'Recipes',
      value: LEARN_PAGE_BLOGS_CATEGORIES_FILTER_LIST.RECIPES,
    },
  ];

  if (isRecipeFetching) {
    return <LearnTodaySkeleton />;
  }

  return (
    <div>
      <LearnToday>
        <div style={{ minHeight: '100vh' }}>
          <Container maxWidth="xl" sx={LearnTodayStyles?.topicsContainer}>
            {getCurrentUserFavRecipe?.data?.favouriteRecipe?.length !== 0 && (
              <>
                <Box sx={LearnTodayStyles?.recipesContainer}>
                  <Typography variant="h5">Favorite Recipe</Typography>
                  <Button
                    endIcon={<ChevronBlueRight />}
                    sx={LearnTodayStyles?.seeAllButton}
                    onClick={() => router.push(LEARN_PAGE_BLOGS_ROUTING.FAVORITE_RECIPES)}
                  >
                    See all
                  </Button>
                </Box>
                <Box sx={LearnTodayStyles?.recipesCardContainer}>
                  {getCurrentUserFavRecipe?.data?.favouriteRecipe?.length !== 0 &&
                    getCurrentUserFavRecipe?.data?.favouriteRecipe?.slice(0, 4)?.map((favRecipe: any) => {
                      return (
                        <div
                          key={favRecipe?.id}
                          className="card-item"
                          style={{ marginBottom: '48px', maxWidth: '375px' }}
                        >
                          <BlogCard
                            imgSrc={favRecipe?.featuredImage?.[0]?.completedUrl || RESOURCES_LOADING_THUMBNAIL}
                            title={favRecipe?.title}
                            author={favRecipe?.author}
                            id={favRecipe?._id}
                            onClick={() => router?.push(`/user/learn/recipe/${favRecipe?._id}`)}
                          />
                        </div>
                      );
                    })}
                </Box>
              </>
            )}
            <Typography variant="h6" sx={LearnTodayStyles?.topicsTitle}>
              Topics
            </Typography>
            <Box sx={LearnTodayStyles?.topicsButtonContainer}>
              {buttons &&
                buttons.map((type, index) => (
                  <button
                    key={index}
                    value={type.value}
                    onClick={handleTopics(type.value)}
                    className={`learn-today-page-filtered-buttons ${selectedCategory === type.value ? 'active' : ''}`}
                  >
                    {type.name}
                  </button>
                ))}

              {blogsCategories?.data?.map((item: IBlogsCategoriesResponse, index: number) => {
                return (
                  <button
                    key={index}
                    value={item.title}
                    onClick={handleTopics(item._id || '')}
                    className={`learn-today-page-filtered-buttons ${selectedCategory === item._id ? 'active' : ''}`}
                  >
                    {item?.title?.replaceAll('-', ' ')}
                  </button>
                );
              })}
            </Box>
            {(selectedCategory === LEARN_PAGE_BLOGS_CATEGORIES_FILTER_LIST.ALL ||
              selectedCategory === LEARN_PAGE_BLOGS_CATEGORIES_FILTER_LIST.RECIPES) && (
              <Box>
                <Box sx={LearnTodayStyles?.recipesContainer}>
                  <Typography variant="h5">Recipes</Typography>
                  <Button
                    endIcon={<ChevronBlueRight />}
                    sx={LearnTodayStyles?.seeAllButton}
                    onClick={() => router.push(LEARN_PAGE_BLOGS_ROUTING.RECIPES)}
                  >
                    See all
                  </Button>
                </Box>

                <Box sx={LearnTodayStyles?.recipesCardContainer}>
                  {paginatedRecipeLists?.data?.map((recipe: IRecipeResponse) => (
                    <div key={recipe._id} className="card-item">
                      <BlogCard
                        isRecipe={true}
                        title={recipe.title}
                        imgSrc={recipe?.vimeoDetails?.thumbNailImage || recipe.featuredImage}
                        author={recipe.author}
                        id={recipe?._id}
                        onClick={() => router.push(`/user/learn/recipe/${recipe._id}`)}
                      />
                    </div>
                  ))}
                </Box>
              </Box>
            )}

            {blogsCategories?.data?.map((blogCategory: IBlogsCategoriesResponse) => {
              return blogCategory._id === selectedCategory ||
                selectedCategory === LEARN_PAGE_BLOGS_CATEGORIES_FILTER_LIST.ALL ? (
                <BlogsListByCategories category={blogCategory.title} />
              ) : null;
            })}
          </Container>
        </div>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '52px',
            backgroundColor: '#FFFF',
          }}
        >
          <CommunityFooterLinks />
        </Box>
      </LearnToday>
    </div>
  );
};

export default Today;
