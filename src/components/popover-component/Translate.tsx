import React, { useCallback, useEffect } from "react";
import { IText, IVocabulary } from "../../types/types";
import Loading from "../common/Loading";
import RIf from "../common/RIf";
import Vocabulary from "./Vocabulary";
import { message } from "antd";
import {
  convertSingleVocabulary,
  convertVocabularyWithSentence,
  ISingleVocabulary,
  IVocabularyWithSentence,
} from "../../types/convert";
import Text from "./Text";
import BtnAudio from "./Audio";
import _ from "lodash";

const isVoca = (text: string) => {
  text = text.trim();
  let wordNumber = 0;
  if (text.length) {
    const words = text.split(/\s+/);
    wordNumber = words.length;
  }
  if (!wordNumber || wordNumber > 2) {
    return false;
  }
  return true;
};

interface IProps {
  openaiAiContextValue: any;
  vocabularyApiContextValue: any;
  selectedText: string;
  context?: string;
  contextMarked?: string;
}

export default function Translate(props: IProps) {
  const {
    openaiAiContextValue,
    vocabularyApiContextValue,
    selectedText,
    context,
    contextMarked,
  } = props;

  const [voca, setVoca] = React.useState<IVocabulary>();
  const [original, setOriginal] = React.useState<string>();
  const [text, setText] = React.useState<IText>();
  const [exists, setExists] = React.useState<IVocabulary[]>([]);
  const [loadingTranslate, setLoadingTranslate] =
    React.useState<boolean>(false);
  const [loadingSearch, setLoadingSearch] = React.useState<boolean>(false);
  const { translateWord, translatedText, getOriginalVocabulary } =
    openaiAiContextValue;
  const { search, update } = vocabularyApiContextValue;

  useEffect(() => {
    handleTranslate();
  }, [selectedText, context, contextMarked]);

  useEffect(() => {
    handleSearch();
  }, [voca]);

  const handleTranslate = async () => {
    try {
      setLoadingTranslate(true);
      if (isVoca(selectedText)) {
        const originalVoca = await getOriginalVocabulary(
          selectedText,
          contextMarked
        );
        if (
          originalVoca?.word &&
          !originalVoca.word.toLowerCase().includes("null")
        ) {
          setOriginal(originalVoca?.word);
          const result = await translateWord(selectedText, contextMarked);
          if (contextMarked) {
            const vocaWithSentence = { ...result } as IVocabularyWithSentence;
            setVoca(
              convertVocabularyWithSentence(
                vocaWithSentence,
                originalVoca.word,
                selectedText.trim(),
                contextMarked
              )
            );
          } else {
            const singleVoca = { ...result } as ISingleVocabulary;
            setVoca(
              convertSingleVocabulary(
                singleVoca,
                originalVoca.word,
                selectedText.trim()
              )
            );
          }
        } else {
          message.warning("Word not found in dictionary");
        }
      } else {
        const translateText = await translatedText(selectedText, contextMarked);
        if (translateText) {
          setText(translateText);
        }
      }
    } catch (err: any) {
      message.error(err.message);
    } finally {
      setLoadingTranslate(false);
    }
  };

  const handleSearch = () => {
    if (voca) {
      setLoadingSearch(true);
      search({ search: voca.originalVocabulary, isExact: true })
        .then((rs: any) => {
          setExists(rs.data);
        })
        .catch((e: any) => {
          message.error(e.message);
        })
        .finally(() => {
          setLoadingSearch(false);
        });
    }
  };

  const updateVoca = (field: keyof IVocabulary, value: string) => {
    setVoca((val: any) => ({
      ...val,
      [field]: value,
    }));
  };

  const updateItem = (item: IVocabulary) => {
    update(item._id, item)
      .then(() => {
        message.success("Update successfully");
      })
      .catch((err: any) => {
        message.error(err?.message);
      });
  };

  const updateItemVoca = (
    field: keyof IVocabulary,
    value: string,
    index: number
  ) => {
    const existsClone = structuredClone(exists);
    const existsCloneItem = structuredClone(existsClone[index]);
    const updatedItem = {
      ...existsCloneItem,
      [field]: value,
    };
    existsClone.splice(index, 1, updatedItem);
    setExists(existsClone);

    updateItem(updatedItem);
  };

  if (original && !voca) {
    return (
      <div>
        <div>Original: {original}</div>
        {loadingTranslate && <Loading />}
      </div>
    );
  }

  if (voca) {
    return (
      <div>
        <div className="flex gap-1 justify-center items-center flex-col mb-2">
          <div className="text-xl text-blue-600 font-medium">
            {voca.originalVocabulary}
          </div>
          <div>
            <BtnAudio
              voca={voca.originalVocabularyBackup}
              audioUrl={voca.audioUrl}
            />
          </div>
          <div>{voca.pronunciation}</div>
        </div>
        <div className="flex gap-4 justify-center items-center">
          <div className="flex gap-4 justify-center items-center min-w-[fit-content] max-w-[750px] overflow-x-auto">
            <RIf
              condition={loadingSearch}
              result1={<Loading />}
              result2={exists.map((item, index) => (
                <Vocabulary
                  key={item.id}
                  voca={item}
                  reloadListFn={handleSearch}
                  showDeleteBtn
                  childClassName="min-w-[360px] w-[360px] bg-gray-100"
                  updateVoca={(field: keyof IVocabulary, value: string) => {
                    updateItemVoca(field, value, index);
                  }}
                  defaultShowSentenceExample={false}
                  showTime={false}
                />
              ))}
            />
          </div>
          <RIf
            condition={loadingTranslate}
            result1={<Loading />}
            result2={
              <Vocabulary
                voca={voca}
                reloadListFn={handleSearch}
                showAddBtn
                childClassName="min-w-[360px] w-[360px] bg-green-100"
                updateVoca={updateVoca}
                defaultShowSentenceExample={false}
                showTime={false}
              />
            }
          />
        </div>
      </div>
    );
  }

  if (text) {
    return <Text text={text} />;
  }

  return <Loading />;
}
