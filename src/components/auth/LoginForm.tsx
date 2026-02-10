import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import React, { useState } from "react";
import {
  VOC_AI_ACCESS_TOKEN,
  VOC_AI_REFRESH_TOKEN,
  VOC_AI_USER_INFO,
} from "../../config/axios";
import { useAppContext } from "../../context/AppProvider";
import { StorageHelper } from "../../helper/storage.helper";
import useAuthService from "../../hook/api/useAuthService";

interface IForm {
  username: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [form] = Form.useForm<IForm>();
  const { setUserInfo } = useAppContext();
  const authService = useAuthService();
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const handleFinish = async (values: IForm) => {
    setLoadingSubmit(true);
    try {
      const res = await authService.login({
        username: values.username,
        password: values.password,
      });
      setUserInfo(res?.user);
      StorageHelper.set(VOC_AI_USER_INFO, JSON.stringify(res?.user));
      StorageHelper.set(VOC_AI_ACCESS_TOKEN, res?.accessToken);
      StorageHelper.set(VOC_AI_REFRESH_TOKEN, res?.refreshToken);
      message.success("Login success");
    } catch (error: any) {
      StorageHelper.remove(VOC_AI_USER_INFO);
      StorageHelper.remove(VOC_AI_ACCESS_TOKEN);
      StorageHelper.remove(VOC_AI_REFRESH_TOKEN);
      message.error(error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleFailed = () => {
    message.error("Please check input values");
  };

  return (
    <Form
      form={form}
      name="login"
      onFinish={handleFinish}
      onFinishFailed={handleFailed}
      layout="vertical"
    >
      <Form.Item
        name="username"
        label="Username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Username" autoFocus />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loadingSubmit}>
          Log in
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
