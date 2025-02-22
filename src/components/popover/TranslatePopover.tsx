import { Popover } from "antd";
import React from "react";
import TranslateWordAI from "../popover-component/TranslateWordAI";

const TranslatePopover = ({
  text,
  context,
  contextMarked,
  openAiContextValue,
  vocabularyApiContextValue,
}: {
  text: string;
  context?: string;
  contextMarked?: string;
  openAiContextValue: any;
  vocabularyApiContextValue: any;
}) => {
  return (
    <Popover
      content={
        <TranslateWordAI
          selectedText={text}
          context={context}
          contextMarked={contextMarked}
          openaiAiContextValue={openAiContextValue}
          vocabularyApiContextValue={vocabularyApiContextValue}
        />
      }
      title={null}
      trigger="contextMenu"
      defaultOpen
      getPopupContainer={() => document.body}
    >
      <span
        style={{ borderBottom: "1px dashed #00ce1b", cursor: "pointer" }}
        className="font-semibold italic text-green-600"
      >
        {text}
      </span>
    </Popover>
  );
};

export default TranslatePopover;
