import Image from 'next/image';
import { Box, Typography } from '@mui/material';
import React, { FC, MouseEventHandler, useState } from 'react';

import { FavRecipeIcon, FavoritedRecipeIcon } from '~/icons';
import { RESOURCES_LOADING_THUMBNAIL } from '~/state/constants';
import {
  IUserFavouriteRecipe,
  useGetCurrentUserFavouriteRecipeQuery,
  useRemoveFavouriteRecipeMutation,
  useSaveFavrouiteRecipeMutation,
} from '@newstart-online/sdk';
import { toast } from 'react-toastify';
import { useAppDispatch } from '~/state/app/hooks';
import { storeUsersFavoriteRecipe } from '~/state/services/resources/resourcesSectionSlice';
interface IBlogCard {
  imgSrc: any;
  title: string | undefined;
  author?: string | undefined;
  isFeatured?: boolean | undefined;
  catTitle?: any;
  favoriteRecipe?: boolean;
  onClick?: MouseEventHandler;
  id?: string;
  isRecipe?: boolean;
}

const BlogCard: FC<IBlogCard> = ({ isRecipe, imgSrc, title, author, isFeatured = true, catTitle, onClick, id }) => {
  const [addedAsFavRecipe, setAddedAsFavRecipe] = useState<boolean>(false);
  const [showMakeFavIcon, setShowMakeFavIcon] = useState<boolean>(false);
  const [myFavouriteRecipes, setMyFavouriteRecipes] = useState([]);
  const [addRecipeToUsersFavoriteRecipeList] = useSaveFavrouiteRecipeMutation();
  const [removeRecipeFromUsersFavoriteRecipeList] = useRemoveFavouriteRecipeMutation();
  const dispatch = useAppDispatch();

  const { data: getCurrentUserFavRecipe } = useGetCurrentUserFavouriteRecipeQuery();
  const userFavoritedRecipesFromDB = getCurrentUserFavRecipe?.data?.favoriteRecipe as IUserFavouriteRecipe[];

  const handleAddRecipeToUsersFavoriteRecipeList = () => {
    addRecipeToUsersFavoriteRecipeList({ recipeId: id as string })
      .unwrap()
      .then((data) => {
        toast.success(data?.message);
        setAddedAsFavRecipe(true);
        dispatch(storeUsersFavoriteRecipe([{ ...getCurrentUserFavRecipe?.data?.favoriteRecipe }]));
      })
      .catch((data) => data?.error?.message);
  };

  const handleRemoveRecipeFromUsersFavoriteRecipeList = () => {
    removeRecipeFromUsersFavoriteRecipeList({ recipeId: id as string })
      .unwrap()
      .then((data) => {
        toast.success(data?.message);
        setAddedAsFavRecipe(false);
        dispatch(storeUsersFavoriteRecipe([...userFavoritedRecipesFromDB]));
      })
      .catch((data) => data?.error?.message);
  };

  React.useEffect(() => {
    if (getCurrentUserFavRecipe?.data?.favouriteRecipe) {
      getCurrentUserFavRecipe?.data?.favouriteRecipe?.map((item: any) => {
        if (item?._id === id) {
          setAddedAsFavRecipe(true);
        }
      });
      setMyFavouriteRecipes(getCurrentUserFavRecipe?.data?.favouriteRecipe);
    }
  }, [getCurrentUserFavRecipe?.data?.favouriteRecipe, id]);

  return (
    <Box
      onMouseEnter={() => {
        setShowMakeFavIcon(true);
      }}
      onMouseLeave={() => {
        setShowMakeFavIcon(false);
      }}
      sx={{ position: 'relative' }}
    >
      <Box sx={{ cursor: 'pointer' }} onClick={onClick}>
        <Image
          width="375px"
          height="212px"
          layout="responsive"
          objectFit="cover"
          src={
            typeof imgSrc === 'string' ? imgSrc : imgSrc?.length ? imgSrc[0].completedUrl : RESOURCES_LOADING_THUMBNAIL
          }
          alt="title"
        />
        {isFeatured && catTitle?.title && (
          <Box
            sx={{
              backgroundColor: '#FFFFFF',
              opacity: 0.8,
              borderRadius: 4,
              position: 'absolute',
              top: '16px',
              left: '12px',
              px: '10px',
              py: '6px',
            }}
          >
            <Typography sx={{ fontSize: '14px' }}>{catTitle?.title?.replaceAll('-', ' ')}</Typography>
          </Box>
        )}
        <Typography className="card-desc" variant="subtitle1" sx={{ height: '53px', mt: '16px', width: '90%' }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ opacity: '0.5', mt: '12px' }}>
          {author}
        </Typography>
      </Box>

      <Box
        sx={{
          opacity: 0.8,
          borderRadius: 4,
          position: 'absolute',
          top: '16px',
          right: '12px',
        }}
      >
        {isRecipe && !myFavouriteRecipes?.find((item: any) => item?._id === id) && showMakeFavIcon && (
          <FavRecipeIcon onClick={handleAddRecipeToUsersFavoriteRecipeList} style={{ zIndex: 10, cursor: 'pointer' }} />
        )}
        {addedAsFavRecipe && myFavouriteRecipes?.find((item: any) => item?._id === id) ? (
          <FavoritedRecipeIcon
            onClick={handleRemoveRecipeFromUsersFavoriteRecipeList}
            style={{ zIndex: 10, cursor: 'pointer' }}
          />
        ) : null}
      </Box>
    </Box>
  );
};

export default BlogCard;
