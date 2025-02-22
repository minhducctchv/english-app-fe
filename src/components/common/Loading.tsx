import React from "react";
import { Spin } from "antd";

const Loading: React.FC = () => {
  return (
    <div
      className={`flex items-center justify-center w-full min-w-[150px] min-h-[150px] h-full`}
    >
      <Spin />
    </div>
  );
};

export default Loading;
