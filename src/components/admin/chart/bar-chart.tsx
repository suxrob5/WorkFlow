"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { BAR_CHART_DATA, CHART_TOOLTIP_STYLE } from "@/data/admin";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function BarChart() {
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
    ? "rgba(255, 255, 255, 0.7)"
    : "rgba(71, 85, 105, 1)";
  const gridColor = isDarkMode
    ? "rgba(255, 255, 255, 0.1)"
    : "rgba(0, 0, 0, 0.05)";

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1200, easing: "easeInOutQuart" },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: textColor,
          font: { weight: "bold", size: 12 },
        },
      },
      tooltip: { ...CHART_TOOLTIP_STYLE },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { color: gridColor },
        ticks: { color: textColor },
      },
      y: {
        beginAtZero: true,
        grid: { color: gridColor },
        ticks: { color: textColor },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "280px", position: "relative" }}>
      <Bar data={BAR_CHART_DATA} options={options} />
    </div>
  );
}
