import { Tag } from "antd";
import { useState } from "react";
import WordScramble from "./WordScramble";
import { IVocabulary, partOfSpeechColors } from "../../../../types/types";

interface IProps {
  vocabulary: IVocabulary;
}
export default function VocaExerciseEasy({ vocabulary }: IProps) {
  const { vocabulary: voca, partsOfSpeech } = vocabulary;
  return (
    <div className="m-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Difficulty:</span>
          {vocabulary.partsOfSpeech ? (
            <Tag
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
              <span className="text-base font-medium">
                {vocabulary.vocabulary}
              </span>
            </DontShowText>
          </div>

          <div>
            <div className="text-xs text-muted-foreground">Meaning</div>
            <DontShowText partsOfSpeech={partsOfSpeech}>
              <span className="text-base">{vocabulary.definitionVi}</span>
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

        {vocabulary.exampleSentences && (
          <div className="w-full flex justify-center items-center my-8">
            <div>
              <div className="text-xs text-muted-foreground">Context</div>
              <div className="text-lg leading-relaxed">
                {vocabulary.exampleSentences.includes(vocabulary.vocabulary) ? (
                  <>
                    {vocabulary.exampleSentences
                      .split(vocabulary.vocabulary)
                      .map((part, index, array) => (
                        <span key={index}>
                          {part}
                          {index < array.length - 1 && (
                            <DontShowText
                              partsOfSpeech={vocabulary.partsOfSpeech}
                            >
                              <span className="font-medium">
                                {vocabulary.vocabulary}
                              </span>
                            </DontShowText>
                          )}
                        </span>
                      ))}
                  </>
                ) : (
                  vocabulary.exampleSentences
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <WordScramble text={voca} />
    </div>
  );
}

export const DontShowText = ({
  children,
  partsOfSpeech,
}: {
  children: React.ReactNode;
  partsOfSpeech: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Tag
      onClick={() => setIsVisible(!isVisible)}
      className={`${
        partOfSpeechColors[partsOfSpeech] || partOfSpeechColors.noun
      } transition-colors cursor-pointer hover:bg-accent`}
    >
      {isVisible ? children : "hidden"}
    </Tag>
  );
};
