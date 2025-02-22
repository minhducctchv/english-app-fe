import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import TranslatePopover from "../../components/popover/TranslatePopover";
import { TRANSLATE_KEY } from "../../constant/constant";
import useVocabularyApi from "../api/useVocabularyApi";
import useOpenAi from "../useOpenai";

const escapeRegExp = (string: string | null) => {
  if (!string) return "";
  return string.replace(/['".*+?^${}()|[\]\\]/g, "\\$&"); // Thoát các ký tự đặc biệt trong regex
};

export default function useTranslateText() {
  const openAiValue = useOpenAi();
  const vocabularyApiValue = useVocabularyApi();

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const insertPopover = (
    text: string,
    context?: string,
    contextMarked?: string
  ) => {
    return (
      <TranslatePopover
        text={text}
        context={context}
        contextMarked={contextMarked}
        openAiContextValue={openAiValue}
        vocabularyApiContextValue={vocabularyApiValue}
      />
    );
  };

  const getText = () => {
    const selectedText = window.getSelection()?.toString();
    if (selectedText) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const container = range.commonAncestorContainer;

        let context: string | undefined = undefined;
        let contextMarked: string | undefined = undefined;

        if (container.nodeType === Node.TEXT_NODE) {
          const parent = container.parentElement;

          if (parent) {
            const textContent = parent.textContent || "";

            // Find the exact start position of the selected text
            const startOffset = range.startOffset;
            const endOffset = range.endOffset;

            const sentenceRegex = /[^.!?]*[.!?]/g;
            let match;
            while ((match = sentenceRegex.exec(textContent)) !== null) {
              if (match[0].includes(selectedText)) {
                context = match[0].trim();
                break;
              }
            }

            // If no sentence found, check for line context
            if (!context) {
              const lines = textContent.split("\n");
              let currentOffset = 0;
              for (const line of lines) {
                const lineEndOffset = currentOffset + line.length;
                if (
                  currentOffset <= startOffset &&
                  lineEndOffset >= endOffset &&
                  line.includes(selectedText)
                ) {
                  context = line.trim();
                  break;
                }
                currentOffset = lineEndOffset + 1; // +1 for the newline character
              }
            }

            // Create contextMarked by replacing the exact instance of selected text in the context
            if (context) {
              const contextStart = textContent.indexOf(context);
              const selectedTextStart = textContent.indexOf(
                selectedText,
                contextStart
              );
              const selectedTextEnd = selectedTextStart + selectedText.length;

              const beforeSelectedText = context.slice(
                0,
                selectedTextStart - contextStart
              );
              const afterSelectedText = context.slice(
                selectedTextEnd - contextStart
              );

              contextMarked =
                beforeSelectedText + `[[${selectedText}]]` + afterSelectedText;
            }
          }
        }

        // If still no context, check if the selected text is alone
        if (!context || context === selectedText) {
          context = undefined;
          contextMarked = undefined;
        }

        console.log(`Selected Text: ${selectedText}`);
        console.log(`Context: ${context}`);
        console.log(`Context Marked: ${contextMarked}`);

        return { selectedText, context, contextMarked };
      }
    }
    return {
      selectedText: undefined,
      context: undefined,
      contextMarked: undefined,
    };
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.shiftKey && event.key.toLowerCase() === TRANSLATE_KEY) {
      event.preventDefault();
      event.stopPropagation();
      markText();
    }
  };

  const markText = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString();
    if (selection && selectedText && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      const selectedTextFragment = range.cloneContents();

      const originalFragment = selectedTextFragment.cloneNode(
        true
      ) as DocumentFragment;

      const { selectedText, context, contextMarked } = getText();

      replaceWordsWithComponent(originalFragment, [
        {
          text: selectedText?.trim() ?? "",
          context: context,
          contextMarked,
        },
      ]);
      range.deleteContents();
      range.insertNode(originalFragment);
    }
  };

  const replaceWordsWithComponent = (
    container: HTMLElement | DocumentFragment,
    words: {
      text: string;
      context?: string;
      contextMarked?: string;
    }[]
  ) => {
    words.forEach((word) => {
      const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode(node) {
            return escapeRegExp(node.nodeValue)?.includes(
              escapeRegExp(word.text)
            )
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
          if (escapeRegExp(node.nodeValue)?.includes(escapeRegExp(word.text))) {
            const houseElement = document.createElement("span");
            parent.insertBefore(houseElement, node);
            const newElement = insertPopover(
              word.text,
              word.context,
              word.contextMarked
            );
            ReactDOM.render(newElement, houseElement);
          }
          parent.removeChild(node);
        }
      });
    });
  };
}
