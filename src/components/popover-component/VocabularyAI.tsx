import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Input, message, Popover } from "antd";
import React, { useEffect, useRef, useState } from "react";
import useVocabularyApi from "../../hook/api/useVocabularyApi";
import { IVocabulary } from "../../types/types";

const Row = ({
  label,
  value,
  field,
  updateVoca,
  nodeValue,
}: {
  label: string;
  value: string;
  field: keyof IVocabulary;
  updateVoca?: Function;
  nodeValue?: React.ReactNode;
}) => {
  const [isEdit, setIsEdit] = React.useState<boolean>(false);
  const inputRef = useRef<any>();
  const [editValue, setEditValue] = useState<string>();

  useEffect(() => {
    if (isEdit && inputRef?.current) {
      inputRef.current.focus();
    }
  }, [isEdit]);

  return (
    <div>
      {isEdit ? (
        <>
          <span className="font-bold">{label}: </span>
          <Input
            ref={inputRef}
            value={editValue}
            onChange={(e) => {
              setEditValue(e.target.value);
            }}
            onBlur={() => {
              setIsEdit(false);
              if (updateVoca) {
                updateVoca(field, editValue);
                setEditValue(undefined);
              }
            }}
            onKeyDown={(e) => {
              if (e.key.toLowerCase() === "enter") {
                setIsEdit(false);
                if (updateVoca) {
                  updateVoca(field, editValue);
                  setEditValue(undefined);
                }
              }
            }}
          />
        </>
      ) : (
        <div
          onDoubleClick={() => {
            setEditValue(value);
            setIsEdit(true);
          }}
        >
          {nodeValue ?? (
            <>
              <span className="font-bold">{label}: </span>
              <span>{value ?? "____________"}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default function VocabularyAI({
  voca,
  showAddBtn = false,
  showDeleteBtn = false,
  showUpdateBtn = false,
  reloadListFn,
  updateVoca,
}: {
  voca: IVocabulary;
  showAddBtn?: boolean;
  showDeleteBtn?: boolean;
  showUpdateBtn?: boolean;
  reloadListFn?: Function;
  updateVoca?: Function;
}) {
  const [disableAddBtn, setDisableAddBtn] = React.useState<boolean>(false);
  const [loadingAddBtn, setLoadingAddBtn] = React.useState<boolean>(false);
  const [loadingUpdateBtn, setLoadingUpdateBtn] =
    React.useState<boolean>(false);
  const [loadingDeleteBtn, setLoadingDeleteBtn] =
    React.useState<boolean>(false);
  const [showSentences, setShowSentences] = useState<boolean>(false);
  const { create, deleteItem, update } = useVocabularyApi();

  const validateVoca = () => {
    for (const key of Object.keys(voca)) {
      if (["createdAt", "updatedAt", "cycle"].includes(key)) {
        if (!voca[key as keyof IVocabulary]) {
          message.error(`[${key}] is required`);
          return true;
        }
      }
    }
    return false;
  };

  const handleAdd = async () => {
    if (validateVoca()) return;
    setLoadingAddBtn(true);
    voca.originalVocabularyBackup = voca.originalVocabulary;
    voca.audioUrl = "";
    create(voca)
      .then(() => {
        message.success("Add vocabulary success");
        setDisableAddBtn(true);
        reloadListFn && reloadListFn();
      })
      .catch((err: any) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoadingAddBtn(false);
      });
  };

  const handleDelete = async () => {
    if (!voca._id) return;
    setLoadingDeleteBtn(true);
    deleteItem(voca._id)
      .then(() => {
        message.success("Delete vocabulary success");
        reloadListFn && reloadListFn();
      })
      .catch((err: any) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoadingDeleteBtn(false);
      });
  };

  const handleUpdate = async () => {
    if (!voca._id) return;
    if (validateVoca()) return;
    setLoadingUpdateBtn(true);
    update(voca._id, voca)
      .then(() => {
        message.success("Update vocabulary success");
        reloadListFn && reloadListFn();
      })
      .catch((err: any) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoadingUpdateBtn(false);
      });
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-200 rounded-md shadow-md max-w-[15rem] p-4">
          <Row
            label="Definition (EN)"
            value={voca.definitionEn}
            field="definitionEn"
            updateVoca={updateVoca}
            nodeValue={
              <span className="text-blue-600">{voca.definitionEn}</span>
            }
          />
        </div>
        <div className="bg-green-200 rounded-md shadow-md max-w-[15rem] p-4">
          <Row
            label="Definition (VI)"
            value={voca.definitionVi}
            field="definitionVi"
            updateVoca={updateVoca}
            nodeValue={
              <span className="text-green-600">{voca.definitionVi}</span>
            }
          />
        </div>
      </div>
      <Divider className="my-2" />
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <Row
            label="VI"
            value={voca.translatedVi}
            field="translatedVi"
            updateVoca={updateVoca}
            nodeValue={
              <span
                className="font-medium text-lg cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowSentences(!showSentences);
                }}
              >
                {voca.translatedVi}
              </span>
            }
          />
        </div>
        <div className="flex justify-center items-center gap-4">
          {showAddBtn && (
            <Button
              type="primary"
              className="!bg-green-500"
              loading={loadingAddBtn}
              onClick={handleAdd}
              disabled={disableAddBtn}
              shape="circle"
              icon={<PlusOutlined />}
              size="small"
            />
          )}
          {showDeleteBtn && voca._id && (
            <Button
              danger
              type="primary"
              className="!bg-red-500"
              loading={loadingDeleteBtn}
              onClick={() => handleDelete()}
              shape="circle"
              icon={<DeleteOutlined />}
              size="small"
            />
          )}
          {showUpdateBtn && voca._id && (
            <Button
              danger
              type="primary"
              className="!bg-blue-500"
              loading={loadingUpdateBtn}
              onClick={() => handleUpdate()}
              shape="circle"
              size="small"
              icon={<EditOutlined />}
            />
          )}
        </div>
      </div>
      <Divider className="my-2" />
      {showSentences && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-200 rounded-md shadow-md max-w-[15rem] p-4">
            <Row
              label="Example sentences"
              value={voca.exampleSentences}
              field="exampleSentences"
              updateVoca={updateVoca}
              nodeValue={
                <span className="text-blue-600">{voca.exampleSentences}</span>
              }
            />
          </div>
          <div className="bg-green-200 rounded-md shadow-md max-w-[15rem] p-4">
            <Row
              label="Example sentences (VI)"
              value={voca.exampleSentencesVi}
              field="exampleSentencesVi"
              updateVoca={updateVoca}
              nodeValue={
                <span className="text-green-600">
                  {voca.exampleSentencesVi}
                </span>
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
