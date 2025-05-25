'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useDataStore } from '../utils/DataStore';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function NotQualifiedOverview() {
  const { data } = useDataStore();
  const { jobsAppliedData } = data;

  const chartData = {
    labels: jobsAppliedData.labels,
    datasets: [
      {
        label: 'Total Jobs Applied',
        data: jobsAppliedData.datasets[0].data,
        borderColor: 'rgb(59, 130, 246)', // blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return `Jobs Applied: ${context.parsed.y}`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value) {
            return value.toLocaleString();
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Calculate the total and percentage change
  const total = jobsAppliedData.datasets[0].data.reduce((a, b) => a + b, 0);
  const lastMonth = jobsAppliedData.datasets[0].data[jobsAppliedData.datasets[0].data.length - 2];
  const currentMonth = jobsAppliedData.datasets[0].data[jobsAppliedData.datasets[0].data.length - 1];
  const percentageChange = ((currentMonth - lastMonth) / lastMonth) * 100;

  return (
    <div className="p-4 rounded-lg shadow-lg" style={{
      background: 'linear-gradient(135deg, rgba(251, 243, 225, 0.9) 0%, rgba(249, 222, 219, 0.9) 50%, rgba(212, 236, 230, 0.9) 100%)',
      backdropFilter: 'blur(10px)',
    }}>
      {/* <h3 className="text-lg font-semibold text-gray-800 mb-4">Total Jobs Applied</h3> */}
      <div className="w-full h-64">
        <Line data={chartData} options={options} />
      </div>
      <div className="mt-4 text-center">
        <p className="text-lg font-semibold">{total.toLocaleString()}</p>
        <p className={`text-sm ${percentageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {percentageChange >= 0 ? '↑' : '↓'} {Math.abs(percentageChange).toFixed(1)}% last month
        </p>
      </div>
    </div>
  );
} 