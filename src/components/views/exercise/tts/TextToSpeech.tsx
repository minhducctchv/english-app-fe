import GTTS from "./GTTS";
import WebSpeechAPI from "./WebSpeechAPI";

interface IProps {
  text: string;
}

export default function TextToSpeech({ text }: IProps) {
  const isNotGTTS = localStorage.getItem("IS_GTTS") === "false";
  return isNotGTTS ? <WebSpeechAPI text={text} /> : <GTTS text={text} />;
}
