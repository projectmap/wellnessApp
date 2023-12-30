import React from 'react';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import type { GetServerSideProps, NextPage } from 'next';

import { Community } from '~/modules/community';
import { useAppSelector } from '~/state/app/hooks';
import { withFriends } from '~/modules/hoc/WithFriendsArea';
import { LayoutArea } from '~/modules/_core/layout/LayoutArea';

const CommunityPage: NextPage<{ id: string | undefined; value: string }> = ({ id }) => {
  const router = useRouter();
  const learnSubScreens = useAppSelector((state) => state?.screens?.currentScreen?.subScreens);
  const currentSubScreen = learnSubScreens?.find((subScreen: any) => router.asPath.includes(subScreen.path));

  return (
    <div>
      <LayoutArea>
        <Box sx={{ background: '#FFFFFF', height: 'auto' }}>
          <Community type={currentSubScreen?.section} id={id} />
        </Box>
      </LayoutArea>
    </div>
  );
};

// so that the post can be rendered only once the data is fetched using id
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const value = query.props?.[0] ?? 'feed';
  const id = query.props?.[1] ?? null;

  return {
    props: {
      value,
      id,
    },
  };
};

export default withFriends(CommunityPage);
