"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { LINE_CHART_DATA, CHART_TOOLTIP_STYLE } from "@/data/admin";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export default function LineChart() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Sync state with Tailwind dark mode class on the HTML tag
  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    // Run once on mount
    checkTheme();

    // Create a MutationObserver to listen for class changes on <html>
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Determine colors dynamically based on theme state
  const textColor = isDarkMode
    ? "rgba(255, 255, 255, 0.7)"
    : "rgba(71, 85, 105, 1)";
  const gridColor = isDarkMode
    ? "rgba(255, 255, 255, 0.1)"
    : "rgba(0, 0, 0, 0.05)";

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1500, easing: "easeInOutCubic" }, // Default animation intact
    plugins: {
      legend: {
        position: "top", // Default position intact
        labels: {
          color: textColor,
          font: { weight: "bold", size: 12 },
        },
      },
      tooltip: { ...CHART_TOOLTIP_STYLE }, // Default tooltips intact
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: textColor },
      },
      y: {
        beginAtZero: false, // Default setting intact
        grid: { color: gridColor },
        ticks: { color: textColor },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "280px", position: "relative" }}>
      <Line data={LINE_CHART_DATA} options={options} />
    </div>
  );
}
