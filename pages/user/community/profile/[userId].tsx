import { useEffect, useState } from 'react';

import Image from 'next/image';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import InfiniteScroll from 'react-infinite-scroll-component';

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
  EditProfileIcon,
  ChevronBlueLeftProfilePage,
} from '~/icons';

import { Card } from '~/modules/_core/bits/cards';
import { useAppSelector } from '~/state/app/hooks';
import { PostObj } from '~/modules/community/Types';
import { PostFeed } from '~/modules/community/PostFeed';
import { FollowUser } from '~/modules/community/FollowUser';
import { SendPrayers } from '~/modules/community/SendPrayers';
import { LayoutArea } from '~/modules/_core/layout/LayoutArea';
import { QRCodeModel } from '~/modules/_core/bits/modals/QrCodeModel';
import { ButtonWithIcon } from '~/modules/_core/bits/buttons/IconButton';
import { DefaultLink } from '~/modules/_core/components/links/DefaultLink';
import PostFeedSkeleton from '~/modules/community/components/PostFeedSkeleton';
import { EditProfileModel } from '~/modules/_core/bits/modals/EditProfileModel';

import { Box } from '@mui/system';
import { Container, Grid, IconButton, Modal, Paper, Stack, Typography } from '@mui/material';

import { useGetCurrentUserPostsQuery, useGetProfileQuery } from '@newstart-online/sdk';

const PublicProfile: NextPage = () => {
  const router = useRouter();
  const { userId: _userId } = router.query;

  const { data } = useGetProfileQuery();

  const profileData = data?.data;

  const userId = _userId as string;

  const [openQRModal, setOpenQRModal] = useState<boolean>(false);
  const [openProfileModal, setOpenProfileModal] = useState<boolean>(false);
  const handleOpenQR = () => setOpenQRModal(true);
  const handleCloseQR = () => setOpenQRModal(false);
  const handleOpenProfile = () => setOpenProfileModal(true);
  const handleCloseProfile = () => setOpenProfileModal(false);

  const friends = useAppSelector((state) => state.friends.data);

  const friendsWithAvatar = friends.filter((f) => f.photo).slice(0, 4);

  const isCurrentLoggedInUser = userId === profileData?._id;

  const profilePhoto = profileData?.photo?.completedUrl;

  const [page, setPage] = useState<number>(1);
  const { data: currentUserPostQuery, isFetching: currentUserPostLoading } = useGetCurrentUserPostsQuery({
    perPage: 2,
    page,
  });
  const currentUserPostData = currentUserPostQuery?.data;
  const [feeds, setFeeds] = useState<PostObj[]>([]);
  const nextPage = () => {
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    currentUserPostData?.map((curUserPostData: PostObj) => {
      setFeeds((prev) => [...prev, curUserPostData]);
    });
  }, [currentUserPostData]);

  return (
    <LayoutArea>
      <Box sx={{ background: '#E4E8F1', pt: 4 }}>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid item xs={3}></Grid>
            <Grid item xs={6}>
              <Stack direction="column" spacing={2}>
                <Paper
                  sx={{ py: 3, px: 4, borderRadius: '12px', mb: 2 }}
                  elevation={0}
                  className="profile-page-user-background"
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Image
                        className="avatar"
                        src={profilePhoto || '/assets/images/avatar.png'}
                        alt={profileData?.name || 'User Profile'}
                        width={128}
                        height={128}
                      />
                      <Stack alignItems="start" sx={{ pl: 4 }}>
                        <Typography variant="h6">{profileData?.name}</Typography>
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
                {!currentUserPostQuery && currentUserPostLoading ? (
                  <>
                    <PostFeedSkeleton />
                  </>
                ) : (
                  <>
                    {currentUserPostQuery &&
                      (feeds.length === 0 ? (
                        <Card>
                          <h3>No Feeds</h3>
                        </Card>
                      ) : (
                        <InfiniteScroll
                          dataLength={feeds.length}
                          next={() => nextPage()}
                          hasMore={page !== currentUserPostQuery.totalPage}
                          loader={<PostFeedSkeleton />}
                        >
                          <Stack direction="column" spacing={2}>
                            {feeds.map((postObj) => (
                              <PostFeed
                                key={postObj._id}
                                postObj={postObj}
                                currentUser={profileData?._id}
                                setFeeds={setFeeds}
                              />
                            ))}
                          </Stack>
                        </InfiniteScroll>
                      ))}
                  </>
                )}
              </Stack>
            </Grid>
            <Grid item xs={3}>
              <SendPrayers />
              <FollowUser />
            </Grid>
          </Grid>
          <Modal open={openQRModal} onClose={handleCloseQR} aria-labelledby="qrcode" aria-describedby="scan qrcode">
            <QRCodeModel onClick={handleCloseQR} />
          </Modal>

          {isCurrentLoggedInUser && profileData && (
            <Modal
              open={openProfileModal}
              onClose={handleCloseProfile}
              aria-labelledby="edit-profile"
              aria-describedby="edit your profile"
            >
              <EditProfileModel user={profileData} handleCloseProfile={handleCloseProfile} />
            </Modal>
          )}
        </Container>
      </Box>
    </LayoutArea>
  );
};

export default PublicProfile;
