import { LoadingOutlined } from "@ant-design/icons";
import { message, Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import React, { useEffect } from "react";
import {
  convertSingleVocabulary,
  convertVocabularyWithSentence,
  ISingleVocabulary,
  IVocabularyWithSentence,
} from "../../types/convert";
import { IText, IVocabulary } from "../../types/types";
import Loading from "../common/Loading";
import BtnAudio from "./Audio";
import Text from "./Text";
import VocabularyAI from "./VocabularyAI";

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

export default function TranslateWordAI(props: IProps) {
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
          <div>
            <span className="text-xl text-blue-600 font-medium">
              {voca.originalVocabulary}
            </span>
            <span className="italic ml-1">({voca.partsOfSpeech})</span>
          </div>
          <div>
            <BtnAudio
              voca={voca.originalVocabularyBackup}
              audioUrl={voca.audioUrl}
            />
          </div>
          <div>{voca.pronunciation}</div>
        </div>
        <Tabs defaultActiveKey="new">
          <TabPane tab="NEW" key="new">
            {loadingTranslate ? (
              <Loading />
            ) : (
              <VocabularyAI
                voca={voca}
                reloadListFn={handleSearch}
                showAddBtn
                updateVoca={updateVoca}
              />
            )}
          </TabPane>
          {loadingSearch ? (
            <TabPane tab={<LoadingOutlined />} key="loading"></TabPane>
          ) : (
            exists.map((item, index) => (
              <TabPane tab={`OLD ${index + 1}`} key={`${index + 1}`}>
                <VocabularyAI
                  key={item.id}
                  voca={item}
                  reloadListFn={handleSearch}
                  showDeleteBtn
                  showUpdateBtn
                  updateVoca={(field: keyof IVocabulary, value: string) => {
                    updateItemVoca(field, value, index);
                  }}
                />
              </TabPane>
            ))
          )}
        </Tabs>
      </div>
    );
  }

  if (text) {
    return <Text text={text} />;
  }

  return <Loading />;
}
