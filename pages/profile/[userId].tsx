import { NextPage } from 'next';

import { Container } from '@mui/material';

import Feed from '~/modules/profile/othersProfiles/Feed';
import { LayoutArea } from '~/modules/_core/layout/LayoutArea';

const PublicProfile: NextPage = () => {
  return (
    <>
      <LayoutArea>
        <Container maxWidth="xl" sx={{ pt: '32px' }}>
          <Feed />
        </Container>
      </LayoutArea>
    </>
  );
};

export default PublicProfile;
