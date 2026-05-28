"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from "chart.js";
import { Pie } from "react-chartjs-2";
import { PIE_CHART_DATA, CHART_TOOLTIP_STYLE, CHART_LEGEND_LABEL_STYLE } from "@/data/admin";

ChartJS.register(ArcElement, Tooltip, Legend);

const options: ChartOptions<"pie"> = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { animateRotate: true, animateScale: true, duration: 1200, easing: "easeInOutQuart" },
  plugins: {
    legend: { position: "bottom", labels: CHART_LEGEND_LABEL_STYLE },
    tooltip: { ...CHART_TOOLTIP_STYLE },
  },
};

export default function PieChart() {
  return (
    <div style={{ width: "100%", height: "260px", position: "relative" }}>
      <Pie data={PIE_CHART_DATA} options={options} />
    </div>
  );
}
