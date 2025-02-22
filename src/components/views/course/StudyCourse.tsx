import { CheckOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { DatePicker, message, Table } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";
import React, { useRef, useState } from "react";
import useCourseApi, { ICourseFilter } from "../../../hook/api/useCourseApi";
import { ICourse } from "../../../types/course";
import ConfirmBtn from "../../common/ConfirmBtn";
import ItemDetail from "./CourseDetail";

export const handleStudyCourse = (course: ICourse): ICourse => {
  course.studiedAt = new Date();
  course.countStudy++;

  let nextStudyDate = new Date();

  switch (course.countStudy) {
    case 1:
      nextStudyDate = dayjs().add(6, "days").toDate();
      break;
    case 2:
      nextStudyDate = dayjs().add(23, "days").toDate();
      break;
    case 3:
      nextStudyDate = dayjs().add(60, "days").toDate();
      break;
    case 4:
      nextStudyDate = dayjs().add(99, "years").toDate();
      break;
  }

  course.nextStudyDate = nextStudyDate;
  return course;
};

export default function StudyCourse() {
  const { search, update } = useCourseApi();
  const [loadingXong, setLoadingXong] = useState<string>();
  const [filter, setFilter] = React.useState<ICourseFilter>({
    page: 1,
    size: 10,
    date: new Date(),
  });

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["courses-study", filter],
    queryFn: () => search(filter),
  });
  const detailRef = useRef<any>(null);

  const handleXong = async (item: ICourse) => {
    setLoadingXong(item._id);
    try {
      await update(item._id, handleStudyCourse(item));
      refetch();
    } catch (err: any) {
      message.error(err?.message);
    } finally {
      setLoadingXong(undefined);
    }
  };

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setFilter((val) => ({
      ...val,
      page: newPagination.current,
      size: newPagination.pageSize,
    }));
  };

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      // Cập nhật state filter với giá trị Date được chọn
      setFilter((prev) => ({
        ...prev,
        date: date.hour(12).minute(12).second(12).toDate(), // Chuyển đổi Dayjs sang JavaScript Date
      }));
    }
  };

  const columns: ColumnsType<ICourse> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Count Study",
      dataIndex: "countStudy",
      key: "countStudy",
    },
    {
      title: "Studied At",
      dataIndex: "studiedAt",
      key: "studiedAt",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
    },
    {
      title: "Next Study Date",
      dataIndex: "nextStudyDate",
      key: "nextStudyDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
    },
    {
      title: "Action",
      dataIndex: "action",
      fixed: "right",
      key: "action",
      render: (_val, record) => {
        return (
          <ConfirmBtn
            loading={loadingXong === record._id}
            icon={<CheckOutlined />}
            type="primary"
            onClick={() => handleXong(record)}
          >
            XONG
          </ConfirmBtn>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex justify-center mb-4">
        <DatePicker
          allowClear={false}
          value={dayjs(filter.date)} // Convert native JS Date to dayjs instance for DatePicker
          onChange={handleDateChange}
          className="w-full md:w-1/2"
        />
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
