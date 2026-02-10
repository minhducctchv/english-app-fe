import { Button, Tag } from "antd";
import { useEffect, useRef, useState } from "react";
import TypingText from "./TypingText";
import { IVocabulary, partOfSpeechColors } from "../../../../types/types";

interface IProps {
  vocabulary: IVocabulary;
}

export default function MeaningExerciseEasy(props: IProps) {
  const { vocabulary } = props;
  const [showAnswer, setShowAnswer] = useState<number>(0);

  const showAnswerButtonRef = useRef<HTMLButtonElement>(null);
  // Hotkey handler for Enter key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (showAnswerButtonRef.current) {
          showAnswerButtonRef.current.click();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="w-full mx-auto">
      <div className="space-y-4">
        {/* Vocabulary Word */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Vocabulary Word:
          </h3>
          <Tag
            className={`${
              partOfSpeechColors[vocabulary.partsOfSpeech]
            } text-base font-semibold px-3 py-1`}
          >
            {vocabulary.vocabulary}
          </Tag>
        </div>

        {/* Original Context */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Original Context:
          </h3>
          <p className="text-sm bg-muted p-3 rounded-md italic">
            {vocabulary.exampleSentences}
          </p>
        </div>

        {/* Answer Section */}
        <div className="space-y-2 mt-8">
          <div className="flex items-center justify-center">
            <Button
              ref={showAnswerButtonRef}
              size="small"
              onClick={() =>
                setShowAnswer((val) => {
                  if (val == 2) return 0;
                  return val + 1;
                })
              }
              className="h-8"
            >
              {showAnswer > 0 ? (
                <>Hide Answer (Enter)</>
              ) : (
                <>Show Answer (Enter)</>
              )}
            </Button>
          </div>

          {showAnswer > 0 && vocabulary.definitionVi && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
              {showAnswer >= 1 && (
                <>
                  <p className="text-base leading-relaxed">
                    {vocabulary.exampleSentencesVi}
                  </p>
                </>
              )}
              {showAnswer >= 2 && (
                <>
                  <hr className="my-2" />
                  <p className="text-base leading-relaxed font-medium w-full text-center uppercase">
                    {vocabulary.definitionVi}
                  </p>
                </>
              )}
            </div>
          )}
          <div className="w-full flex items-center justify-center mt-4">
            <TypingText text={vocabulary.vocabulary} />
          </div>
        </div>
      </div>
    </div>
  );
}
