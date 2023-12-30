import React from 'react';
import dynamic from 'next/dynamic';
import { ChartData } from 'chart.js';
import LineChart from '../LineChart/LineChart';
import { RECORD_TYPE } from '@newstart-online/sdk';
import { defaultColor, recordTypeColor } from '../../utils/record-logs-type';
import { LoaderArea } from '~/modules/_core/components/loaderPage/LoaderArea';
import NutritionBarChart from '../NutritionBarChart/NutritionBarChart';

const GroupedChart = dynamic(() => import('../TemperanceChart/TemperanceChart'), {
  loading: () => <LoaderArea />,
});

const BarChart = dynamic(() => import('../BarChart/BarChart'), {
  loading: () => <LoaderArea />,
});

interface IRecordLogsChart {
  recordLogType: RECORD_TYPE;
  data: ChartData<any>;
}
const RecordLogsChart = (props: IRecordLogsChart) => {
  const { recordLogType } = props;
  switch (recordLogType) {
    case RECORD_TYPE.HEART_RATE:
    case RECORD_TYPE.SLEEP:
    case RECORD_TYPE.BLOOD_SUGARS:
    case RECORD_TYPE.BLOOD_PRESSURE:
    case RECORD_TYPE.VITAMIN_D:
      return <LineChart data={props.data} backgroundColor={recordTypeColor[props.recordLogType] ?? defaultColor} />;
    case RECORD_TYPE.TEMPERANCE:
      return <GroupedChart data={props.data} />;
    case RECORD_TYPE.NUTRITION:
      return (
        <NutritionBarChart data={props.data} backgroundColor={recordTypeColor[props.recordLogType] ?? defaultColor} />
      );

    default:
      return (
        <BarChart
          showColorLabel={props.recordLogType === RECORD_TYPE.EXERCISE_MINUTES}
          data={props.data}
          backgroundColor={recordTypeColor[props.recordLogType] ?? defaultColor}
        />
      );
  }
};

export default RecordLogsChart;
