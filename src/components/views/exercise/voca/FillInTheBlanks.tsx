import { useState, useEffect } from "react";

interface IProps {
  context: string;
  text: string;
}

export default function FillInTheBlanks({ context, text }: IProps) {
  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [contextWithBlank, setContextWithBlank] = useState("");
  const [words, setWords] = useState<string[]>([]);
  const [hintCount, setHintCount] = useState(0);

  useEffect(() => {
    // Split text into words and initialize user inputs
    const textWords = text.split(/\s+/);
    setWords(textWords);

    // Initialize user inputs array with empty strings for each character
    const totalChars = text.replace(/\s+/g, "").length;
    setUserInputs(new Array(totalChars).fill(""));

    // Replace the text in context with placeholder
    const blankContext = context.replace(
      new RegExp(text, "gi"),
      "BLANK_PLACEHOLDER"
    );
    setContextWithBlank(blankContext);

    // Auto-focus on the first input when component loads
    setTimeout(() => {
      const firstInput = document.getElementById("input-0");
      firstInput?.focus();
    }, 100);
  }, [context, text]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newInputs = [...userInputs];
      const oldValue = newInputs[index];
      newInputs[index] = value.toLowerCase();
      setUserInputs(newInputs);

      // Auto-focus next input if current one is filled, regardless of whether value changed
      if (value && index < userInputs.length - 1) {
        const nextInput = document.getElementById(`input-${index + 1}`);
        nextInput?.focus();
      }

      // Check if all inputs are filled and auto-submit
      if (newInputs.every((input) => input.trim() !== "")) {
        setTimeout(() => {
          const userAnswer = getUserAnswerFromInputs(newInputs);
          const correct = userAnswer.toLowerCase() === text.toLowerCase();
          setIsCorrect(correct);
          setShowAnswer(true);
        }, 100); // Small delay to ensure UI updates
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !userInputs[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      const prevInput = document.getElementById(`input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = () => {
    const userAnswer = getUserAnswer();
    const correct = userAnswer.toLowerCase() === text.toLowerCase();
    setIsCorrect(correct);
    setShowAnswer(true);
  };

  const getUserAnswerFromInputs = (inputs: string[]) => {
    let answer = "";
    let inputIndex = 0;

    for (const word of words) {
      for (let i = 0; i < word.length; i++) {
        answer += inputs[inputIndex] || "_";
        inputIndex++;
      }
      if (inputIndex < inputs.length) {
        answer += " ";
      }
    }

    return answer.trim();
  };

  const getUserAnswer = () => {
    return getUserAnswerFromInputs(userInputs);
  };

  const handleReset = () => {
    setUserInputs(new Array(userInputs.length).fill(""));
    setShowAnswer(false);
    setIsCorrect(null);
    setHintCount(0);
    // Focus first input
    setTimeout(() => {
      const firstInput = document.getElementById("input-0");
      firstInput?.focus();
    }, 0);
  };

  const handleHint = () => {
    if (showAnswer) return;

    const newInputs = [...userInputs];
    let inputIndex = 0;
    let hintGiven = false;

    // Calculate hint stats for each word
    const wordStats = words.map((word, wordIndex) => {
      const maxHints = Math.floor(word.length * 0.5);
      let currentHints = 0;

      // Count current hints for this word
      for (let i = 0; i < word.length; i++) {
        if (newInputs[inputIndex + i] && newInputs[inputIndex + i] !== "") {
          currentHints++;
        }
      }

      const result = {
        word,
        wordIndex,
        startIndex: inputIndex,
        maxHints,
        currentHints,
        canReceiveHint: currentHints < maxHints,
      };

      inputIndex += word.length;
      return result;
    });

    // Find words that can receive hints, sorted by current hint count (ascending)
    const availableWords = wordStats
      .filter((stat) => stat.canReceiveHint)
      .sort((a, b) => a.currentHints - b.currentHints);

    if (availableWords.length > 0) {
      // Pick the word with the fewest hints
      const targetWord = availableWords[0];

      // Determine which position to fill (alternating start/end)
      const isEvenHint = targetWord.currentHints % 2 === 0;
      let targetIndex = -1;

      if (isEvenHint) {
        // Fill from start
        for (let i = 0; i < targetWord.word.length; i++) {
          if (
            !newInputs[targetWord.startIndex + i] ||
            newInputs[targetWord.startIndex + i] === ""
          ) {
            targetIndex = targetWord.startIndex + i;
            break;
          }
        }
      } else {
        // Fill from end
        for (let i = targetWord.word.length - 1; i >= 0; i--) {
          if (
            !newInputs[targetWord.startIndex + i] ||
            newInputs[targetWord.startIndex + i] === ""
          ) {
            targetIndex = targetWord.startIndex + i;
            break;
          }
        }
      }

      if (targetIndex !== -1) {
        const charIndex = targetIndex - targetWord.startIndex;
        newInputs[targetIndex] = targetWord.word[charIndex].toLowerCase();
        hintGiven = true;
      }
    }

    if (hintGiven) {
      setUserInputs(newInputs);
      setHintCount(hintCount + 1);

      // Auto-focus on the first empty input after hint is given
      setTimeout(() => {
        for (let i = 0; i < newInputs.length; i++) {
          if (!newInputs[i] || newInputs[i] === "") {
            const nextInput = document.getElementById(`input-${i}`);
            nextInput?.focus();
            break;
          }
        }
      }, 100);
    }
  };

  const canGiveHint = () => {
    if (showAnswer) return false;

    let inputIndex = 0;
    for (const word of words) {
      const maxHints = Math.floor(word.length * 0.5);
      let currentHints = 0;

      for (let i = 0; i < word.length; i++) {
        if (userInputs[inputIndex + i] && userInputs[inputIndex + i] !== "") {
          currentHints++;
        }
      }

      if (currentHints < maxHints) {
        return true;
      }

      inputIndex += word.length;
    }

    return false;
  };

  const renderInputBoxes = () => {
    let inputIndex = 0;

    return words.map((word, wordIndex) => (
      <span key={wordIndex} className="inline-flex items-center">
        {word.split("").map((char, charIndex) => {
          const currentIndex = inputIndex++;
          const isHintChar =
            userInputs[currentIndex] &&
            userInputs[currentIndex] === char.toLowerCase();
          return (
            <input
              key={`${wordIndex}-${charIndex}`}
              id={`input-${currentIndex}`}
              type="text"
              value={userInputs[currentIndex] || ""}
              onChange={(e) => handleInputChange(currentIndex, e.target.value)}
              onInput={(e) => {
                // Handle input event to catch cases where user types same character as hint
                const target = e.target as HTMLInputElement;
                handleInputChange(currentIndex, target.value);
              }}
              onKeyDown={(e) => handleKeyDown(e, currentIndex)}
              onFocus={(e) => {
                // Select all text when focusing on a hint character to make it easy to overwrite
                if (isHintChar) {
                  e.target.select();
                }
              }}
              className={`w-8 h-8 text-center border-b-2 bg-transparent font-semibold focus:outline-none mx-0.5 ${
                isHintChar
                  ? "border-orange-400 text-orange-600 focus:border-orange-600"
                  : "border-blue-500 text-blue-600 focus:border-blue-700"
              }`}
              maxLength={1}
              disabled={showAnswer}
            />
          );
        })}
        {wordIndex < words.length - 1 && <span className="mx-2"></span>}
      </span>
    ));
  };

  return (
    <div className="fill-in-blanks-container mx-auto">
      <div className="mb-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800"> </h3>
        </div>

        {/* Context with blank */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <p className="text-lg leading-relaxed">
            {contextWithBlank
              .split("BLANK_PLACEHOLDER")
              .map((part, index, array) => (
                <span key={index}>
                  {part}
                  {index < array.length - 1 && (
                    <span className="inline-block">
                      {showAnswer ? (
                        <span
                          className={`px-2 py-1 rounded font-semibold ${
                            isCorrect
                              ? "bg-green-200 text-green-800"
                              : "bg-red-200 text-red-800"
                          }`}
                        >
                          {getUserAnswer()}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          {renderInputBoxes()}
                        </span>
                      )}
                    </span>
                  )}
                </span>
              ))}
          </p>
        </div>

        {/* Feedback */}
        {showAnswer && (
          <div
            className={`p-4 rounded-lg mb-4 ${
              isCorrect
                ? "bg-green-100 border border-green-300"
                : "bg-red-100 border border-red-300"
            }`}
          >
            <span
              className={`text-lg font-semibold ${
                isCorrect ? "text-green-800" : "text-red-800"
              }`}
            >
              {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="text-center space-x-4 mt-6">
          <button
            onClick={handleHint}
            disabled={!canGiveHint() || showAnswer}
            className={`
              px-6 py-2 rounded-lg font-semibold transition-colors duration-200
              ${
                canGiveHint() && !showAnswer
                  ? "bg-yellow-500 text-white hover:bg-yellow-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            💡 Hint ({hintCount})
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
          >
            🔄 Reset
          </button>
        </div>
      </div>
    </div>
  );
}
