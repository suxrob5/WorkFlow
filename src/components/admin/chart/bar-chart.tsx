"use client";

import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend, ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { BAR_CHART_DATA, CHART_TOOLTIP_STYLE, CHART_LEGEND_LABEL_STYLE, CHART_SCALE_STYLE } from "@/data/admin";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 1200, easing: "easeInOutQuart" },
  plugins: {
    legend: { position: "top", labels: CHART_LEGEND_LABEL_STYLE },
    tooltip: { ...CHART_TOOLTIP_STYLE },
  },
  scales: {
    x: { ...CHART_SCALE_STYLE, beginAtZero: true },
    y: { ...CHART_SCALE_STYLE, beginAtZero: true },
  },
};

export default function BarChart() {
  return (
    <div style={{ width: "100%", height: "280px", position: "relative" }}>
      <Bar data={BAR_CHART_DATA} options={options} />
    </div>
  );
}
