import React from 'react';
import {
  Title,
  Legend,
  Tooltip,
  ChartArea,
  ChartData,
  BarElement,
  LinearScale,
  CategoryScale,
  registerables,
  Chart as ChartJS,
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
  showColorLabel?: boolean;
}

export interface IBackgroundColor {
  start: string;
  end: string;
}
export function createGradient(ctx: CanvasRenderingContext2D, area: ChartArea, backgroundColor: IBackgroundColor) {
  const colorStart = backgroundColor.start;
  const colorEnd = backgroundColor.end;

  const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);

  gradient.addColorStop(0, colorStart);
  gradient.addColorStop(1, colorEnd);

  return gradient;
}

const ExerciseGraphChart = (props: IExerciseGraphChart) => {
  const { data, backgroundColor, showColorLabel } = props;

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
        data: dataset.data.map((item: any) => (item === undefined ? 0 : item)),

        backgroundColor: createGradient(chart.ctx, chart.chartArea, {
          start: dataset.startColor ?? backgroundColor.start,
          end: dataset.endColor ?? backgroundColor.end,
        }),
      })),
    };

    setChartData(chartData);
  }, [data]);

  return (
    <Box>
      {' '}
      {showColorLabel && (
        <Grid container gap="16px" justifyContent="flex-end" sx={{ mt: '12px' }}>
          {data.datasets.map((item: any, index) => {
            return (
              <Grid display="flex" alignItems="center" item key={index}>
                <Box sx={{ backgroundColor: item?.endColor, width: '12px', height: '12px', borderRadius: '50%' }}></Box>
                <Typography sx={{ ml: '8px' }}>{item.label}</Typography>
              </Grid>
            );
          })}
        </Grid>
      )}
      <Chart ref={chartRef} type="bar" options={options} data={chartData} />
    </Box>
  );
};

export default ExerciseGraphChart;
