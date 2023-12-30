import React from 'react';
import { Grid, Typography } from '@mui/material';
import { DistanceIcon, FastingHeartIcon, RandomHeartIcon, TimeIcon } from '~/icons';
import { RECORD_TYPE, IRecordLogsInput } from '@newstart-online/sdk';
import { IOptionsConversions, unitForRecordType } from '~/modules/record/utils/record-logs-type';
interface ITodayDetails {
  recordLogType: RECORD_TYPE;
  recordLogsDetails: IRecordLogsInput | undefined;
  activeUnit: IOptionsConversions;
}

const TodayDetails = (props: ITodayDetails) => {
  const { recordLogType, recordLogsDetails, activeUnit } = props;
  const isNoDefaultUnit = !activeUnit.defaultUnit;

  const recordedDate = new Date(recordLogsDetails?.updatedAt || '');

  const currentDate = new Date();

  const isToday =
    recordedDate.getFullYear() === currentDate.getFullYear() &&
    recordedDate.getMonth() === currentDate.getMonth() &&
    recordedDate.getDate() === currentDate.getDate();

  const recordedDay = isToday ? 'Today' : 'Last Recorded';
  if (recordLogsDetails) {
    switch (recordLogType) {
      case RECORD_TYPE.HEART_RATE:
        var heartRateData = recordLogsDetails?.record[RECORD_TYPE.HEART_RATE];

        return (
          <>
            <Typography sx={{ fontSize: '14px' }}>{recordedDay} </Typography>
            <Grid container sx={{ mt: '9px' }} justifyContent="center" gap="26px">
              <Grid item display="flex">
                <FastingHeartIcon />
                <Typography sx={{ fontSize: '14px', ml: '6px' }}>
                  Heart Rate:
                  {heartRateData?.heartRate} {unitForRecordType(recordLogType)}
                </Typography>
              </Grid>
              <Grid item display="flex">
                <RandomHeartIcon />
                <Typography sx={{ fontSize: '14px', ml: '6px' }}>
                  Resting Heart Rate: {heartRateData?.restingHeartRate} {unitForRecordType(recordLogType)}
                </Typography>
              </Grid>
            </Grid>
          </>
        );
      case RECORD_TYPE.TEMPERANCE:
        var temperanceData = recordLogsDetails?.record[RECORD_TYPE.TEMPERANCE];

        return (
          <>
            <Typography sx={{ fontSize: '14px' }}>{recordedDay} </Typography>
            <Grid container sx={{ mt: '9px' }} justifyContent="center" gap="26px">
              <Grid item display="flex">
                <Typography sx={{ fontSize: '14px' }}>
                  Alcohol: {temperanceData?.avoidedAlcohol ? 'Yes' : 'No'}
                </Typography>
              </Grid>
              <Grid item>
                <Typography sx={{ fontSize: '14px' }}>Drugs: {temperanceData?.avoidedDrugs ? 'Yes' : 'No'}</Typography>
              </Grid>
              <Grid item>
                <Typography sx={{ fontSize: '14px' }}>
                  Smoking: {temperanceData?.avoidedSmoking ? 'Yes' : 'No'}
                </Typography>
              </Grid>
            </Grid>
          </>
        );
      case RECORD_TYPE.BLOOD_PRESSURE:
        var bloodPressureData = recordLogsDetails?.record[RECORD_TYPE.BLOOD_PRESSURE];

        return (
          <>
            <Typography sx={{ fontSize: '14px' }}>{recordedDay} </Typography>
            <Grid container sx={{ mt: '9px' }} justifyContent="center" gap="26px">
              <Grid item display="flex">
                <Typography sx={{ fontSize: '14px' }}>
                  Systolic :{bloodPressureData?.high} {unitForRecordType(recordLogType)}
                </Typography>
              </Grid>
              <Grid item>
                <Typography sx={{ fontSize: '14px' }}>
                  Diastolic: {bloodPressureData?.low} {unitForRecordType(recordLogType)}
                </Typography>
              </Grid>
            </Grid>
          </>
        );

      case RECORD_TYPE.EXERCISE_MINUTES:
        var exerciseMinutesData = recordLogsDetails?.record[RECORD_TYPE.EXERCISE_MINUTES];

        return (
          <>
            <Typography sx={{ fontSize: '14px' }}>{recordedDay} </Typography>
            <Grid container sx={{ mt: '9px' }} justifyContent="center" gap="26px" alignItems="center">
              <Grid item display="flex" alignItems="center">
                <DistanceIcon />
                <Typography sx={{ ml: '6px' }}>
                  {activeUnit?.value && activeUnit?.conversion && isNoDefaultUnit
                    ? ((exerciseMinutesData?.distanceTravel || 1) * (1 / activeUnit?.conversion))?.toFixed(2)
                    : exerciseMinutesData?.distanceTravel?.toFixed(2)}{' '}
                  {activeUnit.value}
                </Typography>
              </Grid>
              <Grid item display="flex" alignItems="center">
                <TimeIcon />
                <Typography sx={{ ml: '6px' }}>{exerciseMinutesData?.exerciseTime} mins</Typography>
              </Grid>
            </Grid>
          </>
        );

      case RECORD_TYPE.BLOOD_SUGARS:
        var bloodSugarsData = recordLogsDetails?.record[RECORD_TYPE.BLOOD_SUGARS];

        return (
          <>
            <Typography>{recordedDay}</Typography>
            <Grid container sx={{ mt: '9px' }} justifyContent="center" gap="26px" alignItems="center">
              <Grid item display="flex" alignItems="center">
                <FastingHeartIcon />
                <Typography sx={{ ml: '6px', fontSize: '14px' }}>
                  Fasting: {bloodSugarsData?.fastingBloodSugar} {unitForRecordType(recordLogType)}
                </Typography>
              </Grid>
              <Grid item display="flex" alignItems="center">
                <RandomHeartIcon />
                <Typography sx={{ ml: '6px', fontSize: '14px' }}>
                  Random: {bloodSugarsData?.randomBloodSugar} {unitForRecordType(recordLogType)}
                </Typography>
              </Grid>
            </Grid>
          </>
        );

      case RECORD_TYPE.NUTRITION:
        return (
          <Typography>
            Last Recorded: Ate plant based diet:{' '}
            {recordLogsDetails?.record[RECORD_TYPE.NUTRITION]?.ateNutritionFood ? 'Yes' : 'No'}
          </Typography>
        );

      case RECORD_TYPE.VITAMIN_D:
        return (
          <Grid display="flex" alignItems="center">
            <Typography sx={{ fontSize: '14px' }}>{recordedDay} </Typography>
            <Grid sx={{ mx: '6px' }}>
              <TimeIcon />
            </Grid>
            <Typography sx={{ fontSize: '14px', color: '#147AE9' }}>
              {
                // @ts-ignore
                activeUnit?.value && isNoDefaultUnit && activeUnit?.conversion
                  ? (
                      (recordLogsDetails?.record?.[recordLogType]?.timeInDirectSunlight || 0) *
                      (1 / activeUnit?.conversion)
                    )?.toFixed(2)
                  : // @ts-ignore
                    recordLogsDetails?.record[recordLogType]?.timeInDirectSunlight?.toFixed(2)
              }{' '}
              {activeUnit?.value ?? unitForRecordType(recordLogType)}
            </Typography>
          </Grid>
        );

      case RECORD_TYPE.ACTIVE_ENERGY:
      case RECORD_TYPE.STEPS:
        return (
          <Grid display="flex" alignItems="center">
            <Typography sx={{ fontSize: '14px' }}>{recordedDay} </Typography>
            <Typography sx={{ fontSize: '14px', color: '#147AE9', ml: '4px' }}>
              {
                // @ts-ignore
                activeUnit?.value && isNoDefaultUnit && activeUnit?.conversion
                  ? // @ts-ignore
                    recordLogsDetails?.record[recordLogType]?.value?.toFixed(2)
                  : // @ts-ignore
                    recordLogsDetails?.record[recordLogType]?.value?.toFixed(2)
              }
              {unitForRecordType(recordLogType)}
            </Typography>
          </Grid>
        );

      default:
        return (
          <Grid display="flex" alignItems="center">
            <Typography sx={{ fontSize: '14px' }}>{recordedDay} </Typography>
            {(activeUnit?.value === 'hr' || activeUnit?.value === 'min') && (
              <Grid sx={{ mx: '6px' }}>
                <TimeIcon />
              </Grid>
            )}
            <Typography sx={{ fontSize: '14px', color: '#147AE9', ml: '4px' }}>
              {
                // @ts-ignore
                activeUnit?.value && isNoDefaultUnit && activeUnit?.conversion
                  ? // @ts-ignore
                    (recordLogsDetails?.record[recordLogType]?.value * (1 / activeUnit?.conversion))?.toFixed(2)
                  : // @ts-ignore
                    recordLogsDetails?.record[recordLogType]?.value?.toFixed(2)
              }
              {activeUnit?.value ?? unitForRecordType(recordLogType)}
            </Typography>
          </Grid>
        );
    }
  }

  return <Typography>Last Recorded {'NA'}</Typography>;
};

export default TodayDetails;
