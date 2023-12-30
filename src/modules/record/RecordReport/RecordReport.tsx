import React from 'react';
import {
  GET_RECORD_DATA_BY,
  IRecordLogsAverageData,
  RECORD_TYPE,
  useGetAllRecordTypeDataWithDateRangeMutation,
} from '@newstart-online/sdk';
import { Box, Container } from '@mui/system';
import { Typography, Grid, useMediaQuery } from '@mui/material';
import ReportCard from '../common/ReportCard/ReportCard';

import dynamic from 'next/dynamic';
import moment from 'moment';
import { DistanceIcon, TimeIcon } from '~/icons';

import {
  defaultColor,
  getDataWithLabelsForRecordLogs,
  IOptionsConversions,
  recordTypeColor,
  unitForRecordType,
  optionsForWeight,
  optionsForDistance,
} from '../utils/record-logs-type';
import { useGetUser } from '~/utils/useGetUser';
import ToggleBar from '~/common-ui/ToggleBar/ToggleBar';
import TemperanceChart from '../common/TemperanceChart/TemperanceChart';
import { LoaderArea } from '~/modules/_core/components/loaderPage/LoaderArea';
import RecordProgressBar from '../common/RecordProgressBar/RecordProgressBar';
import { CommunityFooterLinks } from '~/modules/community/CommunityFooterLinks';
import { CourseListsStyles } from '~/modules/learn/course/styles/CourseListStyles';
import RecordsDetailsSideBar from '../common/RecordDetailsSideBar/RecordDetailsSideBar';

const BarChart = dynamic(() => import('../common/BarChart/BarChart'), {
  loading: () => <LoaderArea />,
});

const LineChart = dynamic(() => import('../common/LineChart/LineChart'), {
  loading: () => <LoaderArea />,
});

