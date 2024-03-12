import { options } from "@components/analytics/chartConfiguration";

export const staffChartConfig = (
  targets: number[],
  sales: number[],
  months: string[],
) => {
  const data = {
    labels: months,
    datasets: [
      {
        label: "Target",
        data: targets,
        backgroundColor: "#5113A1",
        borderColor: "#fff",
        maxBarThickness: 40,
        minBarThickness: 30,
      },
      {
        label: "Sales",
        data: sales,
        backgroundColor: "#AE8CD0",
        borderColor: "#fff",
        maxBarThickness: 40,
        minBarThickness: 30,
      },
    ],
  };

  return { data, options };
};
