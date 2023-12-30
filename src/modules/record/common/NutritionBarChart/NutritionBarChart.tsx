import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartArea,
  ChartData,
  registerables,
} from 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import { Box, Grid, Typography } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ...registerables);

export const options = {
  responsive: true,

  barThickness: 29,
  categoryPercentage: 0.2, // notice here
  barPercentage: 0.9,
  borderRadius: 42, // notice
  tooltips: { enabled: false },
  plugins: {
    legend: {
      display: false,
      position: 'top' as const,
      labels: {
        boxWidth: 0, // lable box size
      },
    },
  },
};

interface IExerciseGraphChart {
  backgroundColor: IBackgroundColor;
  data: ChartData<'bar'>;
}

export interface IBackgroundColor {
  start: string;
  end: string;
}

const NutritionBarChart = (props: IExerciseGraphChart) => {
  const { data, backgroundColor } = props;

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

        data: dataset.data.map(() => 5),
        backgroundColor: (bgcolor: any) => {
          const index = bgcolor.index;

          return dataset.data[index] ? '#9AB54A' : '#DADADA';
        },
      })),
    };

    setChartData(chartData);
  }, [data]);

  return (
    <Box>
      <Grid container gap="16px" justifyContent="flex-end" sx={{ my: '48px' }}>
        <Grid display="flex" alignItems="center" item>
          <Box sx={{ backgroundColor: '#9AB54A', width: '12px', height: '12px', borderRadius: '50%' }}></Box>
          <Typography sx={{ ml: '8px' }}>Nutritious Food</Typography>
        </Grid>
        <Grid></Grid>
        <Grid display="flex" alignItems="center" item>
          <Box sx={{ backgroundColor: '#DADADA', width: '12px', height: '12px', borderRadius: '50%' }}></Box>
          <Typography sx={{ ml: '8px' }}>unhealthy food</Typography>
        </Grid>
        <Grid></Grid>
      </Grid>
      <Chart
        ref={chartRef}
        type="bar"
        options={{
          ...options,
          scales: {
            y: {
              ticks: {
                display: false,
              },
            },
          },
        }}
        data={chartData}
      />
    </Box>
  );
};

export default NutritionBarChart;
