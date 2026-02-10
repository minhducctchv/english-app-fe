import { SoundOutlined, StopOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import { useEffect, useRef, useState } from "react";

interface IProps {
  text: string;
}

export default function GTTS({ text }: IProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isCancelledRef = useRef(false);

  // Use Web Speech API instead of Google Translate TTS
  // This is more reliable and works offline
  const speak = (textToSpeak: string) => {
    // Check if browser supports speech synthesis
    if (!window.speechSynthesis) {
      message.error("Text-to-speech is not supported in your browser");
      setIsSpeaking(false);
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    isCancelledRef.current = false;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utteranceRef.current = utterance;

    // Set properties
    utterance.lang = "en-US";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Handle events
    utterance.onend = () => {
      if (!isCancelledRef.current) {
        setIsSpeaking(false);
        utteranceRef.current = null;
      }
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);

      // Don't show error message if user cancelled
      if (event.error !== "canceled" && !isCancelledRef.current) {
        message.error(`Error playing audio: ${event.error}`);
      }

      setIsSpeaking(false);
      utteranceRef.current = null;
    };

    // Start speaking
    try {
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("Error starting speech:", err);
      message.error("Failed to start text-to-speech");
      setIsSpeaking(false);
    }
  };

  const handlePlay = () => {
    if (isSpeaking) {
      // Stop logic
      isCancelledRef.current = true;

      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }

      setIsSpeaking(false);
      utteranceRef.current = null;
      return;
    }

    if (!text) {
      message.warning("No text to speak");
      return;
    }

    setIsSpeaking(true);
    speak(text);
  };

  // Cleanup on unmount or when text changes
  useEffect(() => {
    return () => {
      isCancelledRef.current = true;
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        handlePlay();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [text, isSpeaking]);

  return (
    <div>
      <Button
        icon={isSpeaking ? <StopOutlined /> : <SoundOutlined />}
        onClick={handlePlay}
        danger={isSpeaking}
        shape="circle"
      />
    </div>
  );
}
