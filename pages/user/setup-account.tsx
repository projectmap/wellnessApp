import Link from 'next/link';
import { Logo } from '~/icons';
import { NextPage } from 'next';
import { Box } from '@mui/system';
import { ContainerWrapperArea } from '~/modules/_core/layout/containerWrapper/ContainerWrapperArea';

const SetupAccount: NextPage = () => {
  return (
    <ContainerWrapperArea>
      <Box
        sx={{
          paddingTop: 6,
          paddingLeft: 12,
          display: {
            xs: 'none',
            sm: 'block',
          },
        }}
      >
        <Link href="/user/login">
          <a>
            <Logo />
          </a>
        </Link>
      </Box>
    </ContainerWrapperArea>
  );
};

export default SetupAccount;
