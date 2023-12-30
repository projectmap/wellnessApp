import { Box, Typography, Grid } from '@mui/material';
import { RECORD_TYPE, useListRecordLogsTypesQuery } from '@newstart-online/sdk';
import React from 'react';
import CircularProgressBar from '~/common-ui/CircularProgressBar/CircularProgressBar';
import { recordTypeWidthAndHeight } from '../../utils/record-logs-type';

interface IRecordProgressBar {
  recordType: RECORD_TYPE.STEPS | RECORD_TYPE.WATER_INTAKE | RECORD_TYPE.ACTIVE_ENERGY | RECORD_TYPE.EXERCISE_MINUTES;
  value: number;
  title: React.ReactNode;
  color: string;
  dailyGoal: number;
  unit: string;
  onClick: (recordType: RECORD_TYPE) => void;
}
const RecordProgressBar = (props: IRecordProgressBar) => {
  const { recordType, color, value, title, dailyGoal, unit, onClick } = props;
  const { data: recordLogTypes } = useListRecordLogsTypesQuery();

  const selectedRecord = recordLogTypes?.data?.find((item) => item.recordLogEnum === recordType);

  const colorForRecordType = {
    [RECORD_TYPE.STEPS]: '#FDB839',
    [RECORD_TYPE.WATER_INTAKE]: '#317BBE',
    [RECORD_TYPE.ACTIVE_ENERGY]: '#D76F2C',
    [RECORD_TYPE.EXERCISE_MINUTES]: '#D76F2C',
  };

  const progress = (value / dailyGoal) * 100;

  return (
    <Box
      onClick={() => onClick(recordType)}
      sx={{
        border: '1px solid #D3E4F4',
        borderRadius: '8px',
        p: '32px',
        height: '461px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box mx="auto" display="flex" width="50%">
        {title}
      </Box>

      <Box display="flex" justifyContent="center">
        <CircularProgressBar
          strokeWidth={12}
          circleOneStroke="#E7E7EB"
          circleTwoStroke={colorForRecordType[recordType]}
          progress={progress < 100 ? progress : 100}
        >
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <div>
              <img
                src={selectedRecord?.logo?.completedUrl}
                style={{ width: recordTypeWidthAndHeight[recordType].width, margin: 'auto' }}
                height={recordTypeWidthAndHeight[recordType].height}
              />
              <Typography color={color} fontSize="48px" fontWeight="700" lineHeight="140%" textAlign="center">
                {value > dailyGoal ? dailyGoal + '+' : value}
              </Typography>
              <Typography textAlign="center" fontWeight="700" fontSize="16" color="#131336">
                {unit}
              </Typography>
            </div>
          </Box>
        </CircularProgressBar>
      </Box>

      <Grid container>
        <Grid item xs={6} borderRight="1px solid #D0D0D7">
          <Typography>Daily Goal</Typography>
          <Typography fontSize="20px" fontWeight="700" color="#147AE9">
            {dailyGoal}
          </Typography>
        </Grid>

        <Grid item xs={6} container justifyContent="center">
          <Grid>
            <Typography>Remaining</Typography>
            <Typography fontSize="20px" fontWeight="700" color="#147AE9">
              {dailyGoal - value > 0 ? dailyGoal - value : 0}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RecordProgressBar;
