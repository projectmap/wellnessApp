import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Typography, IconButton, Grid, Box } from '@mui/material';

import { QuizIcon, ShareIconWhite } from '~/icons';
import { COMMUNITY_SHARE_MODAL_TYPE } from '~/state/constants';
import { CourseActionsStyles } from './styles/CourseActionsStyles';
import GenericShareModal from '~/modules/community/modals/GenericShareModal';
import { IUserLectureActivityResponse, useGetLectureQuery } from '@newstart-online/sdk';

interface ICourseActions {
  onQuizClicked: () => void;
  currentSelectedLectureUserActivity: IUserLectureActivityResponse;
  lectureTitle?: string;
  imageUrl?: string;
  id?: string;
  description?: string;
}
const CourseActions: React.FC<ICourseActions> = ({
  id,
  imageUrl,
  description,
  lectureTitle,
  onQuizClicked,
  currentSelectedLectureUserActivity,
}) => {
  const router = useRouter();
  const { data: selectedLectureDetails } = useGetLectureQuery(router?.query?.lecture as string, {
    skip: !router.query.lecture,
  });

  const [showGenericShareModal, setShowGenericShareModal] = useState(false);

  return (
    <Grid item xs={2}>
      <Box sx={CourseActionsStyles.courseActionContainer}>
        <GenericShareModal
          setShowGenericShareModal={setShowGenericShareModal}
          title={lectureTitle}
          imageUrl={imageUrl}
          showModal={showGenericShareModal}
          shareModalType={COMMUNITY_SHARE_MODAL_TYPE.sharedLecture}
          id={id}
          description={description}
        />
        {currentSelectedLectureUserActivity?.isCompleted && selectedLectureDetails?.quiz && (
          <Box>
            <IconButton sx={CourseActionsStyles.iconButton} onClick={onQuizClicked}>
              <QuizIcon />
            </IconButton>
            <Typography variant="body1" sx={CourseActionsStyles.quizTitle}>
              Quiz
            </Typography>
          </Box>
        )}

        <Box onClick={() => setShowGenericShareModal(true)}>
          <IconButton sx={CourseActionsStyles.iconButton}>
            <ShareIconWhite />
          </IconButton>
          <Typography variant="body1" sx={CourseActionsStyles.shareButton}>
            Share
          </Typography>
        </Box>
      </Box>
    </Grid>
  );
};

export default CourseActions;

const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};
