import { useEffect, useRef, useState } from "react";
import VocaExercise from "./voca/VocaExercise";
import MeaningExercise from "./meaning/MeaningExercise";
import { IVocabulary } from "../../../types/types";
import TextToSpeech from "./tts/TextToSpeech";

interface IProps {
  vocabulary: IVocabulary;
}

export default function Exercise({ vocabulary }: IProps) {
  const [step, setStep] = useState<"voca" | "meaning">("voca");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key === "Enter") {
        event.preventDefault();
        setStep("voca");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const getExrcise = () => {
    if (!vocabulary) return <></>;
    if (step === "voca") return <VocaExercise vocabulary={vocabulary} />;
    if (step === "meaning") return <MeaningExercise vocabulary={vocabulary} />;
    return <></>;
  };

  return (
    <div className="md:max-w-1/2 flex flex-col gap-4 p-4 mx-auto border-2 border-gray-200 rounded-lg m-4">
      <div className="flex justify-end">
        <TextToSpeech text={vocabulary.exampleSentences} />
      </div>
      <div>{getExrcise()}</div>
      {step !== "meaning" && <NextButton setStep={setStep} />}
    </div>
  );
}

const NextButton = ({
  setStep,
}: {
  setStep: (step: "voca" | "meaning") => void;
}) => {
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  // Hotkey handler for Enter key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (nextButtonRef.current) {
          nextButtonRef.current.click();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <button
      ref={nextButtonRef}
      onClick={() => setStep("meaning")}
      className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
    >
      Next (Enter)
    </button>
  );
};
