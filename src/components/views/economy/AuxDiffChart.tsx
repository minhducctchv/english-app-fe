import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Đăng ký các thành phần cần thiết cho chart
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale
);

type GoldPriceData = {
  value: number;
  date: string; // dạng DD-MM-YYYY
};

type AuxDiffChartProps = {
  data: GoldPriceData[];
};

const AuxDiffChart: React.FC<AuxDiffChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.date),
    datasets: [
      {
        label: "Giá vàng chênh lệch (VND)",
        data: data.map((item) => item.value),
        borderColor: "blue",
        backgroundColor: "blue",
        // tension: 0.4, // làm cong đường line
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Biểu đồ chênh lệch giá vàng VN-TG",
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default AuxDiffChart;
