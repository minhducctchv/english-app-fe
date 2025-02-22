import React from "react";
import { IText } from "../../types/types";
import Markdown from "react-markdown";

interface IProps {
  text: IText;
}
export default function Text({ text }: IProps) {
  return (
    <div className="max-h-[512px] overflow-y-auto max-w-lg">
      <div>
        <b>TEXT: </b>
        <span>{text.text}</span>
      </div>
      <div>
        <b>VI: </b>
        <span className="text-green-600">{text.translatedVi}</span>
      </div>
      <div>
        <b>GRAMMAR: </b>
        <span>
          <Markdown>{text.grammar}</Markdown>
        </span>
      </div>
    </div>
  );
}
