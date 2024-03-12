import { months } from "@/store/data/analytics";

const labels = months.map((month) => month.label);

export const options = {
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
      barPercentage: 1.9,
      categoryPercentage: 0.5,
      grid: {
        display: false,
      },
    },
  },
};

export const chartConfig = (
  productClicks: number[],
  productViews: number[],
  phoneClicks: number[],
  messageClicks: number[],
  months: string[]
) => {
  const data = {
    labels: months,
    datasets: [
      {
        label: "Views",
        data: productViews,
        backgroundColor: "#5113A1",
        borderColor: "#fff",
        maxBarThickness: 40,
        minBarThickness: 30,
      },
      {
        label: "Product clicks",
        data: productClicks,
        backgroundColor: "#AE8CD0",
        borderColor: "#fff",
        maxBarThickness: 40,
        minBarThickness: 30,
      },
      {
        label: "Phone clicks",
        data: phoneClicks,
        backgroundColor: "#7A109E",
        borderColor: "#fff",
        maxBarThickness: 40,
        minBarThickness: 30,
      },
      {
        label: "Message clicks",
        data: messageClicks,
        backgroundColor: "#8F59FC",
        borderColor: "#fff",
        maxBarThickness: 40,
        minBarThickness: 30,
      },
    ],
  };

  return { data, options };
};
