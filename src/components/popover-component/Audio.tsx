import {
  CheckOutlined,
  FastBackwardOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { useEffect, useMemo, useState } from "react";
import { CallDictionaryService } from "../../hook/api/CallDictionaryService";

interface IProps {
  voca?: string;
  audioUrl?: string;
}

export default function BtnAudio({ voca, audioUrl }: IProps) {
  const [audioSrc, setAudioSrc] = useState<string>();

  useEffect(() => {
    if (audioUrl) {
      setAudioSrc(audioUrl);
    } else if (voca) {
      CallDictionaryService.getAudio(voca)
        .then((aud) => {
          setAudioSrc(aud);
        })
        .catch((err: any) => {
          console.log(err.message + ": " + voca);
        });
    }
  }, [voca, audioUrl]);

  const audio = useMemo(() => {
    if (audioSrc) {
      return new Audio(audioSrc);
    }
  }, [audioSrc]);

  const playAudio = (speed: number = 1) => {
    if (audio) {
      audio.playbackRate = speed;
      audio.currentTime = 0; // Phát từ đầu
      audio.play();
    }
  };

  return (
    <div className="flex justify-center items-center gap-4">
      <Button
        icon={<FastBackwardOutlined />}
        onClick={() => playAudio(0.75)}
        disabled={!audio}
      >
        0.75x
      </Button>
      <Button
        shape="circle"
        size="large"
        type="primary"
        icon={<PlayCircleOutlined />}
        onClick={() => playAudio(1)}
        disabled={!audio}
      />
      <Button
        icon={<FastBackwardOutlined />}
        onClick={() => playAudio(0.5)}
        disabled={!audio}
      >
        0.5x
      </Button>
      {!!audioUrl?.length && <CheckOutlined />}
    </div>
  );
}
