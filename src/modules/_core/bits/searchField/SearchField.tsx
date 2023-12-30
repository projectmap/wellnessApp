import React from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { ClickAwayListener, SxProps } from '@mui/material';
import { Box, Theme } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, Paper, TextField, Typography } from '@mui/material';

import { ROUTE } from '~/config/routes';
import { useRouter } from 'next/router';
import { useGetUser } from '~/utils/useGetUser';
import { DefaultUserPhoto } from '~/modules/community/components/Chat/DefaultUserPhoto';
import { IBlogsResponse, IRecipeResponse, IUser, useLazyGetCommonSearchDataQuery } from '@newstart-online/sdk';
import { LEARN_PAGE_BLOGS_ROUTING, RESOURCES_LOADING_THUMBNAIL, RESOURCE_SHARE_ROUTING } from '~/state/constants';

interface ISearchField {
  sx?: SxProps<Theme> | undefined;
  searchText: string | undefined;
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void;
  open?: boolean;
  searchMessage?: string;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
  onClose?: () => void;
  setOpen?: (status: boolean) => void;
  setSearchMessage?: (status: string) => void;
}

// Change background color after integraing theme
const SearchFieldWrapper = styled.form`
  display: flex;
  align-items: center;
  width: 418px;
  height: 40px;

  border-radius: 4px;
  .search--field {
    border-radius: 4px;
    background-color: #f0f0f0;
    input {
      font-size: 14px;
    }
    fieldset {
      border: none;
    }
  }
`;

const SearchPopover = ({ open, sx, searchText }: ISearchField) => {
  const [commonSearch, { data: allSearchData }] = useLazyGetCommonSearchDataQuery();
  const user = useGetUser();
  const router = useRouter();
  const userSearchData = allSearchData?.data?.user;
  const blogSearchData = allSearchData?.data?.blog;
  const recipeSearchData = allSearchData?.data?.recipe;

  // this will check the data object which has users, recipe and blogs array that they are empty or not
  const isAllSearchDataEmpty =
    allSearchData?.data && Object?.values(allSearchData?.data)?.every((arr: any) => arr.length === 0);

  const id = open ? 'search-popover' : undefined;

  const redirectToProfilePage = (userId: string) => {
    const profileLink = userId === user?._id ? ROUTE.ME : ROUTE.PROFILE + userId;

    router.push(profileLink);
  };

  // lazy calling search functionality
  React.useEffect(() => {
    if (searchText !== undefined) {
      commonSearch(searchText as string);
    }
  }, [commonSearch, searchText]);

  return (
    <>
      {open && (
        <Paper
          sx={{
            p: 3.5,
            mt: 2,
            width: '100%',
            border: '1px solid #F3F3F5',
            background: '#FFFFFF',
            borderRadius: '8px',
            zIndex: 10,
            position: 'absolute',
            left: '10%',
            top: '90%',

            ...sx,
          }}
          className="hide-scrollbar"
          elevation={0}
          id={id}
        >
          {userSearchData &&
            userSearchData?.length !== 0 &&
            userSearchData.map((item: IUser) => {
              return (
                <Box
                  sx={{ display: 'flex', alignItems: 'center', mb: 2, cursor: 'pointer' }}
                  key={item?._id}
                  onClick={() => item._id && redirectToProfilePage(item._id)}
                >
                  {item?.photo?.completedUrl ? (
                    <Box sx={{ position: 'relative', height: '48px', width: '48px' }}>
                      <Image
                        src={item?.photo?.completedUrl}
                        alt={item?.name}
                        width="100%"
                        height="100%"
                        objectFit="cover"
                        style={{ borderRadius: '50%' }}
                      />
                    </Box>
                  ) : (
                    <DefaultUserPhoto
                      userName={item?.name}
                      sx={{ width: '48px', height: '48px', backgroundColor: `${item?.color}`, fontNewSize: '24px' }}
                    />
                  )}
                  <Box sx={{ pl: '16px' }}>
                    <Typography sx={{ textTransform: 'capitalize', fontSize: '14px' }}>{item?.name}</Typography>
                  </Box>
                </Box>
              );
            })}
          {blogSearchData &&
            blogSearchData?.length !== 0 &&
            blogSearchData.map((item: IBlogsResponse) => {
              return (
                <Box
                  sx={{ display: 'flex', alignItems: 'center', mb: 2, cursor: 'pointer' }}
                  key={item?._id}
                  onClick={() => router.push(`${LEARN_PAGE_BLOGS_ROUTING.DETAILS}/${item?._id}`)}
                >
                  <Box sx={{ position: 'relative', height: '48px', width: '48px' }}>
                    <Image
                      src={
                        item?.vimeoDetails?.thumbNailImage ||
                        item?.featuredImage?.[0]?.completedUrl ||
                        RESOURCES_LOADING_THUMBNAIL
                      }
                      alt={item?.title}
                      width="100%"
                      height="100%"
                      objectFit="cover"
                      style={{ borderRadius: '50%' }}
                    />
                  </Box>

                  <Box sx={{ pl: '16px' }}>
                    <Typography
                      sx={{ textTransform: 'capitalize', fontSize: '14px', width: '200px' }}
                      className="line-clamp-2"
                    >
                      {item?.title}
                    </Typography>
                    <Typography sx={{ textTransform: 'capitalize', fontSize: '14px', color: '#5A5A72' }}>
                      Article
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          {recipeSearchData &&
            recipeSearchData?.length !== 0 &&
            recipeSearchData.map((item: IRecipeResponse) => {
              return (
                <Box
                  sx={{ display: 'flex', alignItems: 'center', mb: 2, cursor: 'pointer' }}
                  key={item?._id}
                  onClick={() => router.push(`${RESOURCE_SHARE_ROUTING.RECIPE}/${item?._id}`)}
                >
                  <Box sx={{ position: 'relative', height: '48px', width: '48px' }}>
                    <Image
                      src={
                        item?.vimeoDetails?.thumbNailImage ||
                        item?.featuredImage?.[0]?.completedUrl ||
                        RESOURCES_LOADING_THUMBNAIL
                      }
                      alt={item?.title}
                      width="100%"
                      height="100%"
                      objectFit="cover"
                      style={{ borderRadius: '50%' }}
                    />
                  </Box>

                  <Box sx={{ pl: '16px' }}>
                    <Typography sx={{ textTransform: 'capitalize', fontSize: '14px' }} className="line-clamp-2">
                      {item?.title}
                    </Typography>
                    <Typography sx={{ textTransform: 'capitalize', fontSize: '14px', color: '#5A5A72' }}>
                      Recipe
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          {isAllSearchDataEmpty && <Typography sx={{ textAlign: 'center' }}>No results found</Typography>}
        </Paper>
      )}
    </>
  );
};

export const SearchField = ({ sx, searchText, setOpen, open, onClick, handleChange, searchMessage }: ISearchField) => {
  const handleClose = () => {
    if (setOpen) {
      setOpen(false);
    }
  };

  return (
    <SearchFieldWrapper>
      <ClickAwayListener onClickAway={() => setOpen && setOpen(false)}>
        <Box sx={{ position: 'relative', width: '100%' }}>
          <TextField
            onChange={handleChange}
            sx={{ ...sx }}
            fullWidth
            size="small"
            onClick={onClick}
            className="search--field"
            autoComplete="off"
            defaultValue=""
            id="outlined-basic"
            placeholder={searchText || 'Search for people news recipes'}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <SearchPopover open={searchMessage !== '' && open} onClose={handleClose} searchText={searchMessage} />
        </Box>
      </ClickAwayListener>
    </SearchFieldWrapper>
  );
};
