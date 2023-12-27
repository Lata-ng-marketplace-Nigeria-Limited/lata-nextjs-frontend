import { MonthlyAnalyticsResponse } from "@/interface/views";
import { months } from "@/store/data/analytics";

const labels = months.map((month) => month.label);

export const chartConfig = (
  productClicks: number[],
  productViews: number[]
) => {
  const data = {
    labels,
    datasets: [
      {
        label: "Views",
        data: productViews,
        backgroundColor: "#5113A1",
        borderColor: "#fff",
        borderWidth: 2,
        maxBarThickness: 40,
      },
      {
        label: "Clicks",
        data: productClicks,
        backgroundColor: "#AE8CD0",
        borderColor: "#fff",
        borderWidth: 2,
        maxBarThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return { data, options };
};
