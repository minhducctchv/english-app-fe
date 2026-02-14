import { Button, Form, Input, message, Modal, Select } from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";
import styled from "styled-components";
import { useAppContext } from "../../context/AppProvider";
import useVocabularyApi from "../../hook/api/useVocabularyApi";
import { IVocabulary } from "../../types/types";

const FormWrapper = styled.div`
  @apply p-4 bg-white shadow-md rounded-lg;
  margin: 0 auto;
`;

const StyledButton = styled(Button)`
  @apply bg-blue-500 text-white mt-4;
`;

interface IProps {
  reloadListFn: () => void;
}

const INIT_COURSE = {
  voca: "",
  mean: "",
  partsOfSpeech: "", // giá trị mặc định, có thể thay đổi tùy context
  pronunciation: "",
  text: "",
  textMean: "",
  audioUrl: undefined,
};

const partsOfSpeechOptions = [
  "verb",
  "noun",
  "adverb",
  "adjective",
  "pronoun",
  "conjunction",
  "preposition",
  "article",
  "interjection",
  "determiner",
  "other",
];

const { Option } = Select;

const CreateVocabulary = forwardRef((props: IProps, ref) => {
  const { reloadListFn } = props;
  const { update, create } = useVocabularyApi();
  const { modalWidth } = useAppContext();
  const [vocabulary, setVocabulary] = useState<IVocabulary>();
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [form] = Form.useForm<IVocabulary>();

  const onFinish = (values: IVocabulary) => {
    values = {
      ...vocabulary,
      ...values,
    };
    setLoadingSubmit(true);

    if (!values._id) {
      create(values)
        .then(() => {
          message.success("Create successfully");
          reloadListFn();
          handleClose();
        })
        .catch((err: any) => {
          message.error(err?.message);
        })
        .finally(() => {
          setLoadingSubmit(false);
        });
    } else {
      update(values._id, values)
        .then(() => {
          message.success("Update successfully");
          reloadListFn();
          handleClose();
        })
        .catch((err: any) => {
          message.error(err?.message);
        })
        .finally(() => {
          setLoadingSubmit(false);
        });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error(errorInfo);
  };

  const showModal = (item?: IVocabulary) => {
    const value = item ?? (INIT_COURSE as IVocabulary);
    setVocabulary(value);
    form.setFieldsValue(value);
  };

  useImperativeHandle(ref, () => ({
    showModal,
  }));

  const handleClose = () => {
    form.resetFields();
    setVocabulary(undefined);
  };

  return (
    <Modal
      title="Detail"
      width={modalWidth}
      onClose={handleClose}
      onCancel={handleClose}
      open={!!vocabulary}
      footer={<></>}
      maskClosable={false}
    >
      <>
        <FormWrapper>
          <Form
            form={form}
            name="vocabularyForm"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <div className="grid md:grid-cols-4 grid-cols-1 gap-4">
              <Form.Item
                label="Vocabulary"
                name="voca"
                rules={[
                  { required: true, message: "Please input vocabulary!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Translated (Vietnamese)"
                name="mean"
                rules={[
                  {
                    required: true,
                    message: "Please input translated Vietnamese!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Part of Speech"
                name="partsOfSpeech"
                rules={[
                  {
                    required: true,
                    message: "Please select a part of speech!",
                  },
                ]}
              >
                <Select placeholder="Select part of speech">
                  {partsOfSpeechOptions.map((pos) => (
                    <Option key={pos} value={pos}>
                      {pos.charAt(0).toUpperCase() + pos.slice(1)}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Pronunciation"
                name="pronunciation"
                rules={[
                  { required: true, message: "Please input pronunciation!" },
                ]}
              >
                <Input />
              </Form.Item>
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
              <Form.Item
                label="Example Sentences"
                name="text"
                rules={[
                  {
                    required: true,
                    message: "Please input example sentences!",
                  },
                ]}
              >
                <Input.TextArea rows={3} />
              </Form.Item>

              <Form.Item
                label="Example Sentences (Vietnamese)"
                name="textMean"
                rules={[
                  {
                    required: true,
                    message: "Please input Vietnamese example sentences!",
                  },
                ]}
              >
                <Input.TextArea rows={3} />
              </Form.Item>
            </div>

            <Form.Item label="Audio URL" name="audioUrl">
              <Input />
            </Form.Item>

            <div className="flex justify-center items-center gap-4">
              <Button onClick={handleClose}>Cancel</Button>
              <StyledButton
                type="primary"
                htmlType="submit"
                loading={loadingSubmit}
              >
                Submit
              </StyledButton>
            </div>
          </Form>
        </FormWrapper>
      </>
    </Modal>
  );
});

export default CreateVocabulary;
