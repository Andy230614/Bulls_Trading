// components/ChartComponent.jsx
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import moment from "moment";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const ChartComponent = ({ data, days }) => {
  const chartData = {
    labels: data.prices.map((price) =>
      days === 1
        ? moment(price[0]).format("HH:mm")
        : moment(price[0]).format("MMM DD")
    ),
    datasets: [
      {
        label: `Price (USD)`,
        data: data.prices.map((price) => price[1]),
        fill: false,
        borderColor: "#3b82f6",
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { ticks: { color: "#6b7280" } },
      y: { ticks: { color: "#6b7280" } },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default ChartComponent;
