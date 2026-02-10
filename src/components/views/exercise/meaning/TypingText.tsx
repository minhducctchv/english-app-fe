import { useState, useRef, useEffect } from "react";
import { Input, type InputRef } from "antd";

interface IProps {
  text: string;
}

export default function TypingText(props: IProps) {
  const { text } = props;
  const [inputValue, setInputValue] = useState("");
  const isSuccess = inputValue?.toLowerCase() === text?.toLowerCase();
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="w-full max-w-md">
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type here..."
        className={`transition-colors ${
          isSuccess
            ? "border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500/50 bg-green-100"
            : ""
        }`}
      />
    </div>
  );
}
