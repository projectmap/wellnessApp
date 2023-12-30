import { Bar } from 'react-chartjs-2';

const data = {
  labels: ['Yes', 'No'],
  datasets: [
    {
      label: 'Responses',
      data: ['0', '10'],
      backgroundColor: [
        'rgba(75, 192, 192, 0.2)', // Yes bar color
        'rgba(255, 99, 132, 0.2)', // No bar color
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)', // Yes bar border color
        'rgba(255, 99, 132, 1)', // No bar border color
      ],
      borderWidth: 1,
    },
  ],
};

const options: any = {
  indexAxis: 'y',
  scales: {
    x: {
      ticks: {
        beginAtZero: true,
      },
    },
  },
};

const MyChart = () => {
  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default MyChart;
