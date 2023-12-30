import { Box, Grid, Typography } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartArea,
  registerables as registerablesJS,
} from 'chart.js';
import React from 'react';
import { Chart } from 'react-chartjs-2';
import { IBackgroundColor } from '../BarChart/BarChart';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ...registerablesJS);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
};

interface ILineChart {
  data: ChartData<any>;
  backgroundColor: IBackgroundColor;
}

const LineChart = (props: ILineChart) => {
  const { data, backgroundColor } = props;

  const chartRef = React.useRef<ChartJS>(null);
  const [chartData, setChartData] = React.useState<ChartData<'line'>>({
    datasets: [],
  });

  function getGradient(ctx: CanvasRenderingContext2D, chartArea: ChartArea, backgroundColor: IBackgroundColor) {
    let width, height, gradient;
    const chartWidth = chartArea.right - chartArea.left;
    const chartHeight = chartArea.bottom - chartArea.top;
    if (!gradient || width !== chartWidth || height !== chartHeight) {
      // Create the gradient because this is either the first render
      // or the size of the chart has changed
      gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
      gradient.addColorStop(0, backgroundColor.start);
      gradient.addColorStop(0.5, backgroundColor.end);
    }

    return gradient;
  }

  React.useEffect(() => {
    const chart = chartRef.current;

    if (!chart) {
      return;
    }

    const chartData = {
      ...(data || {}),
      datasets: data?.datasets?.map((dataset) => ({
        ...dataset,
        data: dataset.data.every((item: any) => item === undefined)
          ? dataset.data
          : dataset.data.map((item: any) => (item === undefined ? 0 : item)),
        borderColor: getGradient(chart.ctx, chart.chartArea, {
          start: dataset.startColor ?? backgroundColor.start,
          end: dataset.endColor ?? backgroundColor.end,
        }),

        backgroundColor: getGradient(chart.ctx, chart.chartArea, {
          start: dataset.startColor ?? backgroundColor.start,
          end: dataset.endColor ?? backgroundColor.end,
        }),
      })),
    };

    setChartData(chartData);
  }, [data]);

  return (
    <Box>
      <Grid container gap="16px" justifyContent="flex-end" sx={{ mt: '12px' }}>
        {data.datasets.map((item, index) => {
          return (
            <Grid display="flex" alignItems="center" item key={index}>
              <Box sx={{ backgroundColor: item.endColor, width: '12px', height: '12px', borderRadius: '50%' }}></Box>
              <Typography sx={{ ml: '8px' }}>{item.label}</Typography>
            </Grid>
          );
        })}
      </Grid>

      <Chart ref={chartRef} type="line" options={options} data={chartData} />
    </Box>
  );
};
export default LineChart;
