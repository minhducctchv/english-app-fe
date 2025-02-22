import { message } from "antd";
import { useEffect } from "react";
import ReactDOM from "react-dom";
import { markTextPopper } from "../../components/popover/MarkTextPopper";
import { MARK_KEY } from "../../constant/constant";
import { useAppContext } from "../../context/AppProvider";
import useVocabularyApi from "../api/useVocabularyApi";
import useOpenAi from "../useOpenai";

export default function useMarkText() {
  const { topic, setTopic, setIsOpenDrawer, setDrawerActiveTab } =
    useAppContext();
  const openAiValue = useOpenAi();
  const vocabularyApiValue = useVocabularyApi();

  const { getSoftwareTerm } = useOpenAi();

  const setTopicUndefined = () => {
    setTopic(undefined);
  };

  // set empty string topic when web reload or move to other web
  useEffect(() => {
    window.addEventListener("popstate", setTopicUndefined);
    window.addEventListener("beforeunload", setTopicUndefined);
    return () => {
      window.removeEventListener("popstate", setTopicUndefined);
      window.removeEventListener("beforeunload", setTopicUndefined);
    };
  }, []);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.shiftKey && event.key.toLowerCase() === MARK_KEY) {
      event.preventDefault();
      event.stopPropagation();
      markText();
    }
  };
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [topic]);

  const markText = async () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString();
    if (selection && selectedText && selection.rangeCount > 0) {
      if (!topic) {
        setIsOpenDrawer(true);
        setDrawerActiveTab("enter_topic");
        message.warning("Please enter topic first");
        return;
      }

      const range = selection.getRangeAt(0);

      const selectedTextFragment = range.cloneContents();

      const originalFragment = selectedTextFragment.cloneNode(
        true
      ) as DocumentFragment;

      const technicalTerms = await getSoftwareTerm(selectedText, topic);

      replaceWordsWithComponent(originalFragment, technicalTerms?.words ?? []);
      range.deleteContents();
      range.insertNode(originalFragment);
    }
  };

  const replaceWordsWithComponent = (
    container: HTMLElement | DocumentFragment,
    words: {
      word: string;
      meaningVi: string;
      meaningEn: string;
      translatedVi: string;
    }[]
  ) => {
    words.forEach((word) => {
      const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode(node) {
            // Chỉ chấp nhận các text node chứa từ cần thay thế, không phân biệt hoa thường
            const regex = new RegExp(`\\b${word.word}\\b`, "i");
            return regex.test(node.nodeValue || "")
              ? NodeFilter.FILTER_ACCEPT
              : NodeFilter.FILTER_REJECT;
          },
        }
      );

      const nodesToReplace: Node[] = [];
      while (walker.nextNode()) {
        nodesToReplace.push(walker.currentNode);
      }

      nodesToReplace.forEach((node) => {
        const parent = node.parentNode;
        if (parent) {
          // Thay thế từ cần thay thế bằng React component House
          const regex = new RegExp(`\\b${word.word}\\b`, "gi");
          const fragments = (node.nodeValue || "").split(regex);
          fragments.forEach((fragment, index) => {
            parent.insertBefore(document.createTextNode(fragment), node);
            if (index < fragments.length - 1) {
              const houseElement = document.createElement("span");
              parent.insertBefore(houseElement, node);
              const context = `${fragment} ${word.word} ${
                fragments[index + 1]
              }`;
              const markedContext = `${fragment} [[${word.word}]] ${
                fragments[index + 1]
              }`;
              const newElement = markTextPopper(
                word.word,
                word.meaningVi,
                word.meaningEn,
                word.translatedVi,
                openAiValue,
                vocabularyApiValue,
                context,
                markedContext
              );
              ReactDOM.render(newElement, houseElement);
            }
          });
          parent.removeChild(node);
        }
      });
    });
  };
}
