"use client";

import {
  Chart as ChartJS,
  ArcElement, // Required for circular charts
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";
import { Pie } from "react-chartjs-2";

// 1. Register the structural elements
ChartJS.register(ArcElement, Tooltip, Legend);

// 2. Set up the data structure matching your colors
const data: ChartData<"pie"> = {
  labels: ["ПРИШЛИ", "НЕ ПРИШЛИ"],
  datasets: [
    {
      label: "Сотрудники",
      data: [300, 50],
      backgroundColor: [
        "rgb(54, 162, 235)", // Blue
        "rgb(255, 99, 132)", // Pinkish Red
      ],
      hoverOffset: 4,
    },
  ],
};
const options: ChartOptions<"pie"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
    },
  },
};

export default function PieChart() {
  return (
    <div style={{ width: "100%", height: "500px", position: "relative" }}>
      <Pie data={data} options={options} />
    </div>
  );
}
