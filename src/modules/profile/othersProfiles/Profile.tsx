import { useState } from 'react';

import Image from 'next/image';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import {
  QRICon,
  RunIcon,
  DietIcon,
  ShareIcon,
  SleepIcon,
  UsersIcon,
  UserEmailIcon,
  UserMobileIcon,
  AchievementIcon,
  ChevronBlueLeftProfilePage,
} from '~/icons';

import defaultAvatarImage from 'public/assets/images/avatar.png';
import challenge1Image from 'public/assets/images/tmp/ChallangesImage1.png';
import challenge2Image from 'public/assets/images/tmp/ChallangesImage2.png';
import challenge3Image from 'public/assets/images/tmp/ChallangesImage3.png';
import challenge4Image from 'public/assets/images/tmp/ChallangesImage4.png';

import { useAppSelector } from '~/state/app/hooks';
import { FollowUser } from '~/modules/community/FollowUser';
import { SendPrayers } from '~/modules/community/SendPrayers';
import { QRCodeModel } from '~/modules/_core/bits/modals/QrCodeModel';
import { ButtonWithIcon } from '~/modules/_core/bits/buttons/IconButton';
import { DefaultLink } from '~/modules/_core/components/links/DefaultLink';

import { useGetUserProfileByIdQuery } from '@newstart-online/sdk';

import { Box } from '@mui/system';
import { UserProfile } from '~/modules/community/UserProfile';
import { IconButton, Modal, Paper, Stack, Typography } from '@mui/material';
import NewStartContainer from '~/modules/_core/NewStartLayoutContainer/NewStartContainer';
import { deactivateUserName } from '~/utils/helpers';

const Profile: NextPage = () => {
  const router = useRouter();

  const { userId: _userId } = router.query;
  const userId = _userId as string;

  const { data } = useGetUserProfileByIdQuery(userId);

  const profileData = data?.data?.user;
  const [openQRModal, setOpenQRModal] = useState<boolean>(false);
  const handleOpenQR = () => setOpenQRModal(true);
  const handleCloseQR = () => setOpenQRModal(false);

  const friends = useAppSelector((state) => state.friends.data);

  const friendsWithAvatar = friends.filter((f) => f.photo).slice(0, 4);

  const profilePhoto = profileData?.photo?.completedUrl;

  return (
    <>
      <NewStartContainer
        leftItem={<UserProfile userProfileShowStatus={true} userId={userId} showCameraIcon={false} />}
        praySection={<SendPrayers />}
        rightItemSticky={<FollowUser />}
        midItem={
          <Box>
            <Paper
              sx={{
                pt: 2,
                px: 3,
                pb: 3,
                borderRadius: '12px',
                background: '#FFFF',
                mb: 2,
                boxShadow: '0px 6px 18px 2px #0000000A',
                border: '1px solid #F4F5FC',
              }}
              elevation={0}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="h6">Badges achieved</Typography>
                  <Typography variant="h6" color="primary">
                    3
                  </Typography>
                </Stack>
                <IconButton>
                  <ShareIcon />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 3 }}>
                <Stack alignItems="center">
                  <AchievementIcon />
                  <Typography variant="subtitle2" align="center" sx={{ width: '65%' }}>
                    Best runner of the week
                  </Typography>
                </Stack>
                <Stack alignItems="center">
                  <AchievementIcon />
                  <Typography variant="subtitle2" align="center" sx={{ width: '65%' }}>
                    Best runner of the week
                  </Typography>
                </Stack>
                <Stack alignItems="center">
                  <AchievementIcon />
                  <Typography variant="subtitle2" align="center" sx={{ width: '65%' }}>
                    Best runner of the week
                  </Typography>
                </Stack>
              </Box>
            </Paper>
            <Paper
              sx={{
                py: 3,
                px: 4,
                borderRadius: '12px',
                mb: 2,
                boxShadow: '0px 6px 18px 2px #0000000A',
                border: '1px solid #F4F5FC',
              }}
              elevation={0}
              className="profile-page-user-background"
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Image
                    className="avatar"
                    src={profilePhoto || defaultAvatarImage}
                    alt={profileData?.name || 'User Profile'}
                    width={128}
                    height={128}
                  />
                  <Stack alignItems="start" sx={{ pl: 4 }}>
                    <Typography variant="h6">{profileData?.name || 'User Name'}</Typography>

                    <IconButton onClick={handleOpenQR}>
                      <QRICon />
                    </IconButton>
                  </Stack>
                </Box>
              </Box>
            </Paper>
            <Paper
              sx={{
                pt: 2,
                px: 3,
                pb: 3,
                borderRadius: '12px',
                background: '#FFFF',
                mb: 2,
                boxShadow: '0px 6px 18px 2px #0000000A',
                border: '1px solid #F4F5FC',
              }}
              elevation={0}
            >
              <Stack direction="column">
                {profileData?.phone && (
                  <Box sx={{ mb: 3 }}>
                    <ButtonWithIcon icon={<UserMobileIcon />}>{profileData.phone}</ButtonWithIcon>
                  </Box>
                )}
                {profileData?.email && (
                  <Box sx={{ mb: 3 }}>
                    <ButtonWithIcon icon={<UserEmailIcon />}>{profileData.email}</ButtonWithIcon>
                  </Box>
                )}
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <ButtonWithIcon icon={<UsersIcon />}>{`Friends (${friends.length})`}</ButtonWithIcon>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Stack direction="row">
                      {friendsWithAvatar.map((f) => (
                        <Box key={f._id} sx={{ mr: -1 }}>
                          <DefaultLink to={f._id || ''}>
                            <Image
                              src={f.photo ?? ''}
                              className="avatar"
                              alt={f.name || deactivateUserName}
                              width={32}
                              height={32}
                            />
                          </DefaultLink>
                        </Box>
                      ))}
                    </Stack>
                    <DefaultLink to={`/user/community/friends`}>
                      <IconButton>
                        <ChevronBlueLeftProfilePage />
                      </IconButton>
                    </DefaultLink>
                  </Box>
                </Box>
              </Stack>
            </Paper>
          </Box>
        }
      />

      <Modal open={openQRModal} onClose={handleCloseQR} aria-labelledby="qrcode" aria-describedby="scan qrcode">
        <QRCodeModel onClick={handleCloseQR} />
      </Modal>
    </>
  );
};

export default Profile;
