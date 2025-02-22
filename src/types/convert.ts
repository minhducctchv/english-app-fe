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
  originalVocabulary: string,
  vocabulary: string,
  sentences: string
): IVocabulary {
  return {
    vocabulary: vocabulary,
    translatedVi: vocabularyWithSentence.vocabularyTranslatedVi,
    partsOfSpeech: vocabularyWithSentence.partsOfSpeech,
    pronunciation: vocabularyWithSentence.pronunciation,
    definitionEn: vocabularyWithSentence.definitionEn,
    definitionVi: vocabularyWithSentence.definitionVi,
    exampleSentences: sentences,
    exampleSentencesVi: vocabularyWithSentence.sentencesTranslatedVi,
    originalVocabulary: originalVocabulary,
    originalVocabularyBackup: originalVocabulary,
  };
}

export function convertSingleVocabulary(
  singleVocabulary: ISingleVocabulary,
  originalVocabulary: string,
  vocabulary: string
): IVocabulary {
  return {
    vocabulary: vocabulary,
    translatedVi: singleVocabulary.vocabularyTranslatedVi,
    partsOfSpeech: singleVocabulary.partsOfSpeech,
    pronunciation: singleVocabulary.pronunciation,
    definitionEn: singleVocabulary.definitionEn,
    definitionVi: singleVocabulary.definitionVi,
    exampleSentences: singleVocabulary.exampleSentences,
    exampleSentencesVi: singleVocabulary.exampleSentencesVi,
    originalVocabulary: originalVocabulary,
    originalVocabularyBackup: originalVocabulary,
  };
}
