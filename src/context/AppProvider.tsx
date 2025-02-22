import React, { createContext, useContext, useEffect, useState } from "react";
import { VOC_AI_USER_INFO } from "../config/axios";
import { StorageHelper } from "../helper/storage.helper";
import { IUser } from "../types/types";

export type IDrawerComponent =
  | "crud"
  | "learn"
  | "enter_topic"
  | "course_crud"
  | "study_course";

export interface IContext {
  userInfo?: IUser;
  setUserInfo: (userInfo?: IUser) => void;
  modalWidth: string;
}

const AppContext = createContext<IContext>({
  setUserInfo: () => {},
  modalWidth: "50%",
});

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userInfo, setUserInfo] = React.useState<IUser>();
  const [modalWidth, setModalWidth] = useState(
    window.innerWidth < 768 ? "80%" : "60%"
  );

  const handleResize = () => {
    setModalWidth(window.innerWidth < 768 ? "80%" : "60%");
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!userInfo) {
      const userInfoString = StorageHelper.get(VOC_AI_USER_INFO);
      if (userInfoString) {
        const userInfoSaved = JSON.parse(userInfoString);
        setUserInfo(userInfoSaved);
      }
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        userInfo,
        setUserInfo,
        modalWidth,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
