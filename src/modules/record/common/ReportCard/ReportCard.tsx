import React from 'react';
import moment from 'moment';
import { Typography } from '@mui/material';
import { Box, SxProps, Theme } from '@mui/system';
import Grid from '@mui/system/Unstable_Grid/Grid';
import { RECORD_TYPE, useListRecordLogsTypesQuery } from '@newstart-online/sdk';
interface IReportCard {
  title: string;
  icon?: string;
  data: { title: string; component: React.ReactNode }[];
  body?: React.ReactNode;
  recordType: RECORD_TYPE;
  onClick: (recordType: RECORD_TYPE) => void;
  lastRecordedDate?: Date | undefined;
  toggleBar?: React.ReactNode;
  sx?: SxProps<Theme> | undefined;
}

const ReportCard = ({ title, icon, data, body, recordType, onClick, lastRecordedDate, toggleBar, sx }: IReportCard) => {
  const { data: recordLogTypes } = useListRecordLogsTypesQuery();

  const selectedRecord = recordLogTypes?.data?.find((item) => item.recordLogEnum === recordType);

  return (
    <Box sx={{ border: '1px solid #D3E4F4', borderRadius: '8px', p: '36px', width: '100%', ...sx }}>
      <Grid container justifyContent="space-between">
        <Grid container sx={{ cursor: 'pointer' }} onClick={() => onClick(recordType)}>
          <Grid>
            <Box sx={{ marginBottom: '28px' }}>
              <img src={selectedRecord?.logo?.completedUrl} style={{ width: '28px' }} height="28px" />
            </Box>
          </Grid>

          <Grid>
            <Typography sx={{ color: '#131336', ml: '6px' }} component="h5" fontWeight="700" fontSize="24px">
              {selectedRecord?.title}
            </Typography>
          </Grid>
        </Grid>
        <Grid container>
          {lastRecordedDate && (
            <Grid display="flex" alignItems="center">
              <Typography color="#147AE9" fontWeight="700" fontSize="16">
                {moment(lastRecordedDate).format('ll')}
              </Typography>
            </Grid>
          )}
          <Box display="" justifyContent="flex-end" ml="12px">
            {toggleBar}
          </Box>
        </Grid>
      </Grid>
      <Box mt="10px">
        <Typography variant="subtitle1" sx={{ textAlign: 'left' }}></Typography>
        <Grid container justifyContent="space-between">
          {data.map((item, index) => {
            return (
              <Grid key={index}>
                <Typography
                  variant="subtitle1"
                  sx={{ textAlign: 'left', color: '#5A5A72', fontSize: '12px' }}
                  fontWeight="700"
                  fontSize="20px"
                  component="h6"
                >
                  {item.title}
                </Typography>

                {item.component}
              </Grid>
            );
          })}
        </Grid>
      </Box>
      {body}
    </Box>
  );
};

export default ReportCard;
