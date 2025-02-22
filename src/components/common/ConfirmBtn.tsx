import type { ButtonProps, PopconfirmProps } from "antd";
import { Button, Popconfirm } from "antd";
import React from "react";

const cancel: PopconfirmProps["onCancel"] = (e) => {
  // nothing
};

interface IProps extends ButtonProps {}

const ConfirmBtn: React.FC<IProps> = (props) => {
  const { onClick, children } = props;
  return (
    <Popconfirm
      title="Confirm"
      description="Are you sure?"
      onConfirm={(e: any) => {
        onClick && onClick(e);
      }}
      onCancel={cancel}
      okText="Yes"
      cancelText="No"
    >
      <Button {...{ ...props, onClick: undefined }}>{children}</Button>
    </Popconfirm>
  );
};

export default ConfirmBtn;
