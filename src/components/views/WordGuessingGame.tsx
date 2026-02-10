import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { IVocabulary } from "../../types/types";
import BtnAudio from "../popover-component/Audio";
import RIf from "../common/RIf";

interface WordGuessingGameProps {
  voca: IVocabulary;
  isSuccess: boolean;
  setIsSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  showLevel: number;
  setShowLevel: React.Dispatch<React.SetStateAction<number>>;
}

const WordContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin: 20px 0;
  min-height: 60px;
`;

const LetterBox = styled.div<{ selected: boolean }>`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #4a90e2;
  margin: 5px;
  cursor: pointer;
  background-color: ${(props) => (props.selected ? "#4a90e2" : "#fff")};
  color: ${(props) => (props.selected ? "#fff" : "#4a90e2")};
  font-size: 18px;
  font-weight: bold;
  border-radius: 10px;
  transition: all 0.3s ease;
  transform: ${(props) => (props.selected ? "scale(1.1)" : "scale(1)")};
  &:hover {
    background-color: ${(props) => (props.selected ? "#357ab8" : "#e1f0ff")};
    transform: scale(1.1);
  }
`;

// Animation for result messages
const fadeInOut = keyframes`
  0%, 100% { opacity: 0; transform: translateY(-20px); }
  50% { opacity: 1; transform: translateY(0); }
`;

const ResultMessage = styled.div<{ success: boolean }>`
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${(props) => (props.success ? "#4CAF50" : "#F44336")};
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 20px;
  font-weight: bold;
  animation: ${fadeInOut} 3s ease;
  z-index: 10;
`;

const WordGuessingGame: React.FC<WordGuessingGameProps> = ({
  voca,
  isSuccess,
  setIsSuccess,
  showLevel,
  setShowLevel,
}) => {
  const word = voca?.originalVocabulary;
  const shuffleWord = (word: string) => {
    return word
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  };

  const [shuffledWord, setShuffledWord] = useState<string>(shuffleWord(word));
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [remainingLetters, setRemainingLetters] = useState<string[]>(
    shuffledWord.split(""),
  );
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  useEffect(() => {
    const newShuffledWord = shuffleWord(word);
    setShuffledWord(newShuffledWord);
    setSelectedLetters([]);
    setRemainingLetters(newShuffledWord.split(""));

    setIsSuccess(false);
    setResultMessage(null);
  }, [word]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      const isShiftPressed = event.shiftKey;

      // Handle lowercase letter pick
      if (!isShiftPressed && remainingLetters.includes(key)) {
        const index = remainingLetters.indexOf(key);
        onLetterClick(key, index);
      }

      // Handle uppercase letter pick
      if (isShiftPressed && remainingLetters.includes(key.toUpperCase())) {
        const index = remainingLetters.indexOf(key.toUpperCase());
        onLetterClick(key.toUpperCase(), index);
      }

      // Handle backspace to unpick the last letter
      if (key === "Backspace") {
        if (selectedLetters.length > 0) {
          onRemoveLetter(selectedLetters.length - 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [remainingLetters, selectedLetters]);

  const onLetterClick = (letter: string, index: number) => {
    const newSelectedLetters = [...selectedLetters, letter];
    setSelectedLetters(newSelectedLetters);
    setRemainingLetters(remainingLetters.filter((_, i) => i !== index));

    // Check word when all letters are selected
    if (newSelectedLetters.length === word.length) {
      checkWord(newSelectedLetters.join(""));
    }
  };

  const onRemoveLetter = (index: number) => {
    const letter = selectedLetters[index];
    setRemainingLetters([...remainingLetters, letter]);
    setSelectedLetters(selectedLetters.filter((_, i) => i !== index));
  };

  const checkWord = (guessedWord: string) => {
    if (guessedWord === word) {
      setResultMessage("Congratulations! You guessed the correct word!");
      setIsSuccess(true);
    } else {
      setResultMessage("Incorrect guess. Try again!");
      setIsSuccess(false);
    }

    // Hide the result message after 3 seconds
    setTimeout(() => {
      setResultMessage(null);
    }, 3000);
  };

  return (
    <div className="p-5 bg-gray-50 rounded-lg shadow-md mx-auto my-4 relative">
      {/* Show Result Message */}
      {resultMessage && (
        <ResultMessage success={isSuccess}>{resultMessage}</ResultMessage>
      )}

      <div className="text-center text-lg mb-4 text-green-700">
        {voca.pronunciation}
      </div>

      <div className="flex items-center justify-center">
        <BtnAudio
          voca={voca.originalVocabularyBackup}
          audioUrl={voca.audioUrl}
        />
      </div>

      <RIf
        condition={isSuccess}
        result1={
          <div>
            <div className="text-center my-4">
              <span className="text-2xl mr-2">{voca.originalVocabulary}</span>
              <span className="font-bold italic">({voca.partsOfSpeech})</span>
            </div>
            <div
              className="text-lg text-blue-700 cursor-pointer border border-dashed border-blue-700 p-2 rounded-lg shadow-md my-2"
              onClick={() => setShowLevel(1)}
            >
              {voca.exampleSentences}
            </div>
            {showLevel >= 1 && (
              <div
                className="text-lg text-green-700 cursor-pointer border border-dashed border-green-700 p-2 rounded-lg shadow-md my-2"
                onClick={() => setShowLevel(2)}
              >
                {voca.definitionEn}
              </div>
            )}
            {showLevel >= 2 && (
              <div
                className="text-lg text-orange-700 cursor-pointer border border-dashed border-orange-700 p-2 rounded-lg shadow-md my-2"
                onClick={() => setShowLevel(3)}
              >
                {voca.definitionVi}
              </div>
            )}
            {showLevel >= 3 && (
              <div
                className="text-lg text-red-700 cursor-pointer border border-dashed border-red-700 p-2 rounded-lg shadow-md my-2"
                onClick={() => setShowLevel(4)}
              >
                {voca.exampleSentencesVi}
              </div>
            )}
            {showLevel >= 4 && (
              <div className="text-lg text-purple-700 cursor-pointer border border-dashed border-purple-700 p-2 rounded-lg shadow-md my-2">
                {voca.vocabulary}: {voca.translatedVi}
              </div>
            )}
          </div>
        }
      />

      {/* Answer Container */}
      <WordContainer>
        {selectedLetters.map((letter, index) => (
          <LetterBox
            key={`selected-${index}`}
            onClick={() => onRemoveLetter(index)}
            selected={true}
          >
            {letter}
          </LetterBox>
        ))}
      </WordContainer>

      {/* Shuffled Letters Container */}
      <WordContainer>
        {remainingLetters.map((letter, index) => (
          <LetterBox
            key={`remaining-${index}`}
            onClick={() => onLetterClick(letter, index)}
            selected={false}
          >
            {letter}
          </LetterBox>
        ))}
      </WordContainer>
    </div>
  );
};

export default WordGuessingGame;
