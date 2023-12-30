import { Box, Grid, Typography } from '@mui/material';
import {
  Title,
  Legend,
  Tooltip,
  ChartData,
  BarElement,
  LinearScale,
  CategoryScale,
  registerables,
  Chart as ChartJS,
} from 'chart.js';
import React from 'react';
import { Chart } from 'react-chartjs-2';
import { colorForTemperance } from '../../utils/record-logs-type';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ...registerables);

export const options = {
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
      text: 'Chart.js Bar Chart - Stacked',
    },
  },
  tooltips: { enabled: false },
  responsive: true,
  barThickness: 29,
  categoryPercentage: 0.2, // notice here
  barPercentage: 0.9,
  borderRadius: 42, // notice
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
      ticks: {
        display: false,
      },
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

interface ITemperanceChart {
  data: ChartData<'bar'>;
}

const TemperanceChart = (props: ITemperanceChart) => {
  const { data } = props;

  const chartRef = React.useRef<ChartJS>(null);
  const [chartData, setChartData] = React.useState<ChartData<'bar'>>({
    datasets: [],
  });

  React.useEffect(() => {
    const chart = chartRef.current;

    if (!chart) {
      return;
    }

    const chartData = {
      ...(data || {}),
      datasets: data?.datasets?.map((dataset: any) => ({
        ...dataset,
        data: labels.map(() => 5),

        backgroundColor: (bgcolor: any) => {
          const index = bgcolor.index;

          //@ts-ignore
          return dataset.data[index] ? colorForTemperance[dataset.label] : '#DADADA';
        },
      })),
    };

    setChartData(chartData);
  }, [data]);

  return (
    <Box>
      <Grid container gap="16px" justifyContent="flex-end" sx={{ mb: '48px', mt: '20px' }}>
        {data?.datasets?.map((item, index) => {
          return (
            <Grid display="flex" alignItems="center" item key={index}>
              <Box
                sx={{
                  backgroundColor: item?.label ? colorForTemperance[item?.label] : 'white',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                }}
              ></Box>
              <Typography sx={{ ml: '8px' }}>{item.label}</Typography>
            </Grid>
          );
        })}
        <Grid display="flex" alignItems="center" item>
          <Box sx={{ backgroundColor: '#DADADA', width: '12px', height: '12px', borderRadius: '50%' }}></Box>
          <Typography sx={{ ml: '8px' }}>Intemperence</Typography>
        </Grid>
        <Grid></Grid>
      </Grid>
      <Chart options={options} type="bar" ref={chartRef} data={chartData} />
    </Box>
  );
};
export default TemperanceChart;
