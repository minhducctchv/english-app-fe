import React, { useEffect, useRef, useState } from "react";
import { IVocabulary } from "../../types/types";
import { ObjectHelper } from "../../helper/object.helper";
import { Button, Collapse, Input, message } from "antd";
import useVocabularyApi from "../../hook/api/useVocabularyApi";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import BtnAudio from "./Audio";

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

export default function Vocabulary({
  voca,
  showAddBtn = false,
  showDeleteBtn = false,
  showUpdateBtn = false,
  reloadListFn,
  updateVoca,
  childClassName,
  defaultShowSentenceExample = true,
  showTime = true,
}: {
  voca: IVocabulary;
  showAddBtn?: boolean;
  showDeleteBtn?: boolean;
  showUpdateBtn?: boolean;
  reloadListFn?: Function;
  updateVoca?: Function;
  childClassName?: string;
  defaultShowSentenceExample?: boolean;
  showTime?: boolean;
}) {
  const [disableAddBtn, setDisableAddBtn] = React.useState<boolean>(false);
  const [loadingAddBtn, setLoadingAddBtn] = React.useState<boolean>(false);
  const [loadingUpdateBtn, setLoadingUpdateBtn] =
    React.useState<boolean>(false);
  const [loadingDeleteBtn, setLoadingDeleteBtn] =
    React.useState<boolean>(false);
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
    <div
      className={`p-4 rounded shadow-md flex flex-col gap-4 overflow-y-auto ${childClassName}`}
    >
      <Row
        label="Original Vocabulary"
        value={voca.originalVocabulary}
        field="originalVocabulary"
        updateVoca={updateVoca}
        nodeValue={
          <div className="text-center font-medium text-xl">
            {voca.originalVocabulary}
            <span className="italic !text-sm ml-3">({voca.partsOfSpeech})</span>
          </div>
        }
      />
      <Row
        label="Definition (EN)"
        value={voca.definitionEn}
        field="definitionEn"
        updateVoca={updateVoca}
        nodeValue={
          <div className="p-4 rounded-md border border-dashed border-1 border-blue-700">
            {voca.definitionEn}
          </div>
        }
      />
      <Row
        label="Definition (VI)"
        value={voca.definitionVi}
        field="definitionVi"
        updateVoca={updateVoca}
        nodeValue={
          <div className="p-4 rounded-md border border-dashed border-1 border-gray-500">
            {voca.definitionVi}
          </div>
        }
      />
      <Row
        label="VI"
        value={voca.translatedVi}
        field="translatedVi"
        updateVoca={updateVoca}
        nodeValue={
          <div className="flex items-center justify-center gap-4 font-medium text-lg text-blue-600">
            <div>{voca.translatedVi}</div>
            <div>
              <BtnAudio
                voca={voca.originalVocabularyBackup}
                audioUrl={voca.audioUrl}
              />
            </div>
          </div>
        }
      />
      <Collapse defaultActiveKey={defaultShowSentenceExample ? ["1"] : []}>
        <Collapse.Panel key="1" header="Sentence example">
          <Row
            label="Example sentences"
            value={voca.exampleSentences}
            field="exampleSentences"
            updateVoca={updateVoca}
          />
          <Row
            label="Example sentences (VI)"
            value={voca.exampleSentencesVi}
            field="exampleSentencesVi"
            updateVoca={updateVoca}
          />
        </Collapse.Panel>
      </Collapse>
      {showTime && (
        <>
          {voca.updatedAt && (
            <Row
              label="Updated at"
              value={ObjectHelper.formatDate(voca.updatedAt)}
              field="updatedAt"
            />
          )}
          {voca.createdAt && (
            <Row
              label="Created at"
              value={ObjectHelper.formatDate(voca.createdAt)}
              field="createdAt"
            />
          )}
        </>
      )}
      <Row
        label="Audio URL"
        value={voca.audioUrl ?? ""}
        field="audioUrl"
        updateVoca={updateVoca}
        nodeValue={
          <div className="text-center font-medium text-sm">{"(Audio url)"}</div>
        }
      />
      <div className="flex justify-center items-center gap-4">
        {showAddBtn && (
          <Button
            type="primary"
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
            loading={loadingDeleteBtn}
            onClick={() => handleUpdate()}
            shape="circle"
            size="small"
            icon={<EditOutlined />}
          />
        )}
      </div>
    </div>
  );
}
