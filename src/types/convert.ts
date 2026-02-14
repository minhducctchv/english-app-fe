import { z } from "zod";
import {
  SingleVocabularySchema,
  VocabularyWithSentenceSchema,
  WordSchema,
} from "./jsonSchema";
import { IVocabulary } from "./types";

export type IVocabularyWithSentence = z.infer<
  typeof VocabularyWithSentenceSchema
>;
export type ISingleVocabulary = z.infer<typeof SingleVocabularySchema>;
export type IWordSchema = z.infer<typeof WordSchema>;

export function convertVocabularyWithSentence(
  vocabularyWithSentence: IVocabularyWithSentence,
  vocabulary: string,
  sentences: string,
): IVocabulary {
  return {
    voca: vocabulary,
    mean: vocabularyWithSentence.vocabularyTranslatedVi,
    partsOfSpeech: vocabularyWithSentence.partsOfSpeech,
    pronunciation: vocabularyWithSentence.pronunciation,
    text: sentences,
    textMean: vocabularyWithSentence.sentencesTranslatedVi,
  };
}

export function convertSingleVocabulary(
  singleVocabulary: ISingleVocabulary,
  vocabulary: string,
): IVocabulary {
  return {
    voca: vocabulary,
    mean: singleVocabulary.vocabularyTranslatedVi,
    partsOfSpeech: singleVocabulary.partsOfSpeech,
    pronunciation: singleVocabulary.pronunciation,
    text: singleVocabulary.exampleSentences,
    textMean: singleVocabulary.exampleSentencesVi,
  };
}
