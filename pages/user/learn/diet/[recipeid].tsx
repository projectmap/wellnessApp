import React from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
import { Box } from '@mui/system';
// import { useQuery } from '@apollo/client';
import { TabContext, TabPanel } from '@mui/lab';
import { GetServerSideProps, NextPage } from 'next';
import { Container, Divider, IconButton, Stack, Tab, Tabs, Typography } from '@mui/material';
// import { Loader } from '~/components/common/loader';

import { CommunityActiveIcon, EnvelopeIcon, SocialMediaShareIcon } from '~/icons';

const RecipeDetails: NextPage<{ recipeID: string }> = () => {
  const [value, setValue] = React.useState('1');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    event.preventDefault();
    setValue(newValue);
  };

  return (
    <div>
      <Container maxWidth="xl">
        {/* {RecipeDetails && <Image src={RecipeDetails?.featured_image?.url} alt="recipe" width={1300} height={850} />} */}
        {/* <Typography variant="h4">{data?.recipes?.title[0].text}</Typography> */}
        <Box sx={{ width: '100%', mt: 4 }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Instructions" value="1" sx={{ textTransform: 'capitalize' }} />
                <Tab label="Ingredients" value="2" sx={{ textTransform: 'capitalize' }} />
              </Tabs>
            </Box>
            <TabPanel value="1">
              <Box>
                {/* {RecipeDetails &&
                  RecipeDetails?.instructions.map((instruction: any, index: number) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Checkbox
                        {...label}
                        sx={{
                          borderRadius: '50%',
                        }}
                        icon={<CheckboxIcon />}
                        checkedIcon={<CheckedCheckboxIcon />}
                      />
                      <Typography>{instruction.text}</Typography>
                    </Box>
                  ))} */}
              </Box>
            </TabPanel>
            <TabPanel value="2">
              <Box>
                {/* {RecipeDetails &&
                  RecipeDetails?.ingredients.map((ingredient: any, index: number) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Checkbox
                        {...label}
                        sx={{
                          borderRadius: '50%',
                        }}
                        icon={<CheckboxIcon />}
                        checkedIcon={<CheckedCheckboxIcon />}
                      />
                      <Typography>{ingredient.text}</Typography>
                    </Box>
                  ))} */}
              </Box>
            </TabPanel>
          </TabContext>
          <Box sx={{ mt: 6 }}>
            <Typography variant="h6" align="center" sx={{ pb: 2 }}>
              Share
            </Typography>
            <Stack
              divider={<Divider orientation="vertical" flexItem />}
              spacing={2}
              direction="row"
              justifyContent="center"
            >
              <IconButton
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  fontSize: '14px',
                  color: '#131336',
                  fontWeight: '500',
                }}
                disableRipple
                disableFocusRipple
              >
                <EnvelopeIcon />
                via email
              </IconButton>
              <IconButton
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  fontSize: '14px',
                  color: '#131336',
                  fontWeight: '500',
                }}
                disableRipple
                disableFocusRipple
              >
                <SocialMediaShareIcon />
                Social Media
              </IconButton>
              <IconButton
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  fontSize: '14px',
                  color: '#131336',
                  fontWeight: '500',
                }}
                disableRipple
                disableFocusRipple
              >
                <CommunityActiveIcon />
                via Community
              </IconButton>
            </Stack>
          </Box>
          <Typography variant="h6" sx={{ mb: 2, mt: 5 }}>
            Related recepies
          </Typography>
          <Box>
            <Stack direction="row" spacing={2}>
              {/* {RelatedRecipes &&
                RelatedRecipes?.map((related_recipe: any, index: number) => (
                  <Box key={index} sx={{ cursor: 'pointer' }}>
                    <Link passHref href={`/user/learn/diet/${related_recipe?.next_prev_recipe_links?._meta.uid}`}>
                      <Box>
                        <Image
                          src={related_recipe?.next_prev_recipe_links?.body[0].primary?.featured_image.url}
                          alt={related_recipe?.next_prev_recipe_links?.title[0].text}
                          width={276}
                          height={163}
                        />
                        <Typography variant="subtitle1">
                          {related_recipe?.next_prev_recipe_links.title[0].text}
                        </Typography>
                      </Box>
                    </Link>
                  </Box>
                ))} */}
            </Stack>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const recipeID = query.recipeid as string;

  return {
    props: {
      recipeID,
    },
  };
};

export default RecipeDetails;
