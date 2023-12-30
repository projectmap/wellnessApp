import Image from 'next/image';
import { useRouter } from 'next/router';
import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Box, Container } from '@mui/system';
import { NextPage, GetServerSideProps } from 'next';

import { HalfLeftArrow } from '~/icons';
import BlogCard from '~/modules/learn/BlogCard';
import { LayoutArea } from '~/modules/_core/layout/LayoutArea';
import { LearnResources } from '~/modules/_core/styles/LearnResources';
import { ButtonWithIcon } from '~/modules/_core/bits/buttons/IconButton';
import { PrimaryButton } from '~/modules/_core/bits/buttons/PrimaryButton';
import { PolicyLinkArea } from '~/modules/_core/components/policyLink/PolicyLinkArea';
import { useListPaginatedBlogsQuery, IBlogsResponse, BLOGS_STATUS } from '@newstart-online/sdk';

const LatestArticles: NextPage<{ query: { category: string; page: string } }> = ({ query }) => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data: blogs } = useListPaginatedBlogsQuery({
    page: page,
    perPage: 8,
    category: query.category,
    status: BLOGS_STATUS.PUBLISHED,
  });

  const [blogsList, setBlogsList] = useState<any>([]);

  const handleLoadMore = () => {
    setPage((prevState) => prevState + 1);
  };

  useEffect(() => {
    blogs?.data?.length && setBlogsList((prevState: any) => [...prevState, ...(blogs?.data || [])]);
  }, [blogs?.data]);

  return (
    <LearnResources>
      <LayoutArea>
        <Container
          maxWidth="xl"
          sx={{
            borderRadius: '16px',
            px: '48',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', my: 4 }}>
            <ButtonWithIcon
              icon={<HalfLeftArrow />}
              onClick={() => router.back()}
              sx={{ fontSize: '32px', fontWeight: 700 }}
            >
              {`Latest ${
                router?.query?.category
                  ? typeof router?.query?.category === 'string' && router?.query?.category.replaceAll('-', ' ')
                  : 'Resources'
              }`}
            </ButtonWithIcon>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', my: '24px', flexWrap: 'wrap', gap: '12px' }}>
            {blogsList?.map((blog: IBlogsResponse) => {
              //@ts-ignore
              const categoryTitle = blog?.categories?.title;

              return (
                <Box
                  sx={{
                    width: '24%',
                  }}
                  key={blog._id}
                  onClick={() => router.push(`/user/learn/resources/detail/${blog._id}`)}
                >
                  <BlogCard
                    title={blog.title}
                    imgSrc={blog?.vimeoDetails?.thumbNailImage || blog?.featuredImage}
                    author={blog.author}
                  />
                </Box>
              );
            })}
          </Box>
          {blogs?.totalData > blogsList?.length && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: '48px' }}>
              <PrimaryButton onClick={handleLoadMore} sx={{ borderRadius: '32px' }}>
                Load More
              </PrimaryButton>
            </Box>
          )}
        </Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', pb: '12px', mt: '24px' }}>
          <PolicyLinkArea />
        </Box>
      </LayoutArea>
    </LearnResources>
  );
};

export default LatestArticles;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const query = ctx.query as { category: string; page: string };

  return {
    props: {
      query,
    },
  };
};
