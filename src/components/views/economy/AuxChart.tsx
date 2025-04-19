import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type GoldData = {
  auxtg: number; // giá vàng thế giới (VND)
  auxvn: number; // giá vàng Việt Nam (VND)
  date: string; // DD-MM-YYYY
};

interface AuxChartProps {
  data: GoldData[];
}

const AuxChart: React.FC<AuxChartProps> = ({ data }) => {
  const labels = data.map((item) => item.date);

  const chartData: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: "Giá vàng thế giới",
        data: data.map((item) => item.auxtg),
        borderColor: "blue",
        backgroundColor: "blue",
        // tension: 0.3, // làm cong đường line
      },
      {
        label: "Giá vàng Việt Nam",
        data: data.map((item) => item.auxvn),
        borderColor: "green",
        backgroundColor: "green",
        // tension: 0.3, // làm cong đường line
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Biểu đồ giá vàng",
      },
    },
  };

  return <Line options={options} data={chartData} />;
};

export default AuxChart;
