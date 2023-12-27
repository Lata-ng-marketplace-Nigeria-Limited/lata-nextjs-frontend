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
        data: productClicks,
        backgroundColor: "#5113A1",
        borderColor: "#fff",
        borderWidth: 2,
        maxBarThickness: 40,
      },
      {
        label: "Clicks",
        data: productViews,
        backgroundColor: "#AE8CD0",
        borderColor: "#fff",
        borderWidth: 2,
        maxBarThickness: 40,
      },
    ],
  };

  const config = {
    type: "bar",
    data,
    options: {
      legend: { position: "bottom" },
      plugins: {
        legend: {
          display: true,
          // position: "bottom",
        },
      },
      responsive: true,
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
    },
  };

  return { data: config.data, options: config.options };
};
