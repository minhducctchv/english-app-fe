import { Button, DatePicker, Form, message, Modal } from "antd";
import dayjs from "dayjs";
import { forwardRef, useImperativeHandle, useState } from "react";
import "react-quill/dist/quill.snow.css";
import styled from "styled-components";
import { useAppContext } from "../../../context/AppProvider";
import useEconomyApi from "../../../hook/api/useEconomyApi";
import { IEconomy } from "../../../types/economy";
import CurrencyInput from "./CurrencyInput";

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

const INIT_COURSE: IEconomy = {};

const ItemDetail = forwardRef((props: IProps, ref) => {
  const { reloadListFn } = props;
  const { update, create } = useEconomyApi();
  const { modalWidth } = useAppContext();
  const [economy, setEconomy] = useState<IEconomy>();
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [form] = Form.useForm<IEconomy>();

  const onFinish = (values: IEconomy) => {
    values = { ...economy, ...values };
    values.date = dayjs(values.date).hour(12);
    console.log("take me values", values);
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

  const showModal = (item?: IEconomy) => {
    if (item) {
      item.date = dayjs(item.date as any);
    }
    setEconomy(item ?? { ...INIT_COURSE });
    form.setFieldsValue(item ?? INIT_COURSE);
  };

  useImperativeHandle(ref, () => ({
    showModal,
  }));

  const handleClose = () => {
    form.resetFields();
    setEconomy(undefined);
  };

  return (
    <Modal
      title="Detail"
      width={modalWidth}
      onClose={handleClose}
      onCancel={handleClose}
      open={!!economy}
      footer={<></>}
      maskClosable={false}
    >
      <>
        <FormWrapper>
          <Form
            form={form}
            name="economyForm"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="AUXUSD"
              name="auxusd"
              rules={[{ required: true, message: "Please input the AUXUSD!" }]}
            >
              <CurrencyInput suffix="USD" />
            </Form.Item>
            <Form.Item
              label="AUXVND"
              name="auxvnd"
              rules={[{ required: true, message: "Please input the AUXVND!" }]}
            >
              <CurrencyInput suffix="VND" />
            </Form.Item>
            <Form.Item
              label="USDVND"
              name="usdvnd"
              rules={[{ required: true, message: "Please input the USDVND!" }]}
            >
              <CurrencyInput suffix="VND" />
            </Form.Item>
            <Form.Item
              label="Date"
              name="date"
              rules={[{ required: true, message: "Please input the Date!" }]}
            >
              <DatePicker format={"DD-MM-YYYY"} className="w-full" />
            </Form.Item>

            <div className="flex gap-4 justify-center">
              <StyledButton
                type="primary"
                htmlType="submit"
                loading={loadingSubmit}
              >
                Submit
              </StyledButton>
              <Button onClick={handleClose}>Cancel</Button>
            </div>
          </Form>
        </FormWrapper>
      </>
    </Modal>
  );
});

export default ItemDetail;
