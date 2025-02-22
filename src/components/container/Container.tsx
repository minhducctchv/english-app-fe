import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider } from "antd";
import React from "react";
import AppProvider, { useAppContext } from "../../context/AppProvider";
import ReactQueryProvider from "../../context/ReactQueryProvider";
import LoginForm from "../auth/LoginForm";
import AppDrawer from "../drawer/AppDrawer";

export default function Container() {
  return (
    <StyleProvider layer>
      <ConfigProvider>
        <ReactQueryProvider>
          <AppProvider>
            <InterContainer>
              <AppDrawer />
            </InterContainer>
          </AppProvider>
        </ReactQueryProvider>
      </ConfigProvider>
    </StyleProvider>
  );
}

function InterContainer({ children }: { children: React.ReactNode }) {
  const appContext = useAppContext();

  if (!appContext.userInfo) {
    return <LoginForm />;
  }

  return <>{children}</>;
}
