import React, { FC } from 'react';
import AboutTab from './AboutTab';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { CourseStats } from '../courseStats';
import HandOutResourceTab from './HandOutTab';
import { Box, Tab, Typography } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { PrimaryButton } from '~/modules/_core/bits/buttons/PrimaryButton';
import {
  IPresentersResponse,
  IUserLectureActivityResponse,
  useCreateOrUpdateUserLectureActivityByLectureIdMutation,
  useGetLectureQuery,
} from '@newstart-online/sdk';
import InstructorProfile from './InstructorProfile';
import { COURSE_TAB_LIST } from '~/state/constants';
import { CourseLectureTabsStyles } from './styles/CourseLectureTabsStyles';

enum COURSE_LECTURE_TABS_ENUM {
  ABOUT = 'Overview',
  COURSE_STATS = 'Course Stats',
}

const tabsLists = [
  {
    name: COURSE_TAB_LIST.OVERVIEW,
    id: 'overview',
  },
  {
    name: COURSE_TAB_LIST.COURSE_STATS,
    id: 'Course Stats',
  },
  {
    name: COURSE_TAB_LIST.NOTES,
    id: 'course notes',
  },
  {
    name: COURSE_TAB_LIST.HANDOUT,
    id: 'course handout',
  },
];

interface ICourseLectureTabs {
  sessionCount: number;
  courseId: string;
  aboutDescriptions: string | undefined;
  currentSelectedLectureUserActivity: IUserLectureActivityResponse;
  allPresenters: IPresentersResponse[] | [];
}
const CourseLectureTabs: FC<ICourseLectureTabs> = ({
  sessionCount,
  courseId,
  aboutDescriptions,
  allPresenters,
  currentSelectedLectureUserActivity,
}) => {
  const [canUpdateNotes, setCanUpdateNotes] = React.useState(false);
  const [currentTab, setCurrentTab] = React.useState(COURSE_LECTURE_TABS_ENUM.ABOUT);

  const handleChange = (event: React.SyntheticEvent, newValue: COURSE_LECTURE_TABS_ENUM) => {
    setCurrentTab(newValue);
  };
  const [notes, setNotes] = React.useState('');

  const [createOrUpdateUserLectureActivityByLectureId] = useCreateOrUpdateUserLectureActivityByLectureIdMutation();
  const router = useRouter();
  const { data: selectedLectureDetails } = useGetLectureQuery(router?.query?.lecture as string, {
    skip: !router.query.lecture,
  });

  React.useEffect(() => {
    !notes && setNotes(currentSelectedLectureUserActivity?.notes || '');
    setCanUpdateNotes(false);
  }, [currentSelectedLectureUserActivity]);

  const handleNoteSave = () => {
    notes &&
      notes.replace(/\s/g, '') !== '' &&
      createOrUpdateUserLectureActivityByLectureId({ lectureId: router.query.lecture as string, notes: notes?.trim() })
        .unwrap()
        .then(() => {
          toast.success('Notes saved successfully.');
        })
        .catch((err) => {
          toast.error('Error saving notes.');
        });
  };

  return (
    <TabContext value={currentTab}>
      <Box sx={CourseLectureTabsStyles.courseLectureContainer}>
        <TabList onChange={handleChange} aria-label="learn-page-tabs">
          {tabsLists?.map((scn) => {
            if (scn.name === COURSE_TAB_LIST.HANDOUT && selectedLectureDetails?.handBook?.length === 0) {
              return;
            }

            return <Tab key={scn.id} label={scn.name} value={scn.name} sx={{ textTransform: 'capitalize' }} />;
          })}
        </TabList>
      </Box>
      <Box sx={CourseLectureTabsStyles.tabBody}>
        <TabPanel sx={CourseLectureTabsStyles.paddingZero} value={COURSE_LECTURE_TABS_ENUM?.ABOUT}>
          <AboutTab descriptions={aboutDescriptions} />

          <InstructorProfile allPresenters={allPresenters} />
        </TabPanel>
        <TabPanel sx={CourseLectureTabsStyles.paddingZero} value={COURSE_LECTURE_TABS_ENUM.COURSE_STATS}>
          <CourseStats sessionCount={sessionCount} courseId={courseId || ''} />
        </TabPanel>
        <TabPanel sx={CourseLectureTabsStyles.paddingZero} value="Notes">
          <Typography variant="h6" sx={CourseLectureTabsStyles.lectureNotesTitle}>
            Lecture Notes
          </Typography>

          <textarea
            className="hide-scrollbar"
            aria-label="maximum height"
            placeholder="Write Notes..."
            defaultValue=""
            style={{
              resize: 'none',
              width: '100%',
              height: '223px',
              border: '1px solid #5A5A72',
              borderRadius: '4px',
              textIndent: '24px',
              padding: '24px 16px',
              outline: 'none',
            }}
            value={notes}
            onChange={(e) => {
              setCanUpdateNotes(true);
              setNotes(e.target.value);
            }}
          ></textarea>

          <PrimaryButton
            disabled={notes && notes.replace(/\s/g, '') !== '' ? false : true}
            onClick={() => handleNoteSave()}
            sx={CourseLectureTabsStyles.saveNotesButton}
          >
            Save Notes
          </PrimaryButton>
        </TabPanel>
        <TabPanel sx={CourseLectureTabsStyles.paddingZero} value="Handout">
          <Typography variant="h6" sx={CourseLectureTabsStyles.lectureNoteTitle}>
            Lecture Handout
          </Typography>

          <HandOutResourceTab resources={selectedLectureDetails?.handBook} />
        </TabPanel>
      </Box>
    </TabContext>
  );
};

export default CourseLectureTabs;
