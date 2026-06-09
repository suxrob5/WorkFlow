"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { PIE_CHART_DATA, CHART_TOOLTIP_STYLE } from "@/data/admin";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ data }: { data?: any }) {
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

  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1200,
      easing: "easeInOutQuart",
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: textColor,
          font: { weight: "bold" as const, size: 12 },
        },
      },
      tooltip: { ...CHART_TOOLTIP_STYLE },
    },
  };

  const chartData = data || PIE_CHART_DATA;

  return (
    <div
      style={{
        width: "100%",
        height: "260px",
        position: "relative",
        cursor: "pointer",
      }}
    >
      <Pie data={chartData} options={options} />
    </div>
  );
}
