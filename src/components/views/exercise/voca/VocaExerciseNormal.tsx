import { Tag } from "antd";
import { IVocabulary, partOfSpeechColors } from "../../../../types/types";
import { DontShowText } from "./VocaExerciseEasy";
import FillInTheBlanks from "./FillInTheBlanks";

interface IProps {
  vocabulary: IVocabulary;
}
export default function VocaExerciceNormal({ vocabulary }: IProps) {
  const { voca, partsOfSpeech } = vocabulary;
  return (
    <div className="m-4">
      <div className="space-y-3 mb-8">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Difficulty:</span>
          {vocabulary.partsOfSpeech ? (
            <Tag
              bordered
              className={`${
                partOfSpeechColors[vocabulary.partsOfSpeech] ||
                partOfSpeechColors.noun
              } transition-colors`}
            >
              {vocabulary.partsOfSpeech}
            </Tag>
          ) : null}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-muted-foreground">Word</div>
            <DontShowText partsOfSpeech={partsOfSpeech}>
              <span className="text-base font-medium">{vocabulary.voca}</span>
            </DontShowText>
          </div>

          <div>
            <div className="text-xs text-muted-foreground">Meaning</div>
            <DontShowText partsOfSpeech={partsOfSpeech}>
              <span className="text-base">{vocabulary.mean}</span>
            </DontShowText>
          </div>
        </div>

        {vocabulary.pronunciation && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {vocabulary.pronunciation && (
              <div>
                <div className="text-xs text-muted-foreground">
                  Pronunciation
                </div>
                <div className="text-sm">{vocabulary.pronunciation}</div>
              </div>
            )}
          </div>
        )}
      </div>
      <FillInTheBlanks context={vocabulary.text || ""} text={voca} />
    </div>
  );
}
