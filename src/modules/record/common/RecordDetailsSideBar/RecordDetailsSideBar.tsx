import React from 'react';
import { Box } from '@mui/system';
import { Typography, Drawer, Grid } from '@mui/material';

import {
  GET_RECORD_DATA_BY,
  RECORD_TYPE,
  useGetRecordReportByRecordTypeMutation,
  useListRecordLogsTypesQuery,
} from '@newstart-online/sdk';

import { ChartData } from 'chart.js';
import TodayDetails from './TodayDetails';
import RecordLogsChart from './RecordLogsChart';
import {
  getDataWithLabelsForRecordLogs,
  getOptionsForRecordLogs,
  IOptionsConversions,
} from '../../utils/record-logs-type';
import ToggleBar from '~/common-ui/ToggleBar/ToggleBar';

interface IRecordsDetailsSideBar {
  openSideDrawer: boolean;
  toggleSideDrawer: () => void;
  selectedRecordType: RECORD_TYPE | null;
}

const filterTime = [
  {
    label: 'Week',
    value: GET_RECORD_DATA_BY.DAY,
  },
  {
    label: 'Month',
    value: GET_RECORD_DATA_BY.MONTH,
  },
  {
    label: 'Year',
    value: GET_RECORD_DATA_BY.YEAR,
  },
];

const RecordsDetailsSideBar: React.FC<IRecordsDetailsSideBar> = (props) => {
  const { openSideDrawer, toggleSideDrawer, selectedRecordType } = props;
  const [selectedFilter, setSelectedFilter] = React.useState(filterTime[0]);
  const [showGraph, setShowGraph] = React.useState(false);

  const [activeUnit, setActiveUnit] = React.useState<IOptionsConversions>({ value: '', label: '' });

  const [chartData, setChartData] = React.useState<ChartData<'bar'>>({
    datasets: [],
  });

  const [getRecordReportByRecordType, { data: recordLogsDetails, isSuccess }] =
    useGetRecordReportByRecordTypeMutation();
  const { data: recordLogTypes } = useListRecordLogsTypesQuery();

  const selectedRecord = recordLogTypes?.data?.find((item) => item.recordLogEnum === selectedRecordType);
  const sevenDaysAgo: Date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const oneYearAgoDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
  const fiveYearAgoDate = new Date(new Date().setFullYear(new Date().getFullYear() - 5));

  const getDate = () => {
    if (selectedFilter.value === GET_RECORD_DATA_BY.DAY) {
      return {
        endDate: new Date().toISOString(),
        startDate: sevenDaysAgo.toISOString(),
      };
    }
    if (selectedFilter.value === GET_RECORD_DATA_BY.MONTH) {
      return {
        endDate: new Date().toISOString(),
        startDate: oneYearAgoDate.toISOString(),
      };
    }

    return {
      endDate: new Date().toISOString(),
      startDate: fiveYearAgoDate.toISOString(),
    };
  };

  React.useEffect(() => {
    selectedRecordType &&
      getRecordReportByRecordType({
        recordType: selectedRecordType,
        dataBy: selectedFilter.value,
        ...getDate(),
      });
  }, [selectedRecordType, selectedFilter.value]);

  React.useEffect(() => {
    const getDateDetails = getDate();

    if (recordLogsDetails && isSuccess && selectedRecordType && getDateDetails.startDate && getDateDetails.endDate) {
      const details = getDataWithLabelsForRecordLogs(
        recordLogsDetails?.data?.data,
        selectedRecordType,
        getDateDetails.startDate,
        getDateDetails.endDate,
        selectedFilter.value,
        activeUnit.defaultUnit ? 1 : activeUnit.conversion,
      );

      setShowGraph(true);
      setChartData(details);
    }
  }, [recordLogsDetails, isSuccess, activeUnit]);

  const onCloseSideBar = () => {
    toggleSideDrawer();
    setShowGraph(false);
  };

  const optionsForToggle = getOptionsForRecordLogs(selectedRecordType);

  React.useEffect(() => {
    if (optionsForToggle) {
      setActiveUnit(optionsForToggle[0]);
    }
  }, [optionsForToggle]);

  return (
    <div>
      <React.Fragment>
        <Drawer open={openSideDrawer} anchor="right" onClose={onCloseSideBar}>
          <Box sx={{ width: '754px', px: '92px', py: '90px' }}>
            <Grid container justifyContent="center">
              <Grid>
                <Box sx={{ marginBottom: '28px' }}>
                  <img src={selectedRecord?.logo?.completedUrl} style={{ width: '24px' }} height="24px" />
                </Box>
              </Grid>

              <Grid>
                <Typography sx={{ color: '#131336', ml: '6px' }} component="h5" fontWeight="700" fontSize="24px">
                  {selectedRecord?.title}
                </Typography>
              </Grid>
            </Grid>
            <Grid container justifyContent="center">
              {selectedRecordType && (
                <TodayDetails
                  activeUnit={activeUnit}
                  recordLogType={selectedRecordType}
                  recordLogsDetails={recordLogsDetails?.data?.latestDataForRecordLog}
                />
              )}
            </Grid>

            <Grid container justifyContent="center" sx={{ mt: '41px' }}>
              <Box>
                {filterTime?.map((item, index) => {
                  return (
                    <button
                      style={
                        selectedFilter === item
                          ? { border: ' 2px solid #147AE9', padding: '10px 40px', borderRadius: '30px' }
                          : { padding: '10px 40px', border: ' 2px solid white' }
                      }
                      key={item.value}
                      value={item.value}
                      onClick={() => setSelectedFilter(item)}
                      className={`learn-today-page-filtered-buttons ${
                        selectedFilter.value === item.value ? 'active' : ''
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </Box>
            </Grid>
            <Box display="flex" justifyContent="flex-end" mt="29px">
              {optionsForToggle && (
                <ToggleBar
                  options={optionsForToggle}
                  onClick={(data) => setActiveUnit(data)}
                  activeOptions={activeUnit.value}
                />
              )}
            </Box>
            <Box>
              {showGraph && selectedRecordType && chartData.labels && (
                <RecordLogsChart data={chartData} recordLogType={selectedRecordType} />
              )}
            </Box>

            <Typography sx={{ mt: '48px' }} fontWeight="700" fontSize="20px" color="#131336">
              About {selectedRecord?.title}
            </Typography>

            <Typography sx={{ mt: '8px' }} lineHeight="140%" fontWeight="400" fontSize="20px" letterSpacing="0.004em">
              <p dangerouslySetInnerHTML={{ __html: selectedRecord?.description || '' }}></p>
            </Typography>
          </Box>
        </Drawer>
      </React.Fragment>
    </div>
  );
};

export default RecordsDetailsSideBar;
