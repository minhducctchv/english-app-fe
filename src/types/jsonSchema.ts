import { z } from "zod";

export const SingleVocabularySchema = z
  .object({
    vocabularyTranslatedVi: z
      .string()
      .describe("This vocabulary translated into Vietnamese"),
    partsOfSpeech: z
      .enum([
        "verb",
        "noun",
        "adverb",
        "adjective",
        "pronoun",
        "conjunction",
        "preposition",
        "article",
        "interjection",
        "determiner",
        "other",
      ])
      .describe("parts of speech of this vocabulary"),
    pronunciation: z.string().describe("pronunciation of the vocabulary"),
    definitionEn: z.string().describe("Definition of vocabulary"),
    definitionVi: z.string().describe("Definition of vocabulary in Vietnamese"),
    exampleSentences: z.string().describe("Example sentences with vocabulary"),
    exampleSentencesVi: z
      .string()
      .describe("Meaning of example sentence in Vietnamese"),
  })
  .describe("vocabulary information");

export const VocabularyWithSentenceSchema = z
  .object({
    vocabularyTranslatedVi: z
      .string()
      .describe("This vocabulary translated into Vietnamese"),
    partsOfSpeech: z
      .enum([
        "verb",
        "noun",
        "adverb",
        "adjective",
        "pronoun",
        "conjunction",
        "preposition",
        "article",
        "interjection",
        "determiner",
        "other",
      ])
      .describe("parts of speech of this vocabulary"),
    pronunciation: z.string().describe("pronunciation of the vocabulary"),
    definitionEn: z.string().describe("Definition of vocabulary"),
    definitionVi: z.string().describe("Definition of vocabulary in Vietnamese"),
    sentencesTranslatedVi: z
      .string()
      .describe("This sentence translated into Vietnamese"),
  })
  .describe("vocabulary information");

export const TextSchema = z
  .object({
    text: z.string().describe("this text"),
    translatedVi: z.string().describe("Text translated into Vietnamese"),
    grammar: z
      .string()
      .describe(
        "Analyzing the grammar of this text, presenting it in Vietnamese and markdown for easy reading"
      ),
  })
  .describe("text information");

export const WordSchema = z.object({
  word: z
    .string()
    .describe("The lemma of the word, it is recorded in the dictionary")
    .nullable(),
});

export const techicalTerms = z.object({
  softwareSpecificTerms: z
    .array(
      z.object({
        aSoftwareSpecificTerm: z.string().describe("a software-specific term"),
        meaningEn: z
          .string()
          .describe("explain that software-specific term in English"),
        meaningVi: z
          .string()
          .describe("explain that software-specific term in Vietnamese"),
      })
    )
    .describe("software-specific terms"),
});

export const keywords = z.object({
  words: z
    .array(
      z.object({
        word: z.string().describe("a idioms or techical term or keyword"),
        meaningEn: z.string().describe("explain this word in English"),
        meaningVi: z.string().describe("explain this word in Vietnamese"),
        translatedVi: z
          .string()
          .describe("Translated this word into Vietnamese"),
      })
    )
    .describe("words"),
});
