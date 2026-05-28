"use client";

import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler, ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { LINE_CHART_DATA, CHART_TOOLTIP_STYLE, CHART_LEGEND_LABEL_STYLE, CHART_SCALE_STYLE } from "@/data/admin";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const options: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 1500, easing: "easeInOutCubic" },
  plugins: {
    legend: { position: "top", labels: CHART_LEGEND_LABEL_STYLE },
    tooltip: { ...CHART_TOOLTIP_STYLE },
  },
  scales: {
    x: { ...CHART_SCALE_STYLE },
    y: { ...CHART_SCALE_STYLE, beginAtZero: false },
  },
};

export default function LineChart() {
  return (
    <div style={{ width: "100%", height: "280px", position: "relative" }}>
      <Line data={LINE_CHART_DATA} options={options} />
    </div>
  );
}