const RecordReport = () => {
  const [selectedRecordType, setSelectedRecordType] = React.useState<RECORD_TYPE | null>(null);

  const sevenDaysAgo: Date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const user = useGetUser();

  const matchesLG = useMediaQuery('(max-width:1200px)');
  const matchesSmallScreen = useMediaQuery('(max-width:1000px)');

  const [welcomeText, setWelcomeText] = React.useState<string>('Day');

  const [activeExerciseUnit, setActiveExerciseUnit] = React.useState<IOptionsConversions>(optionsForDistance[0]);
  const [activeWeightUnit, setActiveWeightUnit] = React.useState<IOptionsConversions>(optionsForWeight[0]);

  const [getAllRecordTypeDataWithDateRange, { data: recordData }] = useGetAllRecordTypeDataWithDateRangeMutation();

  const endDate = new Date().toISOString();
  const startDate = sevenDaysAgo.toISOString();

  React.useEffect(() => {
    getAllRecordTypeDataWithDateRange({ endDate, startDate });
  }, []);

  // function that tells Good morning, evening or afternoon
  React.useEffect(() => {
    const hour = moment().hour();

    if (hour > 16) {
      setWelcomeText('Good Evening');
    }
    if (hour > 11) {
      setWelcomeText('Good Afternoon');
    } else setWelcomeText('Good Morning');
  }, []);

  const getTodayData = (
    data: IRecordLogsAverageData | undefined,
    recordType: RECORD_TYPE.STEPS | RECORD_TYPE.WATER_INTAKE | RECORD_TYPE.ACTIVE_ENERGY,
  ) => {
    if (data) {
      const todayDate = new Date();
      const recordedDate = new Date(data.lastRecorded.date);

      if (todayDate.toDateString() === recordedDate.toDateString()) {
        const value = data?.lastRecorded?.record[recordType]?.value;

        return value ?? 0;
      }

      return 0;
    }

    return 0;
  };

  const getTodayExerciseInMinutesData = (
    data: IRecordLogsAverageData | undefined,
    recordType: RECORD_TYPE.EXERCISE_MINUTES,
  ) => {
    const defaultData = { distanceTravel: 0, exerciseTime: 0, exerciseType: 'Running and Walking' };
    if (data) {
      const todayDate = new Date();
      const recordedDate = new Date(data.lastRecorded.date);

      if (todayDate.toDateString() === recordedDate.toDateString()) {
        const value = data?.lastRecorded?.record[recordType];

        return value ?? defaultData;
      }

      return defaultData;
    }

    return defaultData;
  };

  const findDataByRecordType = (data: IRecordLogsAverageData[] | undefined, recordType: RECORD_TYPE) => {
    return data?.find((item) => item._id.recordType === recordType);
  };

  const todayWalkStepsData = getTodayData(findDataByRecordType(recordData?.data, RECORD_TYPE.STEPS), RECORD_TYPE.STEPS);
  const todayWaterBalanceData = getTodayData(
    findDataByRecordType(recordData?.data, RECORD_TYPE.WATER_INTAKE),
    RECORD_TYPE.WATER_INTAKE,
  );
  const todayActiveEnergyData = getTodayData(
    findDataByRecordType(recordData?.data, RECORD_TYPE.ACTIVE_ENERGY),
    RECORD_TYPE.ACTIVE_ENERGY,
  );

  const todayExInMinuteData = getTodayExerciseInMinutesData(
    findDataByRecordType(recordData?.data, RECORD_TYPE.EXERCISE_MINUTES),
    RECORD_TYPE.EXERCISE_MINUTES,
  );

  const exerciseInMinutesData = getDataWithLabelsForRecordLogs(
    recordData?.data?.find((item) => item._id.recordType === RECORD_TYPE.EXERCISE_MINUTES)?.data || [],
    RECORD_TYPE.EXERCISE_MINUTES,
    startDate,
    endDate,
    GET_RECORD_DATA_BY.DAY,
    activeExerciseUnit.conversion,
  );

  return (
    <>
      <Container maxWidth="xl">
        <Box marginBottom="48px">
          <Typography fontWeight="500" fontSize="32px" color="#131336" sx={{ display: 'flex', mt: 4 }}>
            {welcomeText},
            <Typography sx={CourseListsStyles.capitalizeText} variant="body1">
              {user?.name || user?.email}
            </Typography>
          </Typography>

          <Typography fontSize="16px" fontWeight="400" color="#5A5A72" mt="8px">
            Track your daily routine, and maintain good health
          </Typography>
        </Box>
        <RecordsDetailsSideBar
          selectedRecordType={selectedRecordType}
          openSideDrawer={!!selectedRecordType}
          toggleSideDrawer={() => setSelectedRecordType(null)}
        />

        <Grid container spacing="16">
          <Grid item xs={matchesSmallScreen ? 6 : 4}>
            <RecordProgressBar
              recordType={RECORD_TYPE.STEPS}
              title={
                <Typography component="span" fontSize="20px" fontWeight="700" textAlign="center">
                  You have walked{' '}
                  <Typography component="span" fontSize="20px" fontWeight="700" color="#FDB839">
                    {todayWalkStepsData} steps
                  </Typography>{' '}
                  today!
                </Typography>
              }
              value={todayWalkStepsData}
              color="#FDB839"
              dailyGoal={5000}
              unit={'steps'}
              onClick={setSelectedRecordType}
            />
          </Grid>

          <Grid item xs={matchesSmallScreen ? 6 : 4}>
            <RecordProgressBar
              recordType={RECORD_TYPE.WATER_INTAKE}
              title={
                <Typography component="span" fontSize="20px" fontWeight="700" textAlign="center">
                  You drank
                  <Typography component="span" fontSize="20px" fontWeight="700" color="#317BBE">
                    {' '}
                    {todayWaterBalanceData} ml water
                  </Typography>{' '}
                  today!
                </Typography>
              }
              value={todayWaterBalanceData}
              color="#317BBE"
              dailyGoal={1200}
              unit="ml"
              onClick={setSelectedRecordType}
            />
          </Grid>

          <Grid item xs={matchesSmallScreen ? 6 : 4}>
            <RecordProgressBar
              recordType={RECORD_TYPE.EXERCISE_MINUTES}
              title={
                <Typography component="span" fontSize="20px" fontWeight="700" textAlign="center">
                  You exercise{' '}
                  <Typography component="span" fontSize="20px" fontWeight="700" color="#D76F2C">
                    {todayExInMinuteData?.exerciseTime}mins
                  </Typography>{' '}
                  today!
                </Typography>
              }
              value={todayExInMinuteData?.exerciseTime}
              color="#D76F2C"
              dailyGoal={60}
              unit={'mins'}
              onClick={setSelectedRecordType}
            />
          </Grid>
        </Grid>
        <Grid container spacing={4} mt="64px">
          <Grid item xs={matchesLG ? 12 : 8}>
            <Grid>
              <ReportCard
                onClick={setSelectedRecordType}
                recordType={RECORD_TYPE.EXERCISE_MINUTES}
                title={'Exercise'}
                lastRecordedDate={
                  findDataByRecordType(recordData?.data, RECORD_TYPE.EXERCISE_MINUTES)?.lastRecorded?.date
                }
                toggleBar={
                  <ToggleBar
                    options={optionsForDistance}
                    onClick={(data) => setActiveExerciseUnit(data)}
                    activeOptions={activeExerciseUnit.value}
                  />
                }
                data={[
                  {
                    title: 'Last Recorded',
                    component: (
                      <Box>
                        <Grid container>
                          <Grid item display="flex" alignItems="center">
                            <DistanceIcon />

                            <Typography sx={{ color: '#147AE9', ml: '6px' }}>
                              {recordData?.data.find((item) => item._id.recordType === RECORD_TYPE.EXERCISE_MINUTES)
                                ?.lastRecorded?.record[RECORD_TYPE.EXERCISE_MINUTES]?.distanceTravel
                                ? (
                                    (recordData?.data.find(
                                      (item) => item._id.recordType === RECORD_TYPE.EXERCISE_MINUTES,
                                    )?.lastRecorded?.record[RECORD_TYPE.EXERCISE_MINUTES]?.distanceTravel ?? 1) /
                                    (activeExerciseUnit.conversion ?? 1)
                                  ).toFixed(2)
                                : 'NA'}{' '}
                              {activeExerciseUnit.value}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    ),
                  },
                  {
                    title: 'Average',
                    component: (
                      <Grid container>
                        <Grid item display="flex" alignItems="center">
                          <DistanceIcon />

                          <Typography sx={{ color: '#147AE9', ml: '6px' }}>
                            {recordData?.data.find((item) => item._id.recordType === RECORD_TYPE.EXERCISE_MINUTES)
                              ?.averageExerciseDistance
                              ? (
                                  (recordData?.data.find((item) => item._id.recordType === RECORD_TYPE.EXERCISE_MINUTES)
                                    ?.averageExerciseDistance ?? 1) / (activeExerciseUnit.conversion ?? 1)
                                ).toFixed(2)
                              : 'NA'}{' '}
                            {activeExerciseUnit.value}
                          </Typography>
                        </Grid>
                      </Grid>
                    ),
                  },
                ]}
                body={
                  <BarChart
                    showColorLabel={true}
                    backgroundColor={recordTypeColor.EXERCISE_MINUTES}
                    data={{ ...exerciseInMinutesData, datasets: [exerciseInMinutesData.datasets[0]] }}
                  />
                }
              />
            </Grid>
          </Grid>

          <Grid
            container
            direction={matchesLG ? 'row' : 'column'}
            item
            xs={matchesLG ? 12 : 4}
            sx={{
              display: 'flex',
              flexDirection: `${matchesLG ? 'row' : 'column'}`,
              justifyContent: { xl: 'space-between', lg: 'space-between' },
              gap: {
                lg: '20px',
                md: '20px',
                sm: '20px',
              },
            }}
          >
            <Grid item xs={matchesLG && 12}>
              <ReportCard
                onClick={setSelectedRecordType}
                title={'Nutrition'}
                recordType={RECORD_TYPE.NUTRITION}
                lastRecordedDate={findDataByRecordType(recordData?.data, RECORD_TYPE.NUTRITION)?.lastRecorded?.date}
                data={[
                  {
                    title: 'Last Recorded',
                    component: (
                      <Typography sx={{ color: '#147AE9' }}>
                        {recordData?.data.find((item) => item._id.recordType === RECORD_TYPE.NUTRITION)?.lastRecorded
                          .record[RECORD_TYPE.NUTRITION]?.ateNutritionFood !== undefined
                          ? recordData?.data.find((item) => item._id.recordType === RECORD_TYPE.NUTRITION)?.lastRecorded
                              .record[RECORD_TYPE.NUTRITION]?.ateNutritionFood
                            ? 'Yes'
                            : 'No'
                          : 'NA'}
                      </Typography>
                    ),
                  },
                  {
                    title: 'Average',
                    component: (
                      <Typography sx={{ color: '#147AE9' }}>
                        {recordData?.data.find((item) => item._id.recordType === RECORD_TYPE.NUTRITION)?.average !==
                        undefined
                          ? recordData?.data.find((item) => item._id.recordType === RECORD_TYPE.NUTRITION)?.average ===
                            'Yes'
                            ? 'Yes'
                            : 'No'
                          : 'NA'}
                      </Typography>
                    ),
                  },
                ]}
              />
            </Grid>

            <Grid item xs={matchesLG && 12}>
              <ReportCard
                onClick={setSelectedRecordType}
                title={'Flights Climbed'}
                recordType={RECORD_TYPE.FLIGHTS_CLIMBED}
                lastRecordedDate={
                  findDataByRecordType(recordData?.data, RECORD_TYPE.FLIGHTS_CLIMBED)?.lastRecorded?.date
                }
                data={[
                  {
                    title: 'Last Recorded',
                    component: (
                      <Typography sx={{ color: '#147AE9' }}>
                        {recordData?.data.find((item) => item._id.recordType === RECORD_TYPE.FLIGHTS_CLIMBED)
                          ?.lastRecorded.record[RECORD_TYPE.FLIGHTS_CLIMBED]?.value ?? 'NA '}{' '}
                        {unitForRecordType(RECORD_TYPE.FLIGHTS_CLIMBED)}
                      </Typography>
                    ),
                  },
                  {
                    title: 'Average',
                    component: (
                      <Typography sx={{ color: '#147AE9' }}>
                        {recordData?.data.find((item) => item._id.recordType === RECORD_TYPE.FLIGHTS_CLIMBED)
                          ?.average ?? 'NA '}{' '}
                        {unitForRecordType(RECORD_TYPE.FLIGHTS_CLIMBED)}
                      </Typography>
                    ),
                  },
                ]}
              />
            </Grid>

            <Grid item xs={matchesLG && 12}>
              <ReportCard
                onClick={setSelectedRecordType}
                title={'Weight'}
                recordType={RECORD_TYPE.WEIGHT}
                toggleBar={
                  <ToggleBar
                    options={optionsForWeight}
                    onClick={(data) => setActiveWeightUnit(data)}
                    activeOptions={activeWeightUnit.value}
                  />
                }
                lastRecordedDate={findDataByRecordType(recordData?.data, RECORD_TYPE.WEIGHT)?.lastRecorded?.date}
                data={[
                  {
                    title: 'Last Recorded',
                    component: (
                      <Typography sx={{ color: '#147AE9' }}>
                        {recordData?.data.find((item) => item._id.recordType === RECORD_TYPE.WEIGHT)?.lastRecorded
                          .record[RECORD_TYPE.WEIGHT]?.value
                          ? (
                              (recordData?.data?.find((item) => item._id.recordType === RECORD_TYPE.WEIGHT)
                                ?.lastRecorded.record[RECORD_TYPE.WEIGHT]?.value ?? 1) /
                              (activeWeightUnit.conversion ?? 1)
                            ).toFixed(2)
                          : 'NA '}{' '}
                        {activeWeightUnit.value}
                      </Typography>
                    ),
                  },
                  {
                    title: 'Average',
                    component: (
                      <Typography sx={{ color: '#147AE9' }}>
                        {recordData?.data.find((item) => item._id.recordType === RECORD_TYPE.WEIGHT)?.average
                          ? (
                              +(
                                recordData?.data.find((item) => item._id.recordType === RECORD_TYPE.WEIGHT)?.average ??
                                1
                              ) / (activeWeightUnit.conversion ?? 1)
                            ).toFixed(2)
                          : 'NA '}{' '}
                        {activeWeightUnit.value}
                      </Typography>
                    ),
                  },
                ]}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid container spacing={4} sx={{ mt: '56px' }}>
          <Grid item xs={6}>
            <ReportCard
              onClick={setSelectedRecordType}
              title={'Sleep'}
              recordType={RECORD_TYPE.SLEEP}
              lastRecordedDate={findDataByRecordType(recordData?.data, RECORD_TYPE.SLEEP)?.lastRecorded?.date}
              data={[
                {
                  title: 'Last Recorded',
                  component: (
                    <Typography sx={{ color: '#147AE9' }}>
                      {recordData?.data.find((item) => item._id.recordType === RECORD_TYPE.SLEEP)?.lastRecorded.record[
                        RECORD_TYPE.SLEEP
                      ]?.value ?? 'NA '}
                      {unitForRecordType(RECORD_TYPE.SLEEP)}
                    </Typography>
                  ),
                },
                {
                  title: 'Average',
                  component: (
                    <Typography sx={{ color: '#147AE9' }}>
                      {recordData?.data.find((item) => item._id.recordType === RECORD_TYPE.SLEEP)?.average ?? 'NA '}
                      {unitForRecordType(RECORD_TYPE.SLEEP)}
                    </Typography>
                  ),
                },
              ]}
              body={
                <BarChart
                  backgroundColor={recordTypeColor.SLEEP}
                  data={getDataWithLabelsForRecordLogs(
                    recordData?.data?.find((item) => item._id.recordType === RECORD_TYPE.SLEEP)?.data || [],
                    RECORD_TYPE.SLEEP,
                    startDate,
                    endDate,
                    GET_RECORD_DATA_BY.DAY,
                  )}
                />
              }
            />
          </Grid>

          <Grid item xs={6}>
            <ReportCard
              onClick={setSelectedRecordType}
              title={'Screen Time'}
              recordType={RECORD_TYPE.VITAMIN_D}
              lastRecordedDate={findDataByRecordType(recordData?.data, RECORD_TYPE.VITAMIN_D)?.lastRecorded?.date}
              data={[
                {
                  title: 'Last Recorded',
                  component: (
                    <Typography sx={{ color: '#147AE9' }}>
                      {recordData?.data.find((item) => item._id.recordType === RECORD_TYPE.VITAMIN_D)?.lastRecorded
                        .record[RECORD_TYPE.VITAMIN_D]?.timeInDirectSunlight ?? 'NA '}
                      {unitForRecordType(RECORD_TYPE.VITAMIN_D)}
                    </Typography>
                  ),
                },
                {
                  title: 'Average',
                  component: (
                    <Typography sx={{ color: '#147AE9' }}>
                      {recordData?.data.find((item) => item._id.recordType === RECORD_TYPE.VITAMIN_D)?.average ?? 'NA '}
                      {unitForRecordType(RECORD_TYPE.VITAMIN_D)}
                    </Typography>
                  ),
                },
              ]}
              body={
                <BarChart
                  backgroundColor={recordTypeColor.VITAMIN_D}
                  data={getDataWithLabelsForRecordLogs(
                    recordData?.data?.find((item) => item._id.recordType === RECORD_TYPE.VITAMIN_D)?.data || [],
                    RECORD_TYPE.VITAMIN_D,
                    startDate,
                    endDate,
                    GET_RECORD_DATA_BY.DAY,
                  )}
                />
              }
            />
          </Grid>
        </Grid>
        <Grid container spacing={4} sx={{ mt: '56px' }}>
          <Grid item xs={6}>
            <ReportCard
              recordType={RECORD_TYPE.BLOOD_SUGARS}
              onClick={setSelectedRecordType}
              title={'Blood Sugar'}
              sx={{ height: '572px' }}
              lastRecordedDate={findDataByRecordType(recordData?.data, RECORD_TYPE.BLOOD_SUGARS)?.lastRecorded?.date}
              data={[
                {
                  title: 'Last Recorded',
                  component: (
                    <>
                      <Typography sx={{ color: '#147AE9' }}>
                        Fasting:{' '}
                        {recordData?.data.find((item) => item._id.recordType === RECORD_TYPE.BLOOD_SUGARS)?.lastRecorded
                          .record[RECORD_TYPE.BLOOD_SUGARS]?.fastingBloodSugar ?? 'NA '}{' '}
                        {unitForRecordType(RECORD_TYPE.BLOOD_SUGARS)}
                      </Typography>
                      <Typography sx={{ color: '#147AE9' }}>
                        Random:{' '}
                        {recordData?.data.find((item) => item._id.recordType === RECORD_TYPE.BLOOD_SUGARS)?.lastRecorded
                          .record[RECORD_TYPE.BLOOD_SUGARS]?.randomBloodSugar ?? 'NA '}{' '}
                        {unitForRecordType(RECORD_TYPE.BLOOD_SUGARS)}
                      </Typography>
                    </>
                  ),
                },
                {
                  title: 'Average',
                  component: (
                    <>
                      <Typography sx={{ color: '#147AE9' }}>
                        Fasting:{' '}
                        {recordData?.data.find((item) => item._id.recordType === RECORD_TYPE.BLOOD_SUGARS)?.average ??
                          'NA '}{' '}
                        {unitForRecordType(RECORD_TYPE.BLOOD_SUGARS)}
                      </Typography>
                      <Typography sx={{ color: '#147AE9' }}>
                        Random:{' '}
                        {recordData?.data.find((item) => item._id.recordType === RECORD_TYPE.BLOOD_SUGARS)
                          ?.averageRandomBloodSugars ?? 'NA '}{' '}
                        {unitForRecordType(RECORD_TYPE.BLOOD_SUGARS)}
                      </Typography>
                    </>
                  ),
                },
              ]}
              body={
                <LineChart
                  backgroundColor={recordTypeColor[RECORD_TYPE.BLOOD_SUGARS] ?? defaultColor}
                  data={getDataWithLabelsForRecordLogs(
                    recordData?.data?.find((item) => item._id.recordType === RECORD_TYPE.BLOOD_SUGARS)?.data || [],
                    RECORD_TYPE.BLOOD_SUGARS,
                    startDate,
                    endDate,
                    GET_RECORD_DATA_BY.DAY,
                  )}
                />
              }
            />
          </Grid>

          <Grid item xs={6}>
            <ReportCard
              onClick={setSelectedRecordType}
              sx={{ height: '572px' }}
              title={'Blood Pressure'}
              recordType={RECORD_TYPE.BLOOD_PRESSURE}
              lastRecordedDate={findDataByRecordType(recordData?.data, RECORD_TYPE.BLOOD_PRESSURE)?.lastRecorded?.date}
              data={[
                {
                  title: 'Last Recorded',
                  component: (
                    <Typography sx={{ color: '#147AE9' }}>
                      {recordData?.data.find((item) => item._id.recordType === RECORD_TYPE.BLOOD_PRESSURE)?.lastRecorded
                        .record[RECORD_TYPE.BLOOD_PRESSURE]?.high ?? 'NA '}
                      /
                      {recordData?.data.find((item) => item._id.recordType === RECORD_TYPE.BLOOD_PRESSURE)?.lastRecorded
                        .record[RECORD_TYPE.BLOOD_PRESSURE]?.low ?? 'NA '}{' '}
                      {unitForRecordType(RECORD_TYPE.BLOOD_PRESSURE)}
                    </Typography>
                  ),
                },
                {
                  title: 'Average',
                  component: (
                    <Typography sx={{ color: '#147AE9' }}>
                      {recordData?.data.find((item) => item._id.recordType === RECORD_TYPE.BLOOD_PRESSURE)?.average ??
                        'NA '}{' '}
                      {unitForRecordType(RECORD_TYPE.BLOOD_PRESSURE)}
                    </Typography>
                  ),
                },
              ]}
              body={
                <LineChart
                  backgroundColor={recordTypeColor[RECORD_TYPE.BLOOD_PRESSURE] ?? defaultColor}
                  data={getDataWithLabelsForRecordLogs(
                    recordData?.data?.find((item) => item._id.recordType === RECORD_TYPE.BLOOD_PRESSURE)?.data || [],
                    RECORD_TYPE.BLOOD_PRESSURE,
                    startDate,
                    endDate,
                    GET_RECORD_DATA_BY.DAY,
                  )}
                />
              }
            />
          </Grid>
        </Grid>

        <Grid container spacing={matchesLG ? 12 : 4} sx={{ mt: '56px' }}>
          <Grid
            container
            direction="column"
            item
            xs={matchesLG ? 12 : 4}
            sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            gap={1}
          >
            <Grid item>
              <ReportCard
                onClick={setSelectedRecordType}
                recordType={RECORD_TYPE.TIME_OUTSIDE}
                title={'Time Outside'}
                lastRecordedDate={findDataByRecordType(recordData?.data, RECORD_TYPE.TIME_OUTSIDE)?.lastRecorded?.date}
                data={[
                  {
                    title: 'Last Recorded',
                    component: (
                      <Typography sx={{ color: '#147AE9' }}>
                        {recordData?.data.find((item) => item._id.recordType === RECORD_TYPE.TIME_OUTSIDE)?.lastRecorded
                          .record[RECORD_TYPE.TIME_OUTSIDE]?.value ?? 'NA '}{' '}
                        {unitForRecordType(RECORD_TYPE.TIME_OUTSIDE)}
                      </Typography>
                    ),
                  },
                  {
                    title: 'Average',
                    component: (
                      <Typography sx={{ color: '#147AE9' }}>
                        {recordData?.data.find((item) => item._id.recordType === RECORD_TYPE.TIME_OUTSIDE)?.average ??
                          'NA '}{' '}
                        {unitForRecordType(RECORD_TYPE.TIME_OUTSIDE)}
                      </Typography>
                    ),
                  },
                ]}
              />
            </Grid>
            <Grid item>
              <ReportCard
                onClick={setSelectedRecordType}
                title={'Prayer Time'}
                recordType={RECORD_TYPE.PRAYER_TIME}
                lastRecordedDate={findDataByRecordType(recordData?.data, RECORD_TYPE.PRAYER_TIME)?.lastRecorded?.date}
                data={[
                  {
                    title: 'Last Recorded',
                    component: (
                      <Typography sx={{ color: '#147AE9' }}>
                        {recordData?.data.find((item) => item._id.recordType === RECORD_TYPE.PRAYER_TIME)?.lastRecorded
                          .record[RECORD_TYPE.PRAYER_TIME]?.value ?? 'NA '}{' '}
                        {unitForRecordType(RECORD_TYPE.PRAYER_TIME)}
                      </Typography>
                    ),
                  },
                  {
                    title: 'Average',
                    component: (
                      <Typography sx={{ color: '#147AE9' }}>
                        {recordData?.data.find((item) => item._id.recordType === RECORD_TYPE.PRAYER_TIME)?.average ??
                          'NA '}{' '}
                        {unitForRecordType(RECORD_TYPE.PRAYER_TIME)}
                      </Typography>
                    ),
                  },
                ]}
              />
            </Grid>
            <Grid item>
              <ReportCard
                onClick={setSelectedRecordType}
                title={'Devotional Time'}
                recordType={RECORD_TYPE.DEVOTIONAL_TIME}
                lastRecordedDate={
                  findDataByRecordType(recordData?.data, RECORD_TYPE.DEVOTIONAL_TIME)?.lastRecorded?.date
                }
                data={[
                  {
                    title: 'Last Recorded',
                    component: (
                      <Typography sx={{ color: '#147AE9' }}>
                        {recordData?.data.find((item) => item._id.recordType === RECORD_TYPE.DEVOTIONAL_TIME)
                          ?.lastRecorded.record[RECORD_TYPE.DEVOTIONAL_TIME]?.value ?? 'NA '}{' '}
                        {unitForRecordType(RECORD_TYPE.DEVOTIONAL_TIME)}
                      </Typography>
                    ),
                  },
                  {
                    title: 'Average',
                    component: (
                      <Typography sx={{ color: '#147AE9' }}>
                        {recordData?.data.find((item) => item._id.recordType === RECORD_TYPE.DEVOTIONAL_TIME)
                          ?.average ?? 'NA '}{' '}
                        {unitForRecordType(RECORD_TYPE.DEVOTIONAL_TIME)}
                      </Typography>
                    ),
                  },
                ]}
              />
            </Grid>
          </Grid>
          <Grid item xs={matchesLG ? 12 : 8}>
            <Grid>
              <Grid item>
                <ReportCard
                  onClick={setSelectedRecordType}
                  title={'Temperance'}
                  recordType={RECORD_TYPE.TEMPERANCE}
                  lastRecordedDate={findDataByRecordType(recordData?.data, RECORD_TYPE.TEMPERANCE)?.lastRecorded?.date}
                  data={[
                    {
                      title: 'Alcohol',
                      component: (
                        <Typography sx={{ color: '#147AE9' }}>
                          {recordData?.data.find((item) => item._id.recordType === RECORD_TYPE.TEMPERANCE)
                            ?.averageAvoidedAlcohol ?? 'NA '}
                        </Typography>
                      ),
                    },
                    {
                      title: 'Drugs',
                      component: (
                        <Typography sx={{ color: '#147AE9' }}>
                          {recordData?.data.find((item) => item._id.recordType === RECORD_TYPE.TEMPERANCE)
                            ?.averageAvoidedDrugs ?? 'NA '}
                        </Typography>
                      ),
                    },
                    {
                      title: 'Smoking',
                      component: (
                        <Typography sx={{ color: '#147AE9' }}>
                          {recordData?.data.find((item) => item._id.recordType === RECORD_TYPE.TEMPERANCE)
                            ?.averageAvoidedSmoking ?? 'NA '}
                        </Typography>
                      ),
                    },
                  ]}
                  body={
                    <TemperanceChart
                      data={getDataWithLabelsForRecordLogs(
                        recordData?.data?.find((item) => item._id.recordType === RECORD_TYPE.TEMPERANCE)?.data || [],
                        RECORD_TYPE.TEMPERANCE,
                        startDate,
                        endDate,
                        GET_RECORD_DATA_BY.DAY,
                      )}
                    />
                  }
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container spacing={4} sx={{ mt: '56px', display: 'flex', justifyContent: 'space-between' }}>
          {/* <Grid container direction="column" item xs={6} > */}
          <Grid item xs={6}>
            <ReportCard
              recordType={RECORD_TYPE.HEART_RATE}
              onClick={setSelectedRecordType}
              sx={{ height: '570px' }}
              title={'Heart Rate'}
              lastRecordedDate={findDataByRecordType(recordData?.data, RECORD_TYPE.HEART_RATE)?.lastRecorded?.date}
              data={[
                {
                  title: 'Last Recorded',
                  component: (
                    <Typography sx={{ color: '#147AE9' }}>
                      {recordData?.data.find((item) => item._id.recordType === RECORD_TYPE.HEART_RATE)?.lastRecorded
                        .record[RECORD_TYPE.HEART_RATE]?.heartRate ?? 'NA '}
                      {unitForRecordType(RECORD_TYPE.HEART_RATE)}
                    </Typography>
                  ),
                },
                {
                  title: 'Average',
                  component: (
                    <Typography sx={{ color: '#147AE9' }}>
                      {recordData?.data.find((item) => item._id.recordType === RECORD_TYPE.HEART_RATE)?.average ??
                        'NA '}{' '}
                      {unitForRecordType(RECORD_TYPE.HEART_RATE)}
                    </Typography>
                  ),
                },
              ]}
              body={
                <LineChart
                  backgroundColor={recordTypeColor[RECORD_TYPE.HEART_RATE] ?? defaultColor}
                  data={getDataWithLabelsForRecordLogs(
                    recordData?.data?.find((item) => item._id.recordType === RECORD_TYPE.HEART_RATE)?.data || [],
                    RECORD_TYPE.HEART_RATE,
                    startDate,
                    endDate,
                    GET_RECORD_DATA_BY.DAY,
                  )}
                />
              }
            />
          </Grid>
          {/* </Grid> */}

          <Grid item xs={6}>
            <Grid>
              <ReportCard
                onClick={setSelectedRecordType}
                title={'Screen Time'}
                sx={{ height: '570px' }}
                recordType={RECORD_TYPE.SCREEN_TIME}
                lastRecordedDate={findDataByRecordType(recordData?.data, RECORD_TYPE.SCREEN_TIME)?.lastRecorded?.date}
                data={[
                  {
                    title: 'Last Recorded',
                    component: (
                      <Typography sx={{ color: '#147AE9' }}>
                        {recordData?.data.find((item) => item._id.recordType === RECORD_TYPE.SCREEN_TIME)?.lastRecorded
                          .record[RECORD_TYPE.SCREEN_TIME]?.value ?? 'NA '}{' '}
                        {unitForRecordType(RECORD_TYPE.SCREEN_TIME)}
                      </Typography>
                    ),
                  },
                  {
                    title: 'Average',
                    component: (
                      <Typography sx={{ color: '#147AE9' }}>
                        {recordData?.data.find((item) => item._id.recordType === RECORD_TYPE.SCREEN_TIME)?.average ??
                          'NA '}{' '}
                        {unitForRecordType(RECORD_TYPE.SCREEN_TIME)}
                      </Typography>
                    ),
                  },
                ]}
                body={
                  <BarChart
                    backgroundColor={recordTypeColor.SCREEN_TIME}
                    data={getDataWithLabelsForRecordLogs(
                      recordData?.data?.find((item) => item._id.recordType === RECORD_TYPE.SCREEN_TIME)?.data || [],
                      RECORD_TYPE.SCREEN_TIME,
                      startDate,
                      endDate,
                      GET_RECORD_DATA_BY.DAY,
                    )}
                  />
                }
              />
            </Grid>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CommunityFooterLinks />
        </Box>
      </Container>
    </>
  );
};

export default RecordReport;
