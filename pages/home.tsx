import type { NextPage } from 'next';

import { HomePageArea } from '~/modules/homepage';
import { LayoutArea } from '~/modules/_core/layout/LayoutArea';

const HomePage: NextPage = () => {
  return (
    <LayoutArea>
      <HomePageArea />
    </LayoutArea>
  );
};

export default HomePage;
