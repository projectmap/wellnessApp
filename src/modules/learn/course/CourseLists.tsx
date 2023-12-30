import React from 'react';
import { Box } from '@mui/system';
import Player from '@vimeo/player';
import { useRouter } from 'next/router';
import { Typography, List, ListItem, Stack, ListItemButton } from '@mui/material';

import CourseLockIcon from '~/icons/lockIcon.svg';
import LectureDurations from './LectureDurations';
import { getDurationHMS } from '~/utils/getDurationHMS';
import CourseVideoPlayIcon from '~/icons/playCourseIcon.svg';
import { CourseListsStyles } from './styles/CourseListStyles';
import { ILecturesResponse, useGetListsOfCurrentUserLectureActivityQuery } from '@newstart-online/sdk';
import CourseVideoLockWithPopover from './CouseVideoLockWithPopover';
interface ICourseLists {
  handleVideoPlayback: (course: ILecturesResponse) => void;
  sessionId: string;
  lectures: any;
  sessionTitle: string;
}

const CourseLists: React.FC<ICourseLists> = ({ handleVideoPlayback, lectures, sessionTitle }) => {
  const router = useRouter();
  const { data: currentUserLectureActivity } = useGetListsOfCurrentUserLectureActivityQuery();
  const isOpen = (id: string) => {
    return currentUserLectureActivity?.data?.some((activity: any) => activity?.lectures?._id === id);
  };

  return (
    <div>
      <div id="video-vimeo" className="video" style={{ display: 'none' }}></div>
      <List sx={{ padding: 0 }}>
        {lectures &&
          lectures?.map((lecture: any, id: number) => {
            const durationHMS = getDurationHMS(parseInt(lecture?.vimeoDetails?.duration, 10));

            return (
              <ListItemButton
                key={id}
                arai-videoid={lecture?._id}
                onClick={() => isOpen(lecture._id || '') && handleVideoPlayback(lecture)}
                sx={CourseListsStyles.listItemButton}
              >
                <ListItem
                  sx={{
                    borderTop: `${id === 0 ? 0 : '1px'} solid #E7E7EB`,

                    ...CourseListsStyles?.listItem,
                    opacity: isOpen(lecture?._id || '') ? 1 : 0.5,
                  }}
                >
                  <Stack>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: `${router?.query?.lecture === lecture?._id ? 'primary.main' : '#131336'}`,

                        ...CourseListsStyles?.lectureTitle,
                        fontWeight: 700,
                      }}
                    >
                      {lecture?.title} | {sessionTitle}
                    </Typography>
                    {/* duration for video in minutes */}
                    <Box sx={{ display: 'flex' }}>
                      {lecture.presenter?.map((item: any, idx: number) => {
                        let isCommaNeeded = idx < lecture?.presenter?.length - 1 ? true : false;

                        return (
                          <>
                            <Typography sx={{ fontWeight: '400', fontSize: '14px', color: '#5A5A72' }}>
                              {item.name}
                            </Typography>
                            {isCommaNeeded ? (
                              <Typography
                                sx={{ fontWeight: '400', fontSize: '14px', color: '#5A5A72', ml: '4px', mr: '4px' }}
                              >
                                {'&'}
                              </Typography>
                            ) : (
                              ''
                            )}
                          </>
                        );
                      })}

                      {lecture?.vimeoDetails && (
                        <Typography
                          variant="subtitle2"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            fontWeight: '400',
                            fontSize: '14px',
                            color: '#5A5A72',
                          }}
                        >
                          {lecture?.presenter?.length !== 0 && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box
                                sx={{
                                  background: '#A1A1AF',
                                  height: '2px',
                                  width: '6px',
                                  borderTop: '2px solid #5A5A72',
                                  mx: '5px',
                                }}
                              />
                            </Box>
                          )}

                          {durationHMS?.hour}
                          {durationHMS?.min}
                          {durationHMS?.sec}
                        </Typography>
                      )}
                    </Box>
                  </Stack>

                  {router?.query?.lecture === lecture?._id ? (
                    <Box sx={CourseListsStyles.pauseIcon}>
                      <Box sx={CourseListsStyles.sideBar} />
                      <Box sx={CourseListsStyles.sideBar} />
                    </Box>
                  ) : isOpen(lecture?._id || '') ? (
                    <CourseVideoPlayIcon />
                  ) : (
                    <CourseVideoLockWithPopover />
                  )}
                </ListItem>
              </ListItemButton>
            );
          })}
      </List>
    </div>
  );
};

export default CourseLists;
