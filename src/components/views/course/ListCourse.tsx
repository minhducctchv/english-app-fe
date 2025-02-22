import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EyeOutlined,
  HomeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, Button, Input, message, Switch, Table } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import useCourseApi, { ICourseFilter } from "../../../hook/api/useCourseApi";
import { ICourse } from "../../../types/course";
import ConfirmBtn from "../../common/ConfirmBtn";
import ItemDetail from "./CourseDetail";

export default function ListCourse() {
  const { deleteItem, search, update } = useCourseApi();
  const [loadingDeleteId, setLoadingDeleteId] = useState<string>();
  const [stackParents, setStackParents] = useState<ICourse[]>([]);
  const [filter, setFilter] = React.useState<ICourseFilter>({
    page: 1,
    size: 10,
    parentId: "root",
    title: "",
  });

  useEffect(() => {
    setFilter((val) => ({
      ...val,
      parentId: stackParents.length
        ? stackParents[stackParents.length - 1]?._id
        : "root",
    }));
  }, [stackParents.length]);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["courses", filter],
    queryFn: () => search(filter),
  });
  const detailRef = useRef<any>(null);

  const showDetail = (item: ICourse) => {
    if (detailRef?.current) {
      detailRef.current.showModal(undefined, item);
    }
  };

  const createCourse = (parentId?: string) => {
    if (detailRef?.current) {
      detailRef.current.showModal(parentId ?? undefined);
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

  // Create a debounced function
  const debouncedOnChange = useCallback(
    debounce((value) => {
      setFilter((val) => ({ ...val, title: value }));
    }, 1000), // 1000ms = 1 second
    []
  );

  const handleClickBreadcrumb = (id: any) => {
    setStackParents((prevStackParents) => {
      // Tìm chỉ mục (index) của item theo id
      const index = prevStackParents.findIndex((item) => item._id === id);

      // Nếu không tìm thấy item, trả về mảng cũ
      if (index === -1) return prevStackParents;

      // Trả về mảng mới chỉ bao gồm các item từ đầu đến item có id
      return prevStackParents.slice(0, index + 1);
    });
  };

  const onChangeIsStudy = async (isStudy: boolean, item: ICourse) => {
    item.isStudy = isStudy;
    await update(item._id, item);
    refetch();
  };

  const columns: ColumnsType<ICourse> = [
    {
      title: "Is Study",
      dataIndex: "isStudy",
      key: "isStudy",
      fixed: "left",
      align: "center",
      render: (val, record) => (
        <Switch
          checked={val}
          onChange={(isStudy: boolean) => onChangeIsStudy(isStudy, record)}
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => {
            setStackParents((val) => [...val, record]);
          }}
        >
          {text}
        </Button>
      ),
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
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
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
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => createCourse(record._id)}
            />
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
      <Breadcrumb>
        <Breadcrumb.Item
          onClick={() => setStackParents([])}
          className="cursor-pointer"
        >
          <HomeOutlined className="mr-4" />
          Root
        </Breadcrumb.Item>
        {stackParents.map((parent) => (
          <Breadcrumb.Item
            key={parent._id}
            onClick={() => handleClickBreadcrumb(parent._id)}
          >
            {parent.title}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
      <div className="flex items-center justify-between my-4">
        <div className="w-max">
          {stackParents.length > 0 ? (
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => setStackParents((val) => val.slice(0, -1))}
            >
              Back
            </Button>
          ) : (
            " "
          )}
        </div>
        <Input
          placeholder="Search by title"
          onChange={(e) => debouncedOnChange(e.target.value)}
          allowClear
          showCount
          maxLength={255}
          className="w-1/2"
        />
        <Button
          icon={<PlusOutlined />}
          onClick={() =>
            createCourse(
              stackParents.length
                ? stackParents[stackParents.length - 1]._id
                : undefined
            )
          }
          type="primary"
        >
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
