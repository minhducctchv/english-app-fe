import { useQuery } from "@tanstack/react-query";
import { Card, DatePicker, Space, Spin } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import React, { useMemo } from "react";
import useEconomyApi, {
  IEconomyChartFilter,
} from "../../../hook/api/useEconomyApi";
import AuxChart from "./AuxChart";
import AuxDiffChart from "./AuxDiffChart";
import UsdVndChart from "./UsdVndChart";

const { RangePicker } = DatePicker;

export default function ChartEconomy() {
  const { getChartData } = useEconomyApi();
  const [filter, setFilter] = React.useState<{
    startDate: dayjs.Dayjs;
    endDate: dayjs.Dayjs;
  }>({
    startDate: dayjs().subtract(1, "month"),
    endDate: dayjs(),
  });

  const convertedFilter: IEconomyChartFilter = useMemo(() => {
    return {
      startDate: filter.startDate.format("YYYY-MM-DD"),
      endDate: filter.endDate.format("YYYY-MM-DD"),
    };
  }, [filter]);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["economies-chart", convertedFilter],
    queryFn: () => getChartData(convertedFilter),
  });

  const handleDateChange: RangePickerProps["onChange"] = (dates) => {
    if (dates && dates[0] && dates[1]) {
      setFilter({
        startDate: dayjs(dates[0]),
        endDate: dayjs(dates[1]),
      });
    }
  };

  return (
    <Spin spinning={isLoading || isFetching}>
      <Space
        direction="vertical"
        size={12}
        style={{ marginBottom: 16 }}
        className="flex items-center justify-center"
      >
        <RangePicker
          value={[filter.startDate, filter.endDate]}
          onChange={handleDateChange}
          allowClear={false}
        />
      </Space>

      {/* You can render your chart here */}
      <div className="w-full flex items-center justify-center">
        <div className="w-full max-w-[1200px]">
          <Card className="mt-4">
            <AuxChart data={convertGoldDataList(data || [])} />
          </Card>
          <Card className="mt-4">
            <AuxDiffChart data={convertGoldDiffData(data || [])} />
          </Card>
          <Card className="mt-4 mb-8">
            <UsdVndChart data={convertUsdVndData(data || [])} />
          </Card>
        </div>
      </div>
    </Spin>
  );
}

/**
 * Chuyển đổi giá vàng từ USD/ounce sang VND/lượng.
 *
 * @param goldPriceUSD - Giá vàng theo USD/ounce
 * @param usdToVndRate - Tỷ giá USD/VND
 * @returns Giá vàng theo VND/lượng
 */
function convertGoldPriceToVND(
  goldPriceUSD: number,
  usdToVndRate: number
): number {
  const OUNCE_TO_LUONG = 0.829426048;
  const goldPriceVNDPerLuong = (goldPriceUSD * usdToVndRate) / OUNCE_TO_LUONG;
  console.log(goldPriceUSD, usdToVndRate, Math.round(goldPriceVNDPerLuong));
  return Math.round(goldPriceVNDPerLuong); // Làm tròn VND
}

type InputData = {
  auxusd: number; // giá vàng thế giới (USD/ounce)
  auxvnd: number; // giá vàng trong nước (VND/lượng)
  usdvnd: number; // tỷ giá USD/VND
  date: string; // định dạng DD-MM-YYYY
};

type OutputData = {
  auxtg: number; // giá vàng thế giới sau quy đổi (VND/lượng)
  auxvn: number; // giá vàng trong nước (VND/lượng)
  date: string;
};
function convertGoldDataList(data: InputData[]): OutputData[] {
  return data.map((item) => ({
    auxtg: convertGoldPriceToVND(item.auxusd, item.usdvnd),
    auxvn: item.auxvnd,
    date: formatDateWithWeekendCheck(item.date),
  }));
}

function convertGoldDiffData(data: InputData[]): any[] {
  return data.map((item) => ({
    value: item.auxvnd - convertGoldPriceToVND(item.auxusd, item.usdvnd),
    date: formatDateWithWeekendCheck(item.date),
  }));
}

function convertUsdVndData(data: InputData[]): any[] {
  return data.map((item) => ({
    value: item.usdvnd,
    date: formatDateWithWeekendCheck(item.date),
  }));
}

function formatDateWithWeekendCheck(dateStr: string): string {
  const date = dayjs(dateStr); // Tự động parse ISO format
  const formatted = date.format("DD-MM-YYYY");
  const day = date.day(); // 0 = Sunday, 6 = Saturday
  if (day === 0 || day === 6) {
    return `${formatted} (WK)`;
  }
  return formatted;
}
