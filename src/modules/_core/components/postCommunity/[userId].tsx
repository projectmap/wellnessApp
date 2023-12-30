import Image from 'next/image';
import { NextPage } from 'next';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Container, Grid, IconButton, Modal, Paper, Stack, Typography } from '@mui/material';

import { useAppSelector } from '~/state/app/hooks';
import { withFriends } from '~/modules/hoc/WithFriendsArea';
import { SendPrayers } from '~/modules/community/SendPrayers';
import { QRCodeModel } from '~/modules/_core/bits/modals/QrCodeModel';
import { ButtonWithIcon } from '~/modules/_core/bits/buttons/IconButton';
import { DefaultLink } from '~/modules/_core/components/links/DefaultLink';
import { EditProfileModel } from '~/modules/_core/bits/modals/EditProfileModel';

import {
  AchievementIcon,
  ChevronBlueLeftProfilePage,
  DietIcon,
  EditProfileIcon,
  QRICon,
  RunIcon,
  ShareIcon,
  SleepIcon,
  UserEmailIcon,
  UserMobileIcon,
  UsersIcon,
} from '~/icons';
import { FollowUser } from '~/modules/community/FollowUser';
import { DEFAULT_AVATAR, useGetProfileQuery } from '@newstart-online/sdk';

const PublicProfile: NextPage = () => {
  const router = useRouter();
  const { userId: _userId } = router.query;

  const user = useAppSelector((state) => state.user.user);

  const { data } = useGetProfileQuery();

  const [profile, setProfile] = useState(user);

  const userId = _userId as string;

  const [openQRModal, setOpenQRModal] = useState<boolean>(false);
  const [openProfileModal, setOpenProfileModal] = useState<boolean>(false);
  const handleOpenQR = () => setOpenQRModal(true);
  const handleCloseQR = () => setOpenQRModal(false);
  const handleOpenProfile = () => setOpenProfileModal(true);
  const handleCloseProfile = () => setOpenProfileModal(false);

  const friends = useAppSelector((state) => state.friends.data);

  const friendsWithAvatar = friends.filter((f) => f.photo).slice(0, 4);

  const isCurrentLoggedInUser = userId === user?._id;

  return (
    <Box sx={{ background: '#E4E8F1', pt: 4 }}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={3}></Grid>
          <Grid item xs={6}>
            <Paper
              sx={{ py: 3, px: 4, borderRadius: '12px', mb: 2 }}
              elevation={0}
              className="profile-page-user-background"
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Image
                    className="avatar"
                    src={profile?.photo || '/assets/images/avatar.png'}
                    alt={profile?.name || 'User Profile'}
                    width={128}
                    height={128}
                  />
                  <Stack alignItems="start" sx={{ pl: 4 }}>
                    <Typography variant="h6">{profile?.name}</Typography>
                    {isCurrentLoggedInUser && (
                      <IconButton onClick={handleOpenQR}>
                        <QRICon />
                      </IconButton>
                    )}
                  </Stack>
                </Box>
                {isCurrentLoggedInUser && (
                  <IconButton
                    sx={{
                      '&:hover': {
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    <EditProfileIcon onClick={handleOpenProfile} />
                  </IconButton>
                )}
              </Box>
            </Paper>
            <Paper sx={{ pt: 2, px: 3, pb: 3, borderRadius: '12px', background: '#fff', mb: 2 }} elevation={0}>
              <Stack direction="column">
                {profile?.phone && (
                  <Box sx={{ mb: 3 }}>
                    <ButtonWithIcon icon={<UserMobileIcon />}>{profile.phone}</ButtonWithIcon>
                  </Box>
                )}
                {profile?.email && (
                  <Box sx={{ mb: 3 }}>
                    <ButtonWithIcon icon={<UserEmailIcon />}>{profile.email}</ButtonWithIcon>
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
                              src={f.photo ?? DEFAULT_AVATAR}
                              className="avatar"
                              alt={f.name ?? "Friend's Profile"}
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
            <Paper sx={{ pt: 2, px: 3, pb: 3, borderRadius: '12px', background: '#fff', mb: 2 }} elevation={0}>
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
            <Paper sx={{ pt: 2, px: 3, pb: 3, borderRadius: '12px', background: '#fff', mb: 2 }} elevation={0}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">Health goals </Typography>
                <IconButton>
                  <ShareIcon />
                </IconButton>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  pt: 2,
                  pb: 3,
                  borderBottom: '1px solid #EFEFEF;',
                  width: '80%',
                  margin: '0 auto',
                }}
              >
                <Stack alignItems="center" sx={{ width: '172px' }}>
                  <Typography variant="subtitle1">Physical Activity</Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      backgroundImage: 'linear-gradient(to left,#27AE60, #9EB643)',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      pt: 1,
                    }}
                  >
                    72%
                  </Typography>
                </Stack>
                <Stack alignItems="center" sx={{ width: '172px' }}>
                  <Typography variant="subtitle1">Lose weight</Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      backgroundImage: 'linear-gradient(to left,#FF6629, #F5822C)',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      pt: 1,
                    }}
                  >
                    22%
                  </Typography>
                </Stack>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  pt: 2,
                  pb: 3,
                  width: '80%',
                  margin: '0 auto',
                }}
              >
                <Stack alignItems="center" sx={{ width: '172px' }}>
                  <Typography variant="subtitle1">Be free of alcohol</Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      backgroundImage: 'linear-gradient(to left,#519BD2, #1A65B0)',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      pt: 1,
                    }}
                  >
                    80%
                  </Typography>
                </Stack>
                <Stack alignItems="center" sx={{ width: '172px' }}>
                  <Typography variant="subtitle1">Plant based foods</Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      backgroundImage: 'linear-gradient(to left,#00B29E,#00B29E )',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      pt: 1,
                    }}
                  >
                    50%
                  </Typography>
                </Stack>
              </Box>
            </Paper>
            <Paper sx={{ pt: 2, px: 3, pb: 3, borderRadius: '12px', background: '#fff', mb: 2 }} elevation={0}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="h6">Challenges</Typography>
                  <Typography variant="h6" color="primary">
                    4
                  </Typography>
                </Stack>
                <IconButton>
                  <ShareIcon />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 3, flexWrap: 'wrap' }}>
                <Stack alignItems="start" sx={{ mb: 2 }}>
                  <Image src="/assets/images/tmp/ChallangesImage1.png" alt="challenge" width={250} height={180} />
                  <Typography variant="subtitle2" align="center" sx={{ pt: 1 }}>
                    Running Challenge
                  </Typography>
                  <Typography variant="subtitle2" sx={{ color: '#000000', opacity: '0.5', pt: 0.5 }}>
                    6 days
                  </Typography>
                </Stack>
                <Stack alignItems="start" sx={{ mb: 2 }}>
                  <Image src="/assets/images/tmp/ChallangesImage2.png" alt="challenge" width={250} height={180} />
                  <Typography variant="subtitle2" align="center" sx={{ pt: 1 }}>
                    No alcohol challenge
                  </Typography>
                  <Typography variant="subtitle2" sx={{ color: '#000000', opacity: '0.5', pt: 0.5 }}>
                    4 days
                  </Typography>
                </Stack>
                <Stack alignItems="start" sx={{ mb: 2 }}>
                  <Image src="/assets/images/tmp/ChallangesImage3.png" alt="challenge" width={250} height={180} />
                  <Typography variant="subtitle2" align="center" sx={{ pt: 1 }}>
                    Veg meal challenge
                  </Typography>
                  <Typography variant="subtitle2" sx={{ color: '#000000', opacity: '0.5', pt: 0.5 }}>
                    9 days
                  </Typography>
                </Stack>
                <Stack alignItems="start" sx={{ mb: 2 }}>
                  <Image src="/assets/images/tmp/ChallangesImage4.png" alt="challenge" width={250} height={180} />
                  <Typography variant="subtitle2" align="center" sx={{ pt: 1 }}>
                    One liter challenge
                  </Typography>
                  <Typography variant="subtitle2" sx={{ color: '#000000', opacity: '0.5', pt: 0.5 }}>
                    3 days
                  </Typography>
                </Stack>
              </Box>
            </Paper>
            <Paper sx={{ pt: 2, px: 3, pb: 3, borderRadius: '12px', background: '#fff', mb: 2 }} elevation={0}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="h6">Contests</Typography>
                  <Typography variant="h6" color="primary">
                    3
                  </Typography>
                </Stack>
                <IconButton>
                  <ShareIcon />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 3, flexWrap: 'wrap' }}>
                <Stack alignItems="start" sx={{ mb: 2 }}>
                  <RunIcon />
                  <Typography variant="subtitle2" align="center" sx={{ pt: 1 }}>
                    Run
                  </Typography>
                </Stack>
                <Stack alignItems="start" sx={{ mb: 2 }}>
                  <DietIcon />
                  <Typography variant="subtitle2" align="center" sx={{ pt: 1 }}>
                    Diet
                  </Typography>
                </Stack>
                <Stack alignItems="start" sx={{ mb: 2 }}>
                  <SleepIcon />
                  <Typography variant="subtitle2" align="center" sx={{ pt: 1 }}>
                    Sleep
                  </Typography>
                </Stack>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <SendPrayers />
            <FollowUser />
          </Grid>
        </Grid>
        <Modal open={openQRModal} onClose={handleCloseQR} aria-labelledby="qrcode" aria-describedby="scan qrcode">
          <QRCodeModel onClick={handleCloseQR} />
        </Modal>

        {isCurrentLoggedInUser && user && (
          <Modal
            open={openProfileModal}
            onClose={handleCloseProfile}
            aria-labelledby="edit-profile"
            aria-describedby="edit your profile"
          >
            <EditProfileModel user={user} handleCloseProfile={handleCloseProfile} />
          </Modal>
        )}
      </Container>
    </Box>
  );
};

export default withFriends(PublicProfile);
