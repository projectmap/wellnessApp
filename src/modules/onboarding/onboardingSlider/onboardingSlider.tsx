import React from 'react';
import Image from 'next/image';
import Slider from 'react-slick';

export const OnboardingSlider = () => {
  //for slider on right side of onboarding pages
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

  return (
    <div>
      <Slider {...settings}>
        <Image src="/assets/images/onboarding_member.png" width={577} height={770} alt="onboarding" />
        <Image src="/assets/images/onboarding_member.png" width={577} height={770} alt="onboarding" />
      </Slider>
    </div>
  );
};
