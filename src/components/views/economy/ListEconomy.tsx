import { DeleteOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, message, Table } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import React, { useRef, useState } from "react";
import useEconomyApi, { IEconomyFilter } from "../../../hook/api/useEconomyApi";
import ConfirmBtn from "../../common/ConfirmBtn";
import ItemDetail from "./EconomyDetail";
import { IEconomy } from "../../../types/economy";
import dayjs from "dayjs";

export default function ListEconomy() {
  const { deleteItem, search } = useEconomyApi();
  const [loadingDeleteId, setLoadingDeleteId] = useState<string>();
  const [filter, setFilter] = React.useState<IEconomyFilter>({
    page: 1,
    size: 10,
  });

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["economies", filter],
    queryFn: () => search(filter),
  });
  const detailRef = useRef<any>(null);

  const showDetail = (item: IEconomy) => {
    if (detailRef?.current) {
      detailRef.current.showModal(item);
    }
  };

  const createEconomy = () => {
    if (detailRef?.current) {
      detailRef.current.showModal();
    }
  };

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setFilter((val) => ({
      ...val,
      page: newPagination.current,
      size: newPagination.pageSize,
    }));
  };

  const deleteOneItem = (id: string) => {
    setLoadingDeleteId(id);
    deleteItem(id)
      .then(() => {
        message.success("Delete successfully");
        refetch();
      })
      .catch((err: any) => {
        message.error(err?.message);
      })
      .finally(() => {
        setLoadingDeleteId(undefined);
      });
  };

  const openAuxVndPrice = () => {
    const url = "https://bieudogiavang.net"; // Đặt link bạn muốn mở tại đây
    window.open(url, "_blank"); // '_blank' để mở ra tab hoặc cửa sổ mới
  };

  const openAuxUsdPrice = () => {
    const url = "https://vn.tradingview.com/symbols/XAUUSD/?timeframe=1d"; // Đặt link bạn muốn mở tại đây
    window.open(url, "_blank"); // '_blank' để mở ra tab hoặc cửa sổ mới
  };

  const openUsdVndPrice = () => {
    const url =
      "https://www.vietcombank.com.vn/vi-VN/KHCN/Cong-cu-Tien-ich/Ty-gia"; // Đặt link bạn muốn mở tại đây
    window.open(url, "_blank"); // '_blank' để mở ra tab hoặc cửa sổ mới
  };

  const columns: ColumnsType<IEconomy> = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => (date ? formatDate(date as any) : "-"),
    },
    {
      title: "AUXUSD",
      dataIndex: "auxusd",
      key: "auxusd",
      render: (val) => formatCurrency(val, "USD", 2),
    },
    {
      title: "AUXVND",
      dataIndex: "auxvnd",
      key: "auxvnd",
      render: (val) => formatCurrency(val, "VND", 0),
    },
    {
      title: "USDVND",
      dataIndex: "usdvnd",
      key: "usdvnd",
      render: (val) => formatCurrency(val, "VND", 0),
    },
    {
      title: "Action",
      dataIndex: "action",
      fixed: "right",
      key: "action",
      render: (_val, record) => {
        return (
          <div className="flex justify-center items-center gap-2">
            <Button
              shape="circle"
              icon={<EyeOutlined />}
              onClick={() => showDetail(record)}
            />
            <ConfirmBtn
              danger
              loading={record._id === loadingDeleteId}
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => deleteOneItem(record._id)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between my-4">
        <div className="flex gap-4 items-center">
          <Button onClick={openAuxUsdPrice}>Giá vàng thế giới</Button>
          <Button onClick={openAuxVndPrice}>Giá vàng Việt Nam</Button>
          <Button onClick={openUsdVndPrice}>Tỷ giá USD</Button>
        </div>
        <Button icon={<PlusOutlined />} onClick={createEconomy} type="primary">
          Create
        </Button>
      </div>
      <Table
        loading={isLoading || isFetching}
        columns={columns}
        dataSource={data?.data}
        rowKey={(record) => record._id}
        pagination={{
          current: data?.pagination.current,
          pageSize: data?.pagination.size,
          total: data?.pagination.total,
          size: "small",
          showTotal: (total) => `Total ${total} items`,
        }}
        onChange={handleTableChange}
      />
      <ItemDetail reloadListFn={refetch} ref={detailRef} />
    </>
  );
}

function formatCurrency(
  value: number | string,
  suffix?: string,
  decimalPlaces: number = 2
): string {
  if (value === null || value === undefined || value === "") return "";

  const num = typeof value === "number" ? value : parseFloat(value);
  if (isNaN(num)) return "";

  const parts = num.toFixed(decimalPlaces).split(".");
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const decimalPart = parts[1];

  const formatted = decimalPart ? `${intPart}.${decimalPart}` : intPart;
  return suffix ? `${formatted} ${suffix}` : formatted;
}

function formatDate(isoString: string): string {
  if (!isoString) return "";
  return dayjs(isoString).format("DD-MM-YYYY");
}
