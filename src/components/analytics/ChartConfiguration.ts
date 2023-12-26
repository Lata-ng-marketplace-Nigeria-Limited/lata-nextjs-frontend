import { months } from "@/store/data/analytics";

const labels = months.map((month) => month.label);

export const data = {
  labels,
  datasets: [
    {
      label: "Views",
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: "#5113A1",
      borderColor: "#fff",
      borderWidth: 2,
      maxBarThickness: 40,
    },
    {
      label: "Clicks",
      data: [60, 9, 14, 43, 96, 35, 70],
      backgroundColor: "#AE8CD0",
      borderColor: "#fff",
      borderWidth: 2,
      maxBarThickness: 40,
    },
  ],
};

export const config = {
  type: "bar",
  data: data,
  options: {
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
