import { SwapOutlined } from "@ant-design/icons";
import { Button, Divider, Popover } from "antd";
import React, { useState } from "react";
import TranslateWordAI from "../popover-component/TranslateWordAI";

export const markTextPopper = (
  aSoftwareSpecificTerm: string,
  meaningVi: string,
  meaningEn: string,
  translatedVi: string,
  openAi: any,
  vocabularyApi: any,
  context?: string,
  markedContext?: string
) => {
  return (
    <Popover
      content={
        <PopupContent
          aSoftwareSpecificTerm={aSoftwareSpecificTerm}
          meaningVi={meaningVi}
          meaningEn={meaningEn}
          translatedVi={translatedVi}
          context={context}
          markedContext={markedContext}
          openAi={openAi}
          vocabularyApi={vocabularyApi}
        />
      }
      title={aSoftwareSpecificTerm}
      trigger="contextMenu"
      getPopupContainer={() => document.body}
    >
      <span
        style={{ cursor: "pointer" }}
        className="italic text-blue-600 p-[1px] bg-blue-50 rounded"
      >
        {aSoftwareSpecificTerm}
      </span>
    </Popover>
  );
};

interface IProps {
  aSoftwareSpecificTerm: string;
  meaningVi: string;
  meaningEn: string;
  translatedVi: string;
  openAi: any;
  vocabularyApi: any;
  context?: string;
  markedContext?: string;
}
const PopupContent = (props: IProps) => {
  const {
    aSoftwareSpecificTerm,
    meaningVi,
    meaningEn,
    translatedVi,
    context,
    markedContext,
    openAi,
    vocabularyApi,
  } = props;
  const [isTranslate, setIsTranslate] = useState(false);

  return (
    <>
      {isTranslate ? (
        <TranslateWordAI
          selectedText={aSoftwareSpecificTerm}
          context={context}
          contextMarked={markedContext}
          openaiAiContextValue={openAi}
          vocabularyApiContextValue={vocabularyApi}
        />
      ) : (
        <div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-200 rounded-md shadow-md max-w-[15rem] p-4">
              <span className="text-blue-600">{meaningEn}</span>
            </div>
            <div className="bg-green-200 rounded-md shadow-md max-w-[15rem] p-4">
              <span className="text-green-600">{meaningVi}</span>
            </div>
          </div>
          <Divider className="my-2" />
          <div className="text-center">
            <span className="font-medium">{translatedVi}</span>
          </div>
        </div>
      )}
      <div className="mt-2 flex justify-end text-center">
        <Button
          onClick={() => setIsTranslate((val) => !val)}
          icon={<SwapOutlined />}
          shape="circle"
        />
      </div>
    </>
  );
};
