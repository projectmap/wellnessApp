import React from 'react';
import Link from 'next/link';
import Slider from 'react-slick';
import { Box } from '@mui/material';

import { BLOGS_STATUS, useListPaginatedBlogsQuery } from '@newstart-online/sdk';
import { ArrowLeftLineIcon, ArrowRight, SliderRightIcon } from '~/icons';
import { FeatureResourceCard } from './featureResourceItem/FeatureResourceCard';
import { FeaturedResourceWrapper } from '~/modules/_core/styles/FeaturedResourceWrapper';
import { RESOURCES_LOADING_THUMBNAIL } from '~/state/constants';

export const FeaturedResourceArea = () => {
  const settings = {
    nav: true,
    dots: false,
    infinite: false,
    speed: 500,
    centerPadding: '60px',
    slidesToShow: 2,
    slidesToScroll: 1,
    initialSlide: 0,
    nextArrow: (
      <span style={{ position: 'relative' }} className="arrow--left">
        <Box sx={{ position: 'absolute', top: '-32px', left: '12px' }}>
          <SliderRightIcon />
        </Box>
      </span>
    ),
    prevArrow: (
      <span style={{ position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: '-40px', left: '16px' }}>
          <ArrowLeftLineIcon />
        </Box>
      </span>
    ),
  };

  const { data: featureLists } = useListPaginatedBlogsQuery({
    page: 1,
    perPage: 4,
    featured: 'true',
    status: BLOGS_STATUS.PUBLISHED,
  });

  return (
    <FeaturedResourceWrapper>
      <Box className="header__title">
        <h3>Featured resources</h3>
        <Link href={`user/learn/today/`}>
          <p>
            See all <ArrowRight />
          </p>
        </Link>
      </Box>
      <Box className="resource__list">
        <Box className="resource__items">
          <Slider {...settings}>
            {featureLists?.data?.map((item: any) => {
              return (
                <FeatureResourceCard
                  key={item?._id}
                  id={item?._id}
                  author={item?.author}
                  title={item?.title}
                  imageSrc={
                    item?.vimeoDetails?.thumbNailImage ||
                    item?.featuredImage[0]?.completedUrl ||
                    RESOURCES_LOADING_THUMBNAIL
                  }
                />
              );
            })}
          </Slider>
        </Box>
      </Box>
    </FeaturedResourceWrapper>
  );
};
