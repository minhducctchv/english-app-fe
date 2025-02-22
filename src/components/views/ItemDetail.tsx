import { message, Modal } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import useVocabularyApi from "../../hook/api/useVocabularyApi";
import { IVocabulary } from "../../types/types";
import Vocabulary from "../popover-component/Vocabulary";

interface IProps {
  reloadListFn: () => void;
}

const ItemDetail = forwardRef((props: IProps, ref) => {
  const { reloadListFn } = props;
  const { update } = useVocabularyApi();
  const [voca, setVoca] = useState<IVocabulary>();

  const showModal = (item: IVocabulary) => {
    setVoca(item);
  };

  useImperativeHandle(ref, () => ({
    showModal,
  }));

  const handleOk = () => {
    setVoca(undefined);
  };

  const handleCancel = () => {
    setVoca(undefined);
  };

  const updateItem = (item: IVocabulary) => {
    update(item._id, item)
      .then(() => {
        message.success("Update successfully");
        reloadListFn();
      })
      .catch((err: any) => {
        message.error(err?.message);
      });
  };

  const updateVoca = (field: keyof IVocabulary, value: string) => {
    if (voca) {
      const vocaClone = structuredClone(voca);
      const updatedVoca = {
        ...vocaClone,
        [field]: value,
      };
      console.log('field', field)
      console.log('value', value)
      console.log('updateVoca', updatedVoca)
      setVoca(updatedVoca);
      updateItem(updatedVoca);
    }
  };

  return (
    <Modal
      title="Detail"
      open={!!voca}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false}
    >
      {voca && <Vocabulary voca={voca} updateVoca={updateVoca} />}
    </Modal>
  );
});

export default ItemDetail;
