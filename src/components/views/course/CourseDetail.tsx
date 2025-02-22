import { Button, Form, Input, message, Modal } from "antd";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import useCourseApi from "../../../hook/api/useCourseApi";
import { ICourse } from "../../../types/course";
import styled from "styled-components";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useAppContext } from "../../../context/AppProvider";

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
  title: "",
  content: "",
  countStudy: 0,
  isStudy: true,
};

const ItemDetail = forwardRef((props: IProps, ref) => {
  const { reloadListFn } = props;
  const { update, create } = useCourseApi();
  const { modalWidth } = useAppContext();
  const [course, setCourse] = useState<ICourse>();
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [form] = Form.useForm<ICourse>();

  const onFinish = (values: ICourse) => {
    values = { ...course, ...values };
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

  const showModal = (parentId?: any, item?: ICourse) => {
    setCourse(item ?? { ...INIT_COURSE, parentId });
    form.setFieldsValue(item ?? INIT_COURSE);
  };

  useImperativeHandle(ref, () => ({
    showModal,
  }));

  const handleClose = () => {
    form.resetFields();
    setCourse(undefined);
  };

  return (
    <Modal
      title="Detail"
      width={modalWidth}
      onClose={handleClose}
      onCancel={handleClose}
      open={!!course}
      footer={<></>}
      maskClosable={false}
    >
      <>
        <FormWrapper>
          <Form
            form={form}
            name="courseForm"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="Title"
              name="title"
              rules={[
                { required: true, message: "Please input the course title!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Content" name="content">
              <ReactQuill theme="snow" />
            </Form.Item>

            <div className="flex gap-4">
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

export default ItemDetail;
