import React, { useState, useEffect, useRef } from "react";
import { Tag, Button } from "antd";
import { partOfSpeechColors } from "../../../../types/types";

interface IProps {
  text: string;
}

interface LetterTile {
  id: string;
  letter: string;
  isUsed: boolean;
}

interface AnswerSlot {
  id: string;
  letter: string;
  isEmpty: boolean;
  sourceId?: string;
  isSpace?: boolean;
}

export default function WordScramble({ text }: IProps) {
  const [scrambledLetters, setScrambledLetters] = useState<LetterTile[]>([]);
  const [answerSlots, setAnswerSlots] = useState<AnswerSlot[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hintsUsed, setHintsUsed] = useState<number[]>([]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Shuffle array utility function
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initialize game
  useEffect(() => {
    if (!text) return;

    // Extract only letters (no spaces) for scrambling
    const lettersOnly = text.toLowerCase().replace(/\s+/g, "").split("");
    const letters = lettersOnly.map((letter, index) => ({
      id: `letter-${index}`,
      letter,
      isUsed: false,
    }));

    const shuffled = shuffleArray(letters);
    setScrambledLetters(shuffled);

    // Create slots for all characters including spaces
    const slots = text.split("").map((char, index) => ({
      id: `slot-${index}`,
      letter: char === " " ? " " : "",
      isEmpty: char !== " ",
      isSpace: char === " ",
    }));
    setAnswerSlots(slots);
    setIsComplete(false);
    setIsCorrect(false);
    setHintsUsed([]);
  }, [text]);

  // Check if answer is complete and correct
  useEffect(() => {
    const filledSlots = answerSlots.filter(
      (slot) => !slot.isEmpty && !slot.isSpace,
    );
    const totalLetterSlots = answerSlots.filter((slot) => !slot.isSpace).length;
    const complete = filledSlots.length === totalLetterSlots;
    setIsComplete(complete);

    if (complete) {
      const userAnswer = answerSlots.map((slot) => slot.letter).join("");
      setIsCorrect(userAnswer.toLowerCase() === text.toLowerCase());
    }
  }, [answerSlots, text]);

  // Auto-focus first input slot when component loads
  useEffect(() => {
    if (answerSlots.length > 0) {
      // Find first non-space slot
      const firstSlotIndex = answerSlots.findIndex((slot) => !slot.isSpace);
      if (firstSlotIndex !== -1) {
        // Use setTimeout to ensure the input is rendered
        setTimeout(() => {
          inputRefs.current[firstSlotIndex]?.focus();
        }, 100);
      }
    }
  }, [answerSlots.length]);

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, letterId: string) => {
    setDraggedItem(letterId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, slotId: string) => {
    e.preventDefault();
    if (!draggedItem) return;

    const draggedLetter = scrambledLetters.find(
      (letter) => letter.id === draggedItem,
    );
    if (!draggedLetter || draggedLetter.isUsed) return;

    const slotIndex = answerSlots.findIndex((slot) => slot.id === slotId);
    if (slotIndex === -1) return;

    // If slot is already filled, return the letter to available pool
    if (!answerSlots[slotIndex].isEmpty) {
      const returnedSourceId = answerSlots[slotIndex].sourceId;
      if (returnedSourceId) {
        setScrambledLetters((prev) =>
          prev.map((letter) =>
            letter.id === returnedSourceId
              ? { ...letter, isUsed: false }
              : letter,
          ),
        );
      }
    }

    // Update answer slots
    setAnswerSlots((prev) =>
      prev.map((slot) =>
        slot.id === slotId
          ? {
              ...slot,
              letter: draggedLetter.letter,
              isEmpty: false,
              sourceId: draggedLetter.id,
            }
          : slot,
      ),
    );

    // Mark letter as used
    setScrambledLetters((prev) =>
      prev.map((letter) =>
        letter.id === draggedItem ? { ...letter, isUsed: true } : letter,
      ),
    );

    setDraggedItem(null);
  };

  // Typing handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    slotIndex: number,
  ) => {
    const slot = answerSlots[slotIndex];
    if (slot.isSpace) return; // Don't allow input on space slots

    const value = e.target.value.toLowerCase();
    if (value.length > 1) return;

    // If slot was previously filled, return the letter to available pool
    if (!slot.isEmpty) {
      const returnedSourceId = slot.sourceId;
      if (returnedSourceId) {
        setScrambledLetters((prev) =>
          prev.map((letter) =>
            letter.id === returnedSourceId
              ? { ...letter, isUsed: false }
              : letter,
          ),
        );
      }
    }

    if (value === "") {
      // Clear the slot
      setAnswerSlots((prev) =>
        prev.map((s, index) =>
          index === slotIndex
            ? { ...s, letter: "", isEmpty: true, sourceId: undefined }
            : s,
        ),
      );
    } else {
      // Find available letter that matches
      const availableLetter = scrambledLetters.find(
        (letter) => letter.letter === value && !letter.isUsed,
      );

      if (availableLetter) {
        // Update answer slots
        setAnswerSlots((prev) =>
          prev.map((s, index) =>
            index === slotIndex
              ? {
                  ...s,
                  letter: value,
                  isEmpty: false,
                  sourceId: availableLetter.id,
                }
              : s,
          ),
        );

        // Mark letter as used
        setScrambledLetters((prev) =>
          prev.map((letter) =>
            letter.id === availableLetter.id
              ? { ...letter, isUsed: true }
              : letter,
          ),
        );

        // Move to next non-space input
        let nextIndex = slotIndex + 1;
        while (
          nextIndex < answerSlots.length &&
          answerSlots[nextIndex].isSpace
        ) {
          nextIndex++;
        }
        if (nextIndex < answerSlots.length) {
          inputRefs.current[nextIndex]?.focus();
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, slotIndex: number) => {
    if (
      e.key === "Backspace" &&
      answerSlots[slotIndex].isEmpty &&
      slotIndex > 0
    ) {
      // Move to previous non-space input
      let prevIndex = slotIndex - 1;
      while (prevIndex >= 0 && answerSlots[prevIndex].isSpace) {
        prevIndex--;
      }
      if (prevIndex >= 0) {
        inputRefs.current[prevIndex]?.focus();
      }
    }
  };

  // Reset game
  const resetGame = () => {
    // Extract only letters (no spaces) for scrambling
    const lettersOnly = text.toLowerCase().replace(/\s+/g, "").split("");
    const letters = lettersOnly.map((letter, index) => ({
      id: `letter-${index}`,
      letter,
      isUsed: false,
    }));
    const shuffled = shuffleArray(letters);
    setScrambledLetters(shuffled);

    // Create slots for all characters including spaces
    const slots = text.split("").map((char, index) => ({
      id: `slot-${index}`,
      letter: char === " " ? " " : "",
      isEmpty: char !== " ",
      isSpace: char === " ",
    }));
    setAnswerSlots(slots);
    setIsComplete(false);
    setIsCorrect(false);
    setHintsUsed([]);
  };

  // Get hint - fill one character at start/end of each word alternately
  // Prioritize words with fewer hints to distribute evenly
  const getHint = () => {
    if (!text) return;

    // Split text into words and get their positions
    const words = text.split(" ");
    let currentIndex = 0;
    const wordRanges: {
      start: number;
      end: number;
      word: string;
      hintCount: number;
      maxHints: number;
    }[] = [];

    words.forEach((word) => {
      if (word.length > 0) {
        const wordStart = currentIndex;
        const wordEnd = currentIndex + word.length - 1;
        const maxHints = Math.floor(word.length * 0.5); // 50% max
        const hintCount = hintsUsed.filter(
          (index) => index >= wordStart && index <= wordEnd,
        ).length;

        wordRanges.push({
          start: wordStart,
          end: wordEnd,
          word: word.toLowerCase(),
          hintCount,
          maxHints,
        });
      }
      currentIndex += word.length + 1; // +1 for space
    });

    // Find word with lowest hint count that can still receive hints
    const eligibleWords = wordRanges.filter(
      (wordRange) => wordRange.hintCount < wordRange.maxHints,
    );
    if (eligibleWords.length === 0) return;

    // Sort by hint count (ascending) to prioritize words with fewer hints
    eligibleWords.sort((a, b) => a.hintCount - b.hintCount);
    const targetWord = eligibleWords[0];

    // Determine next position (alternate between start and end)
    let targetIndex: number;
    if (targetWord.hintCount % 2 === 0) {
      // Fill from start
      targetIndex = targetWord.start + Math.floor(targetWord.hintCount / 2);
    } else {
      // Fill from end
      targetIndex = targetWord.end - Math.floor(targetWord.hintCount / 2);
    }

    // Check if this position is already filled or hinted
    if (hintsUsed.includes(targetIndex) || !answerSlots[targetIndex]?.isEmpty) {
      return;
    }

    // Fill the hint
    const correctLetter = targetWord.word[targetIndex - targetWord.start];
    const availableLetter = scrambledLetters.find(
      (letter) => letter.letter === correctLetter && !letter.isUsed,
    );

    if (availableLetter) {
      // Update answer slots
      setAnswerSlots((prev) =>
        prev.map((slot, index) =>
          index === targetIndex
            ? {
                ...slot,
                letter: correctLetter,
                isEmpty: false,
                sourceId: availableLetter.id,
              }
            : slot,
        ),
      );

      // Mark letter as used
      setScrambledLetters((prev) =>
        prev.map((letter) =>
          letter.id === availableLetter.id
            ? { ...letter, isUsed: true }
            : letter,
        ),
      );

      // Track hint usage
      setHintsUsed((prev) => [...prev, targetIndex]);
    }
  };

  // Check if more hints are available
  const canGetHint = () => {
    if (!text) return false;

    const words = text.split(" ");
    let currentIndex = 0;

    return words.some((word) => {
      if (word.length === 0) {
        currentIndex += 1;
        return false;
      }

      const wordStart = currentIndex;
      const wordEnd = currentIndex + word.length - 1;
      const maxHints = Math.floor(word.length * 0.5);
      const existingHints = hintsUsed.filter(
        (index) => index >= wordStart && index <= wordEnd,
      ).length;

      currentIndex += word.length + 1;
      return existingHints < maxHints;
    });
  };

  // Double click to return letter to pool
  const handleSlotDoubleClick = (slotIndex: number) => {
    const slot = answerSlots[slotIndex];
    if (!slot.isEmpty && !slot.isSpace && slot.sourceId) {
      // Return letter to available pool
      setScrambledLetters((prev) =>
        prev.map((letter) =>
          letter.id === slot.sourceId ? { ...letter, isUsed: false } : letter,
        ),
      );

      // Clear the slot
      setAnswerSlots((prev) =>
        prev.map((s, index) =>
          index === slotIndex
            ? { ...s, letter: "", isEmpty: true, sourceId: undefined }
            : s,
        ),
      );
    }
  };

  return (
    <div className="w-full mx-auto">
      {/* Scrambled Letters */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Available Letters:
        </h3>
        {!isCorrect || !isComplete ? (
          <div className="flex flex-wrap gap-2 justify-center">
            {scrambledLetters.map((letterTile) => (
              <div
                key={letterTile.id}
                draggable={!letterTile.isUsed}
                onDragStart={(e) => handleDragStart(e, letterTile.id)}
                className={`
                w-12 h-12 flex items-center justify-center rounded-lg border-2 font-bold text-lg
                transition-all duration-200 cursor-pointer select-none
                ${
                  letterTile.isUsed
                    ? "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed opacity-50"
                    : "bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200 hover:scale-105"
                }
              `}
              >
                {letterTile.letter.toUpperCase()}
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full flex justify-center items-center">
            <Tag
              bordered
              className={`${partOfSpeechColors.noun} font-bold`}
              style={{ fontSize: "2.25rem", padding: "1rem" }}
            >
              {text}
            </Tag>
          </div>
        )}
      </div>

      {/* Answer Slots */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Your Answer:
        </h3>
        <div className="flex flex-wrap gap-1 justify-center items-end">
          {answerSlots.map((slot, index) => {
            // Check if this is the start of a new word
            const isWordStart = index === 0 || answerSlots[index - 1].isSpace;
            const isWordEnd =
              index === answerSlots.length - 1 ||
              answerSlots[index + 1]?.isSpace;

            if (slot.isSpace) {
              return (
                <div key={slot.id} className="w-4 h-12 flex items-end">
                  <div className="w-full h-1"></div>
                </div>
              );
            }

            return (
              <div
                key={slot.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, slot.id)}
                onDoubleClick={() => handleSlotDoubleClick(index)}
                className={`relative ${isWordStart ? "ml-2" : ""} ${
                  isWordEnd ? "mr-2" : ""
                }`}
              >
                <input
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  value={slot.letter.toUpperCase()}
                  onChange={(e) => handleInputChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`
                    w-12 h-12 text-center font-bold text-lg rounded-lg border-2
                    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${
                      slot.isEmpty
                        ? "bg-gray-50 border-gray-300 border-dashed"
                        : "bg-green-100 border-green-300 text-green-800"
                    }
                  `}
                  maxLength={1}
                />
              </div>
            );
          })}
        </div>
        <p className="text-sm text-gray-500 text-center mt-4">
          Tip: Type letters, drag & drop, or double-click to remove, Tab to move
          to next slot
        </p>
      </div>

      {/* Result */}
      {isComplete && (
        <div className="text-center mb-6">
          <div
            className={`
            p-4 rounded-lg font-semibold text-lg
            ${
              isCorrect
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }
          `}
          >
            {isCorrect
              ? "🎉 Correct! Well done!"
              : "❌ Not quite right. Try again!"}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="text-center space-x-4">
        <Button
          onClick={getHint}
          disabled={!canGetHint() || isComplete}
          type="default"
          size="large"
          style={{
            backgroundColor:
              canGetHint() && !isComplete ? "#eab308" : undefined,
            color: canGetHint() && !isComplete ? "white" : undefined,
            fontWeight: "600",
          }}
        >
          💡 Hint
        </Button>
        <Button
          onClick={resetGame}
          type="primary"
          size="large"
          style={{ fontWeight: "600" }}
        >
          🔄 Reset Game
        </Button>
      </div>
    </div>
  );
}
