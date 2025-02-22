import { CheckOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useEffect, useMemo, useState } from "react";
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

  const playAudio = () => {
    audio?.play();
  };

  return (
    <div className="flex justify-center items-center gap-3">
      <Button
        shape="circle"
        icon={<PlayCircleOutlined />}
        onClick={playAudio}
        disabled={!audio}
      />
      {!!audioUrl?.length && <CheckOutlined />}
    </div>
  );
}
