import { SoundOutlined, StopOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useEffect, useRef, useState } from "react";

interface IProps {
  text: string;
}

export default function WebSpeechAPI({ text }: IProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const mounted = useRef(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        buttonRef.current?.click();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSpeak = () => {
    const synth = window.speechSynthesis;

    if (!text) return;

    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.onend = () => {
      if (mounted.current) {
        setIsSpeaking(false);
      }
    };

    utterance.onerror = () => {
      if (mounted.current) {
        setIsSpeaking(false);
      }
    };

    setIsSpeaking(true);
    synth.speak(utterance);
  };

  return (
    <div>
      <Button
        ref={buttonRef}
        icon={isSpeaking ? <StopOutlined /> : <SoundOutlined />}
        onClick={handleSpeak}
        danger={isSpeaking}
        shape="circle"
      />
    </div>
  );
}
