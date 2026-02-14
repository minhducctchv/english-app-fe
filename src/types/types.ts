import { z } from "zod";
import { TextSchema } from "./jsonSchema";

export interface IVocabulary {
  _id?: any;
  id?: string;
  voca: string;
  mean: string;
  partsOfSpeech:
    | "verb"
    | "noun"
    | "adverb"
    | "adjective"
    | "pronoun"
    | "conjunction"
    | "preposition"
    | "article"
    | "interjection"
    | "determiner"
    | "other";
  pronunciation: string;
  text: string;
  textMean: string;
  audioUrl?: string;

  createdAt?: Date;
  updatedAt?: Date;

  cycle?: {
    countStudy: number;
    lastedStudyDate: Date;
    nextStudyDate: Date;
    nextStudyCoefficient: number;
    level: Level;
  };
}

export interface IApiVocabulary {
  _id?: any;
  id?: string;
  vocabulary: string;
  translatedVi: string;
  partsOfSpeech: string;
  pronunciation: string;
  definitionEn?: string;
  definitionVi?: string;
  exampleSentences: string;
  exampleSentencesVi: string;
  originalVocabulary?: string;
  originalVocabularyBackup?: string;
  audioUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
  cycle?: {
    countStudy: number;
    lastedStudyDate: Date;
    nextStudyDate: Date;
    nextStudyCoefficient: number;
    level: Level;
  };
}

export const mapApiToVoca = (apiVoca: IApiVocabulary | any): IVocabulary => {
  return {
    ...apiVoca,
    voca: apiVoca.vocabulary || apiVoca.voca,
    mean: apiVoca.translatedVi || apiVoca.mean,
    text: apiVoca.exampleSentences || apiVoca.text,
    textMean: apiVoca.exampleSentencesVi || apiVoca.textMean,
    partsOfSpeech: apiVoca.partsOfSpeech as IVocabulary["partsOfSpeech"],
  };
};

export const mapVocaToApi = (voca: IVocabulary): IApiVocabulary => {
  return {
    ...voca,
    vocabulary: voca.voca,
    translatedVi: voca.mean,
    exampleSentences: voca.text,
    exampleSentencesVi: voca.textMean,
    partsOfSpeech: voca.partsOfSpeech,
  };
};

export type IText = z.infer<typeof TextSchema>;

export interface ISplitTextResult {
  smallerTexts: string[];
}

export interface IUser {
  id?: string;
  _id?: any;
  username: string;
  password: string;
  role: "ADMIN" | "CUSTOMER";
  createdAt: Date;
}

export const vocaTest = {
  _id: "any",
  pronunciation: "ˈiːmˌəʊdʒi",
  text: "The message ended with a smiling emoji.",
  textMean: "Tin nhắn kết thúc bằng một biểu tượng cảm xúc cười.",
  partsOfSpeech: "noun",
  voca: "emoji",
  mean: "biểu tượng cảm xúc",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export interface technicalTerms {
  aSoftwareSpecificTerm: string;
  meaning: string;
}

export enum StudyCoefficient {
  FORGET = 1,
  HARD = 2,
  REMEMBER = 3,
  EASY = 4,
}

export enum Level {
  NEW = "NEW",
  FORGET = "FORGET",
  HARD = "HARD",
  REMEMBER = "REMEMBER",
  EASY = "EASY",
}

export const partOfSpeechColors: Record<string, string> = {
  noun: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
  verb: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
  adjective:
    "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200",
  adverb: "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200",
  pronoun: "bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200",
  preposition:
    "bg-stone-200 text-stone-900 border-stone-300 hover:bg-stone-300",
  conjunction:
    "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
  interjection: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
  article:
    "bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200",
  numeral: "bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-200",
  "verb phrase":
    "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200",
  "noun phrase": "bg-cyan-100 text-cyan-800 border-cyan-200 hover:bg-cyan-200",
  "adjective phrase":
    "bg-violet-100 text-violet-800 border-violet-200 hover:bg-violet-200",
  other: "bg-stone-200 text-stone-900 border-stone-300 hover:bg-stone-300", // fallback for empty string
};
