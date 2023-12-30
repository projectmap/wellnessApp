import * as React from 'react';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import type { NextPage, GetServerSideProps } from 'next';

import { useAppSelector } from '~/state/app/hooks';
import { MoreComponent } from '~/modules/more/more';
import { LayoutArea } from '~/modules/_core/layout/LayoutArea';

const MorePage: NextPage<{ id: string | undefined }> = ({ id }) => {
  const meSubScreens = useAppSelector((state) => state?.screens?.currentScreen?.subScreens);

  const router = useRouter();
  const currentSubScreen = meSubScreens?.find((subScreen: any) => router.asPath.includes(subScreen.path));

  return (
    <LayoutArea>
      <Box sx={{ height: `calc(100vh - 122px)` }}>
        <Box sx={{ width: '100%', height: '100%' }}>
          <MoreComponent type={currentSubScreen?.section} id={id} hasPermission={currentSubScreen?.hasPermission} />
        </Box>
      </Box>
    </LayoutArea>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const value = query.props?.[0];
  const id = query.props?.[1] ?? null;

  return {
    props: {
      value,
      id,
    },
  };
};

export default MorePage;
