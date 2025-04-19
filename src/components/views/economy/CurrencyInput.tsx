import type { InputNumberProps } from "antd";
import { InputNumber } from "antd";
import React from "react";

interface CurrencyInputProps extends InputNumberProps {
  suffix?: string;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({ suffix, ...props }) => {
  return (
    <InputNumber
      {...props}
      formatter={(value) => {
        if (value === undefined || value === null || value === "") return "";
        const [intPart, decimalPart] = String(value).split(".");
        const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return decimalPart
          ? `${formattedInt}.${decimalPart}`
          : `${formattedInt}`;
      }}
      parser={(value) => {
        if (!value) return "";
        return value.replace(/\s?[^\d.]/g, "").replace(/,/g, "");
      }}
      stringMode
      className="w-full"
      suffix={suffix}
    />
  );
};

export default CurrencyInput;
