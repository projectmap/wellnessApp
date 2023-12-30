import React from 'react';
import Player from '@vimeo/player';
import {
  ILecturesResponse,
  useCreateOrUpdateUserCourseEnrollMutation,
  useGetCurrentUserEnrolledCourseByCourseIdQuery,
  useGetLectureQuery,
  useGetListsOfCurrentUserLectureActivityQuery,
} from '@newstart-online/sdk';
import { useRouter } from 'next/router';
import { VimeoPlayerStyledComponents } from './VimeoPlayerStyledComponent';

interface IVimeoPlayer {
  autoPlay: boolean;
  playNextLecture: () => void;
  courseId: any;
  nextLecture: ILecturesResponse;
  url?: string;
  durations?: string;
  nextLectureError?: any;
}

const VimeoPlayer: React.FC<IVimeoPlayer> = ({
  autoPlay,
  playNextLecture,
  nextLecture,
  courseId,
  durations,
  nextLectureError,
}) => {
  const router = useRouter();

  const [createOrUpdateUserCourseEnroll, { isLoading }] = useCreateOrUpdateUserCourseEnrollMutation();
  const { data: listOfLectureActivity } = useGetListsOfCurrentUserLectureActivityQuery();

  const { data: courseStats } = useGetCurrentUserEnrolledCourseByCourseIdQuery(courseId);
  const { data: currentLecture } = useGetLectureQuery((router?.query?.lecture as string) || '', {
    skip: !router.query.lecture,
  });

  const [vimeoPlayer, setVimeoPlayer] = React.useState<any>();
  React.useEffect(() => {
    if (currentLecture) {
      const options = {
        url: currentLecture.videoUrl,
        loop: false,
        autoplay: autoPlay,
      };
      const videoPlayer = new Player('video-vimeo', options);

      setVimeoPlayer(videoPlayer);
    }
  }, [currentLecture]);

  React.useEffect(() => {
    if (listOfLectureActivity) {
      if (vimeoPlayer && durations) {
        vimeoPlayer.on('ended', () => {
          const isCompleted = listOfLectureActivity?.data.find(
            (item: any) => item.lectures._id === router.query.lecture,
          )?.isCompleted;
          try {
            if (!isCompleted && (nextLecture !== undefined || nextLectureError)) {
              const currentHoursCompleted = parseInt(courseStats?.data?.hoursCompleted);
              const hoursCompleted = (currentHoursCompleted ?? 0) + parseInt(durations);

              const isCurrentLectureNotSessionEqualsToPrevious =
                currentLecture?.sessions?._id !== nextLecture?.sessions?._id;

              const postData: any = {
                courseId,
                hoursCompleted,
              };
              let ifNextLectureDoestExists = false;

              if (nextLectureError?.data.statusCode === 404) {
                ifNextLectureDoestExists = true;
              }

              //increment value if current lecture and next lecture sessions are different or we dont have any next lecture
              if (isCurrentLectureNotSessionEqualsToPrevious || ifNextLectureDoestExists) {
                // When courseStats.data.completedSessionCount is undefined, we will increment from 0 value which implies
                //previously no sessions has been completed.
                postData['completedSessionCount'] = (courseStats.data.completedSessionCount ?? 0) + 1;
              }
              createOrUpdateUserCourseEnroll(postData);
            }
          } catch (e) {
            console.error(e, 'error');
          }
          playNextLecture();
        });
      }
    }
  }, [vimeoPlayer, durations, listOfLectureActivity, nextLecture, nextLectureError]);

  React.useEffect(() => {
    if (vimeoPlayer && currentLecture) {
      vimeoPlayer.loadVideo(currentLecture.videoUrl);
    }
  }, [vimeoPlayer, currentLecture]);

  React.useEffect(() => {
    if (vimeoPlayer) {
      autoPlay && vimeoPlayer.play();
    }
  }, [vimeoPlayer, autoPlay]);

  return (
    <VimeoPlayerStyledComponents>
      <div id="video-vimeo" className="embed-container" style={{ border: '' }}></div>
    </VimeoPlayerStyledComponents>
  );
};

export default React.memo(VimeoPlayer);
