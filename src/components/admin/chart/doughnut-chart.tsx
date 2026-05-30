"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { DOUGHNUT_CHART_DATA, CHART_TOOLTIP_STYLE } from "@/data/admin";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutChart({ data }: { data?: any }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const textColor = isDarkMode
    ? "rgba(255, 255, 255, 0.75)"
    : "rgba(71, 85, 105, 1)";

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1400,
      easing: "easeInOutCirc",
    },
    cutout: "68%",
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: textColor,
          font: { size: 12 },
          padding: 14,
          usePointStyle: true,
        },
      },
      tooltip: { ...CHART_TOOLTIP_STYLE },
    },
  };

  const chartData = data || DOUGHNUT_CHART_DATA;

  return (
    <div style={{ width: "100%", height: "260px", position: "relative" }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
