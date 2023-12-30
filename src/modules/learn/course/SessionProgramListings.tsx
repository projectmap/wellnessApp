import React from 'react';
import { useRouter } from 'next/router';
import {
  ENUM_ROLE_ACCESS_FOR,
  useGetCurrentUserRunningLectureQuery,
  useGetProfileQuery,
  useLazyGetNextLectureByCourseIdAndLectureIdQuery,
  useListCourseQuery,
} from '@newstart-online/sdk';
import { LoaderArea } from '~/modules/_core/components/loaderPage/LoaderArea';

const SessionProgramListings = () => {
  const router = useRouter();
  const { data: courses } = useListCourseQuery();
  const { data: userProfileData } = useGetProfileQuery();
  const { data: userRunningLecture, isLoading } = useGetCurrentUserRunningLectureQuery();
  const [getNextLectureToPlay] = useLazyGetNextLectureByCourseIdAndLectureIdQuery();

  React.useEffect(() => {
    if (!router?.query?.location) {
      if (courses && !isLoading) {
        const activePrograms = courses.find((item: { isActive: boolean }) => item?.isActive);
        if (activePrograms) {
          if (userRunningLecture?.data && userProfileData?.data?.role?.accessFor !== ENUM_ROLE_ACCESS_FOR.FREE_USER) {
            if (userRunningLecture?.data?.lectures?._id) {
              router.push(
                `/user/learn/courses/${activePrograms?._id}?lecture=${userRunningLecture?.data?.lectures?._id}`,
              );
            } else {
              router.push(`/user/learn/courses/${activePrograms?._id}`);
            }
          } else {
            getNextLectureToPlay({
              courseId: activePrograms?._id || '',
            })
              .unwrap()
              .then((res) => {
                if (res?.data?._id) {
                  router.push(`/user/learn/courses/${activePrograms?._id}?lecture=${res?.data?._id}`);
                } else {
                  router.push(`/user/learn/courses/${activePrograms?._id}`);
                }
              });
          }
        }
      }
    }
  }, [courses, userRunningLecture, isLoading]);

  return <LoaderArea />;
};

export default SessionProgramListings;
