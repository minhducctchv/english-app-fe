import { DeleteOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, Table, message } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { debounce } from "lodash";
import React, { useCallback, useRef, useState } from "react";
import useVocabularyApi, {
  ISearchFilter,
} from "../../hook/api/useVocabularyApi";
import { IVocabulary } from "../../types/types";
import ConfirmBtn from "../common/ConfirmBtn";
import BtnAudio from "../popover-component/Audio";
import ItemDetail from "./ItemDetail";
import { useQuery } from "@tanstack/react-query";
import CreateVocabulary from "./CreateVocabolary";

export default function ListCrud() {
  const { deleteItem } = useVocabularyApi();
  const { search } = useVocabularyApi();
  const [loadingDeleteId, setLoadingDeleteId] = useState<string>();
  const [filter, setFilter] = React.useState<ISearchFilter>({
    page: 1,
    size: 10,
    search: "",
  });
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["studies", filter],
    queryFn: () => search(filter),
  });
  const detailRef = useRef<any>(null);
  const createRef = useRef<any>(null);

  const showDetail = (item: IVocabulary) => {
    if (detailRef?.current) {
      detailRef.current.showModal(item);
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

  const debouncedOnChange = useCallback(
    debounce((value) => {
      setFilter((val) => ({ ...val, search: value }));
    }, 1000), // 1000ms = 1 second
    []
  );

  const columns: ColumnsType<IVocabulary> = [
    {
      title: "Vocabulary",
      dataIndex: "originalVocabulary",
      key: "originalVocabulary",
      render: (val, record) => {
        return (
          <>
            <span className="mr-2">{val}</span>
            <span className="font-thin italic text-xs">
              ({record.partsOfSpeech})
            </span>
          </>
        );
      },
    },
    {
      title: "Audio",
      dataIndex: "audio",
      key: "audio",
      render: (_val, record) => {
        return (
          <BtnAudio
            voca={record.originalVocabularyBackup}
            audioUrl={record.audioUrl}
          />
        );
      },
    },
    {
      title: "Translated (Vi)",
      dataIndex: "translatedVi",
      key: "translatedVi",
    },
    {
      title: "Pronunciation",
      dataIndex: "pronunciation",
      key: "pronunciation",
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

  const createVocabulary = () => {
    if (createRef?.current) {
      createRef.current.showModal();
    }
  };

  return (
    <>
      <div className="flex justify-between">
        <Input
          placeholder="Search by title"
          onChange={(e) => debouncedOnChange(e.target.value)}
          allowClear
          showCount
          maxLength={255}
          className="w-1/2 mb-4"
        />
        <Button
          icon={<PlusOutlined />}
          onClick={createVocabulary}
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
      <CreateVocabulary reloadListFn={refetch} ref={createRef} />
    </>
  );
}
