import Image from 'next/image';
import Slider from 'react-slick';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Container, Box } from '@mui/system';
import { Typography, Stack } from '@mui/material';
import { NextPage, GetServerSideProps } from 'next';
import {
  ENUM_ROLE_ACCESS_FOR,
  useGetProfileQuery,
  useGetRecipeQuery,
  useGetRelatedRecipeByIdQuery,
} from '@newstart-online/sdk';

import { HalfLeftArrow } from '~/icons';
import { ShareBox } from '~/modules/learn/recipe';
import VideoPlayer from '~/modules/learn/recipe/VideoPlayer';
import { Directions } from '~/modules/learn/recipe/Directions';
import { LayoutArea } from '~/modules/_core/layout/LayoutArea';
import { COMMUNITY_SHARE_MODAL_TYPE, RESOURCES_LOADING_THUMBNAIL } from '~/state/constants';
import { Ingredients } from '~/modules/learn/recipe/Ingredients';
import { RecipesDetails } from '~/modules/_core/styles/RecipesDetails';
import { ButtonWithIcon } from '~/modules/_core/bits/buttons/IconButton';
import { LoaderArea } from '~/modules/_core/components/loaderPage/LoaderArea';
import GenericUpgradeModal from '~/modules/_core/bits/modals/GenericUpgradeModal';
import BlogCard from '~/modules/learn/BlogCard';
import GoogleAnalytics from '~/common-ui/GoogleAnalytics/GoogleAnalytics';
import { FIREBASE_EVENTS_ENUM } from '~/config/firebase.config';

const Recipe: NextPage<{ id: string }> = ({ id }) => {
  const { data: recipeDetails, isLoading } = useGetRecipeQuery(id, { skip: !id });

  const { data: relatedRecipeList, isLoading: isRelatedRecipeLoading } = useGetRelatedRecipeByIdQuery(id);

  const router = useRouter();

  const goToDetailPage = (id?: string) => () => {
    id && router.push(`/user/learn/recipe/${id}`);
  };

  const { data: userAccessStatus } = useGetProfileQuery();
  const [updatePlanModal, setUpdatePlanModal] = React.useState(
    userAccessStatus?.data?.role?.accessFor === ENUM_ROLE_ACCESS_FOR.FREE_USER,
  );

  useEffect(() => {
    setUpdatePlanModal(userAccessStatus?.data?.role?.accessFor === ENUM_ROLE_ACCESS_FOR.FREE_USER);
  }, [userAccessStatus?.data?.role?.accessFor]);
  const settings = {
    nav: true,
    dots: true,
    infinite: true,
    speed: 500,
    centerPadding: '10px',
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
  };

  if (isLoading || isRelatedRecipeLoading) {
    return <LoaderArea />;
  }

  return (
    <GoogleAnalytics firebaseEvent={FIREBASE_EVENTS_ENUM.RECIPE_DETAIL}>
      <RecipesDetails>
        <LayoutArea>
          <GenericUpgradeModal setModalStatus={setUpdatePlanModal} modalStatus={updatePlanModal} />
          <Container maxWidth="lg" sx={{ borderRadius: '16px', mt: '16px', py: '32px', px: '48', mb: '32px' }}>
            <Box sx={{ mb: 6 }}>
              <ButtonWithIcon icon={<HalfLeftArrow />} onClick={() => router.back()}>
                Go back
              </ButtonWithIcon>
            </Box>

            <Box sx={{ width: '100%', mb: '32px' }}>
              {recipeDetails?.videoUrl ? (
                <VideoPlayer url={recipeDetails?.videoUrl} />
              ) : (
                <Slider {...settings}>
                  {recipeDetails?.featuredImage?.map((item, index: number) => (
                    <Box sx={{ position: 'relative', height: '546px' }} key={item?.id}>
                      <Image
                        className="slider-image"
                        key={index}
                        src={item.completedUrl}
                        objectFit="contain"
                        layout="fill"
                        alt={item.originalName}
                      />
                    </Box>
                  ))}
                </Slider>
              )}
            </Box>
            <Box sx={{ width: '80%', marginTop: '24px' }}>
              <Typography sx={{ fontSize: '32px', color: '#131336', fontWeight: 700 }}>
                {recipeDetails?.title}
              </Typography>
              <Typography sx={{ fontSize: '16px', color: '#131336', opacity: '0.8', marginTop: '16px' }}>
                {recipeDetails?.author}
              </Typography>
            </Box>
            <Box sx={{ width: '100%', marginTop: '48px' }}>
              <Stack direction="row" justifyContent="space-between">
                <Box sx={{ width: '40%' }}>
                  {recipeDetails && <Ingredients ingredients={recipeDetails?.ingredients} />}
                </Box>

                <Box sx={{ width: '50%' }}>
                  {recipeDetails && <Directions directions={recipeDetails?.instructions} />}
                </Box>

                <ShareBox
                  articleContent=""
                  contentId={id}
                  title={recipeDetails?.title || ''}
                  imageUrl={
                    recipeDetails?.vimeoDetails?.thumbNailImage || recipeDetails?.featuredImage?.[0]?.completedUrl
                  }
                  shareModalType={COMMUNITY_SHARE_MODAL_TYPE.sharedRecipe}
                />
              </Stack>
            </Box>
          </Container>
          <Box sx={{ background: '#F0F0F0', py: 4, mt: 8 }}>
            <Container>
              <Typography variant="h5" sx={{ mb: 3 }}>
                Related Recipes
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'top', gap: '16px' }}>
                {relatedRecipeList &&
                  relatedRecipeList?.data?.map((relatedRecipe: any) => (
                    <Box key={relatedRecipe._id} sx={{ cursor: 'pointer', width: '24%' }}>
                      <BlogCard
                        title={relatedRecipe?.title}
                        imgSrc={
                          relatedRecipe?.vimeoDetails?.thumbNailImage ||
                          relatedRecipe?.featuredImage ||
                          RESOURCES_LOADING_THUMBNAIL
                        }
                        id={relatedRecipe?._id}
                        onClick={goToDetailPage(relatedRecipe?._id)}
                      />
                    </Box>
                  ))}
              </Box>
            </Container>
          </Box>
        </LayoutArea>
      </RecipesDetails>
    </GoogleAnalytics>
  );
};

export default Recipe;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = ctx.query.id as string;

  return {
    props: {
      id,
    },
  };
};
