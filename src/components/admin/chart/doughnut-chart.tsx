"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { DOUGHNUT_CHART_DATA, CHART_TOOLTIP_STYLE } from "@/data/admin";

ChartJS.register(ArcElement, Tooltip, Legend);

const options: ChartOptions<"doughnut"> = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { animateRotate: true, animateScale: true, duration: 1400, easing: "easeInOutCirc" },
  cutout: "68%",
  plugins: {
    legend: {
      position: "right",
      labels: {
        color: "rgba(255,255,255,0.75)",
        font: { size: 12 },
        padding: 14,
        usePointStyle: true,
      },
    },
    tooltip: { ...CHART_TOOLTIP_STYLE },
  },
};

export default function DoughnutChart() {
  return (
    <div style={{ width: "100%", height: "260px", position: "relative" }}>
      <Doughnut data={DOUGHNUT_CHART_DATA} options={options} />
    </div>
  );
}
